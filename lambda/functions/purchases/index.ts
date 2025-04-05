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

const tableName = "PurchaseRecord";

// --- 型定義 ---
interface PurchaseRecord {
    userId: string;
    purchaseId: string;
    purchaseDate: string;
    items: {
        name: string;
        quantity: number;
        price?: number;
        unit?: string;
    }[];
    totalAmount?: number;
    store?: string;
    memo?: string;
    createdAt: string;
    updatedAt: string;
}

// POST リクエストボディ用
interface CreatePurchaseRecordInput {
    purchaseDate: string;
    items: {
        name: string;
        quantity: number;
        price?: number;
        unit?: string;
    }[];
    totalAmount?: number;
    store?: string;
    memo?: string;
}

// PUT リクエストボディ用 (全フィールド任意)
interface UpdatePurchaseRecordInput {
    purchaseDate?: string;
    items?: {
        name: string;
        quantity: number;
        price?: number;
        unit?: string;
    }[];
    totalAmount?: number;
    store?: string;
    memo?: string;
}

// --- ヘルパー関数 ---

// パスからpurchaseIdを抽出
const extractPurchaseIdFromPath = (path: string): string | null => {
    const matches = path.match(/\/purchases\/([^\/]+)$/);
    return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/**
 * 購入記録追加 (POST /purchases)
 */
const createPurchaseRecord = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");
    if (!event.body) return createErrorResponse(400, "Missing request body");

    let requestBody: CreatePurchaseRecordInput;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        return createErrorResponse(400, "Invalid request body format", error);
    }

    // 必須項目チェック
    if (
        !requestBody.purchaseDate ||
        !Array.isArray(requestBody.items) ||
        requestBody.items.length === 0
    ) {
        return createErrorResponse(
            400,
            "Missing or invalid required fields: purchaseDate (string) and items (non-empty array)"
        );
    }

    const purchaseId = randomUUID();
    const now = new Date().toISOString();
    const recordToSave: PurchaseRecord = {
        userId,
        purchaseId,
        purchaseDate: requestBody.purchaseDate,
        items: requestBody.items,
        totalAmount: requestBody.totalAmount,
        store: requestBody.store,
        memo: requestBody.memo,
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
        return createErrorResponse(
            500,
            "Failed to create purchase record.",
            error
        );
    }
};

/**
 * 購入記録取得 (GET /purchases/:purchaseId)
 */
const getPurchaseRecord = async (
    event: LambdaFunctionURLEvent,
    purchaseId: string
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");

    const params = { TableName: tableName, Key: { userId, purchaseId } };

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
            return createErrorResponse(404, "Purchase record not found");
        }
    } catch (error) {
        return createErrorResponse(
            500,
            "Failed to retrieve purchase record.",
            error
        );
    }
};

/**
 * 購入記録一覧取得 (GET /purchases)
 */
const listPurchaseRecords = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");

    const params = {
        TableName: tableName,
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: { ":uid": userId },
        // 必要に応じて他のパラメータ (ProjectionExpression, Limit, etc.) を追加
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
        return createErrorResponse(
            500,
            "Failed to fetch purchase records.",
            error
        );
    }
};

/**
 * 購入記録更新 (PUT /purchases/:purchaseId)
 */
const updatePurchaseRecord = async (
    event: LambdaFunctionURLEvent,
    purchaseId: string
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");
    if (!event.body) return createErrorResponse(400, "Missing request body");

    let requestBody: UpdatePurchaseRecordInput;
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
    const allowedUpdateFields: (keyof UpdatePurchaseRecordInput)[] = [
        "purchaseDate",
        "items",
        "totalAmount",
        "store",
        "memo",
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
        Key: { userId, purchaseId },
        UpdateExpression: updateExpression,
        // ExpressionAttributeNames が空でない場合のみ設定
        ExpressionAttributeNames:
            Object.keys(expressionAttributeNames).length > 0
                ? expressionAttributeNames
                : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(purchaseId)", // 記録が存在することを確認
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
            return createErrorResponse(404, "Purchase record not found");
        }
        return createErrorResponse(
            500,
            "Failed to update purchase record.",
            error
        );
    }
};

/**
 * 購入記録削除 (DELETE /purchases/:purchaseId)
 */
const deletePurchaseRecord = async (
    event: LambdaFunctionURLEvent,
    purchaseId: string
): Promise<ApiResponse> => {
    const userId = event.queryStringParameters?.userId;
    if (!userId)
        return createErrorResponse(400, "Missing userId query parameter");

    const params = {
        TableName: tableName,
        Key: { userId, purchaseId },
        ConditionExpression: "attribute_exists(purchaseId)", // 記録が存在することを確認
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
            message: "Purchase record deleted successfully",
            deletedItem: data.Attributes, // ReturnValues=ALL_OLD の場合
        });
    } catch (error: any) {
        if (error.name === "ConditionalCheckFailedException") {
            return createErrorResponse(404, "Purchase record not found");
        }
        return createErrorResponse(
            500,
            "Failed to delete purchase record.",
            error
        );
    }
};

// --- エクスポート用ルーターハンドラー ---
// purchasesパスのルーティングを担当
export const handlePurchaseRoutes = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    console.log("Handling purchase route:", event.rawPath);

    const method = event.requestContext.http.method;
    const path = event.rawPath;

    const purchaseId = extractPurchaseIdFromPath(path);
    const hasPurchaseId = purchaseId !== null;

    // --- ルーティング ---
    if (method === "POST" && path === "/purchases") {
        // POST /purchases
        return await createPurchaseRecord(event);
    } else if (method === "GET" && hasPurchaseId) {
        // GET /purchases/{purchaseId}
        return await getPurchaseRecord(event, purchaseId);
    } else if (method === "GET" && path === "/purchases") {
        // GET /purchases
        return await listPurchaseRecords(event);
    } else if (method === "PUT" && hasPurchaseId) {
        // PUT /purchases/{purchaseId}
        return await updatePurchaseRecord(event, purchaseId);
    } else if (method === "DELETE" && hasPurchaseId) {
        // DELETE /purchases/{purchaseId}
        return await deletePurchaseRecord(event, purchaseId);
    } else {
        // マッチしないリクエスト
        return createErrorResponse(
            404,
            `Not Found: The requested purchase resource or method (${method} ${path}) was not found.`
        );
    }
};
