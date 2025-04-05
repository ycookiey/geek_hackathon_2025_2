/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import {
    PutCommand,
    DeleteCommand,
    GetCommand,
    QueryCommand,
    UpdateCommand,
    DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { LambdaFunctionURLEvent, ApiResponse } from "../utils/types";
import { createErrorResponse, createSuccessResponse } from "../utils/response";

// --- 共通設定 ---

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT, // ローカルテスト用。AWS環境では不要な場合が多い
});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = "MealRecord";

// --- 型定義 ---
interface MealRecord {
    userId: string;
    recordId: string; // 主キーとして使用
    recordDate: string;
    mealType: string; // breakfast, lunch, dinner, snack など
    items: {
        name: string;
        quantity: number;
        unit?: string;
        foodId?: string;
    }[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// POST リクエストボディ用
interface CreateMealRecordInput {
    recordDate: string;
    mealType: string;
    items: {
        name: string;
        quantity: number;
        unit?: string;
        foodId?: string;
    }[];
    notes?: string;
}

// PUT リクエストボディ用 (全フィールド任意)
interface UpdateMealRecordInput {
    recordDate?: string;
    mealType?: string;
    items?: {
        name: string;
        quantity: number;
        unit?: string;
        foodId?: string;
    }[];
    notes?: string;
}

// --- ヘルパー関数 ---

// パスからrecordIdを抽出
const extractRecordIdFromPath = (path: string): string | null => {
    const matches = path.match(/\/meals\/([^\/]+)$/);
    return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/**
 * 食事記録追加 (POST /meals)
 */
const createMealRecord = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");
    if (!event.body) return createErrorResponse(400, "Missing request body");

    let requestBody: CreateMealRecordInput;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        return createErrorResponse(400, "Invalid request body format", error);
    }

    // 必須項目チェック
    if (
        !requestBody.recordDate ||
        !requestBody.mealType ||
        !Array.isArray(requestBody.items) ||
        requestBody.items.length === 0
    ) {
        return createErrorResponse(
            400,
            "Missing or invalid required fields: recordDate (string), mealType (string), and items (non-empty array)"
        );
    }

    const recordId = randomUUID();
    const now = new Date().toISOString();
    const recordToSave: MealRecord = {
        userId,
        recordId,
        recordDate: requestBody.recordDate,
        mealType: requestBody.mealType,
        items: requestBody.items,
        notes: requestBody.notes,
        createdAt: now,
        updatedAt: now,
    };

    const params = { TableName: tableName, Item: recordToSave };

    try {
        console.log(
            "Putting record into DynamoDB:",
            JSON.stringify(params, null, 2)
        );
        await docClient.send(new PutCommand(params));
        console.log("DynamoDB Put successful");
        return createSuccessResponse(201, recordToSave); // Created
    } catch (error) {
        return createErrorResponse(500, "Failed to create meal record.", error);
    }
};

/**
 * 食事記録取得 (GET /meals/:recordId)
 */
const getMealRecord = async (
    event: LambdaFunctionURLEvent,
    recordId: string
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");

    const params = { TableName: tableName, Key: { userId, recordId } };

    try {
        console.log(
            "Getting record from DynamoDB:",
            JSON.stringify(params, null, 2)
        );
        const data = await docClient.send(new GetCommand(params));
        console.log("DynamoDB Get result:", JSON.stringify(data, null, 2));

        if (data.Item) {
            return createSuccessResponse(200, data.Item);
        } else {
            return createErrorResponse(404, "Meal record not found");
        }
    } catch (error) {
        return createErrorResponse(
            500,
            "Failed to retrieve meal record.",
            error
        );
    }
};

/**
 * 食事記録一覧取得 (GET /meals)
 */
const listMealRecords = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");

    // 日付によるフィルタリングオプション
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;

    let keyConditionExpression = "userId = :uid";
    const expressionAttributeValues: Record<string, any> = { ":uid": userId };

    // 日付フィルタが指定されている場合
    if (startDate && endDate) {
        keyConditionExpression += " AND recordDate BETWEEN :start AND :end";
        expressionAttributeValues[":start"] = startDate;
        expressionAttributeValues[":end"] = endDate;
    } else if (startDate) {
        keyConditionExpression += " AND recordDate >= :start";
        expressionAttributeValues[":start"] = startDate;
    } else if (endDate) {
        keyConditionExpression += " AND recordDate <= :end";
        expressionAttributeValues[":end"] = endDate;
    }

    const params = {
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
    };

    try {
        console.log(
            "Querying records from DynamoDB:",
            JSON.stringify(params, null, 2)
        );
        const result = await docClient.send(new QueryCommand(params));
        console.log(
            `DynamoDB Query successful, found ${
                result.Items?.length ?? 0
            } records.`
        );
        return createSuccessResponse(200, result.Items || []); // Itemsがない場合は空配列
    } catch (error) {
        return createErrorResponse(500, "Failed to fetch meal records.", error);
    }
};

/**
 * 食事記録更新 (PUT /meals/:recordId)
 */
const updateMealRecord = async (
    event: LambdaFunctionURLEvent,
    recordId: string
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");
    if (!event.body) return createErrorResponse(400, "Missing request body");

    let requestBody: UpdateMealRecordInput;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        return createErrorResponse(400, "Invalid request body format", error);
    }

    // 更新フィールドの動的構築
    const now = new Date().toISOString();
    let updateExpression = "SET updatedAt = :updatedAt";
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {
        ":updatedAt": now,
    };
    let fieldsToUpdateCount = 0;

    // 更新可能なフィールドをループ
    const allowedUpdateFields: (keyof UpdateMealRecordInput)[] = [
        "recordDate",
        "mealType",
        "items",
        "notes",
    ];

    for (const field of allowedUpdateFields) {
        if (requestBody[field] !== undefined) {
            // items の型チェック
            if (
                field === "items" &&
                (!Array.isArray(requestBody.items) ||
                    requestBody.items.length === 0)
            ) {
                return createErrorResponse(
                    400,
                    "Invalid type or value for field: items must be a non-empty array"
                );
            }

            const attributeNamePlaceholder = `#${field}`; // 予約語回避
            const attributeValuePlaceholder = `:${field}Val`;

            updateExpression += `, ${attributeNamePlaceholder} = ${attributeValuePlaceholder}`;
            expressionAttributeNames[attributeNamePlaceholder] = field;
            expressionAttributeValues[attributeValuePlaceholder] =
                requestBody[field];
            fieldsToUpdateCount++;
        }
    }

    // 更新するフィールドが 'updatedAt' 以外にない場合
    if (fieldsToUpdateCount === 0) {
        return createErrorResponse(400, "No valid fields provided for update");
    }

    const params = {
        TableName: tableName,
        Key: { userId, recordId },
        UpdateExpression: updateExpression,
        // ExpressionAttributeNames が空でない場合のみ設定
        ExpressionAttributeNames:
            Object.keys(expressionAttributeNames).length > 0
                ? expressionAttributeNames
                : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(recordId)", // 記録が存在することを確認
        ReturnValues: "ALL_NEW" as ReturnValue, // 更新後の記録全体を返す
    };

    try {
        console.log(
            "Updating record in DynamoDB:",
            JSON.stringify(params, null, 2)
        );
        const data = await docClient.send(new UpdateCommand(params));
        console.log(
            "DynamoDB Update successful:",
            JSON.stringify(data, null, 2)
        );
        return createSuccessResponse(200, data.Attributes);
    } catch (error: any) {
        if (error.name === "ConditionalCheckFailedException") {
            return createErrorResponse(404, "Meal record not found");
        }
        return createErrorResponse(500, "Failed to update meal record.", error);
    }
};

/**
 * 食事記録削除 (DELETE /meals/:recordId)
 */
const deleteMealRecord = async (
    event: LambdaFunctionURLEvent,
    recordId: string
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");

    const params = {
        TableName: tableName,
        Key: { userId, recordId },
        ConditionExpression: "attribute_exists(recordId)", // 記録が存在することを確認
        ReturnValues: "ALL_OLD" as const, // 削除された記録情報を返す場合
    };

    try {
        console.log(
            "Deleting record from DynamoDB:",
            JSON.stringify(params, null, 2)
        );
        const data = await docClient.send(new DeleteCommand(params));
        console.log(
            "DynamoDB Delete successful:",
            JSON.stringify(data, null, 2)
        );

        return createSuccessResponse(200, {
            message: "Meal record deleted successfully",
            deletedItem: data.Attributes, // ReturnValues=ALL_OLD の場合
        });
    } catch (error: any) {
        if (error.name === "ConditionalCheckFailedException") {
            return createErrorResponse(404, "Meal record not found");
        }
        return createErrorResponse(500, "Failed to delete meal record.", error);
    }
};

// --- エクスポート用ルーターハンドラー ---
// mealsパスのルーティングを担当
export const handleMealRoutes = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    console.log("Handling meal route:", event.rawPath);

    const method = event.requestContext.http.method;
    const path = event.rawPath;

    const recordId = extractRecordIdFromPath(path);
    const hasRecordId = recordId !== null;

    // --- ルーティング ---
    if (method === "POST" && path === "/meals") {
        // POST /meals
        return await createMealRecord(event);
    } else if (method === "GET" && hasRecordId) {
        // GET /meals/{recordId}
        return await getMealRecord(event, recordId);
    } else if (method === "GET" && path === "/meals") {
        // GET /meals
        return await listMealRecords(event);
    } else if (method === "PUT" && hasRecordId) {
        // PUT /meals/{recordId}
        return await updateMealRecord(event, recordId);
    } else if (method === "DELETE" && hasRecordId) {
        // DELETE /meals/{recordId}
        return await deleteMealRecord(event, recordId);
    } else {
        // マッチしないリクエスト
        return createErrorResponse(
            404,
            `Not Found: The requested meal resource or method (${method} ${path}) was not found.`
        );
    }
};
