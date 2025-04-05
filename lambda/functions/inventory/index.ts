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

const tableName = "InventoryItem";

// --- 型定義 ---
interface InventoryItem {
  userId: string;
  itemId: string;
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  storageLocation?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

// POST リクエストボディ用
interface CreateInventoryItemInput {
  name: string;
  category: string;
  quantity: number;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

// PUT リクエストボディ用 (全フィールド任意)
interface UpdateInventoryItemInput {
  name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

// --- ヘルパー関数 ---

// パスからitemIdを抽出
const extractItemIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/inventory\/([^\/]+)$/);
  return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/**
 * 在庫アイテム追加 (POST /inventory)
 */
const createInventoryItem = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  if (!event.body) return createErrorResponse(400, "Missing request body");

  let requestBody: CreateInventoryItemInput;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return createErrorResponse(400, "Invalid request body format", error);
  }

  // 必須項目チェック
  if (
    !requestBody.name ||
    !requestBody.category ||
    typeof requestBody.quantity !== "number" ||
    requestBody.quantity < 0
  ) {
    return createErrorResponse(
      400,
      "Missing or invalid required fields: name (string), category (string) and quantity (non-negative number)"
    );
  }

  const itemId = randomUUID();
  const now = new Date().toISOString();
  const itemToSave: InventoryItem = {
    userId,
    itemId,
    name: requestBody.name,
    category: requestBody.category,
    quantity: requestBody.quantity,
    unit: requestBody.unit,
    storageLocation: requestBody.storageLocation,
    memo: requestBody.memo,
    createdAt: now,
    updatedAt: now,
  };

  const params = { TableName: tableName, Item: itemToSave };

  try {
    console.log("Putting item into DynamoDB:", JSON.stringify(params, null, 2));
    await docClient.send(new PutCommand(params));
    console.log("DynamoDB Put successful");
    return createSuccessResponse(201, itemToSave); // Created
  } catch (error) {
    return createErrorResponse(500, "Failed to create inventory item.", error);
  }
};

/**
 * 在庫アイテム取得 (GET /inventory/:itemId)
 */
const getInventoryItem = async (
  event: LambdaFunctionURLEvent,
  itemId: string
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");

  const params = { TableName: tableName, Key: { userId, itemId } };

  try {
    console.log("Getting item from DynamoDB:", JSON.stringify(params, null, 2));
    const data = await docClient.send(new GetCommand(params));
    console.log("DynamoDB Get result:", JSON.stringify(data, null, 2));

    if (data.Item) {
      return createSuccessResponse(200, data.Item);
    } else {
      return createErrorResponse(404, "Inventory item not found");
    }
  } catch (error) {
    return createErrorResponse(
      500,
      "Failed to retrieve inventory item.",
      error
    );
  }
};

/**
 * 在庫一覧取得 (GET /inventory)
 */
const listInventoryItems = async (
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
      "Querying items from DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    const result = await docClient.send(new QueryCommand(params));
    console.log(
      `DynamoDB Query successful, found ${result.Items?.length ?? 0} items.`
    );
    return createSuccessResponse(200, result.Items || []); // Itemsがない場合は空配列
  } catch (error) {
    return createErrorResponse(500, "Failed to fetch inventory list.", error);
  }
};

/**
 * 在庫アイテム更新 (PUT /inventory/:itemId)
 */
const updateInventoryItem = async (
  event: LambdaFunctionURLEvent,
  itemId: string
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  if (!event.body) return createErrorResponse(400, "Missing request body");

  let requestBody: UpdateInventoryItemInput;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    return createErrorResponse(400, "Invalid request body format", error);
  }

  // 更新フィールドの動的構築
  const now = new Date().toISOString();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = { ":updatedAt": now };
  let fieldsToUpdateCount = 0;

  // 更新可能なフィールドをループ
  const allowedUpdateFields: (keyof UpdateInventoryItemInput)[] = [
    "name",
    "category",
    "quantity",
    "unit",
    "storageLocation",
    "memo",
  ];
  for (const field of allowedUpdateFields) {
    if (requestBody[field] !== undefined) {
      // quantity の型チェック
      if (
        field === "quantity" &&
        (typeof requestBody.quantity !== "number" || requestBody.quantity < 0)
      ) {
        return createErrorResponse(
          400,
          "Invalid type or value for field: quantity must be a non-negative number"
        );
      }

      const attributeNamePlaceholder = `#${field}`; // 予約語回避
      const attributeValuePlaceholder = `:${field}Val`;

      updateExpression += `, ${attributeNamePlaceholder} = ${attributeValuePlaceholder}`;
      expressionAttributeNames[attributeNamePlaceholder] = field;
      expressionAttributeValues[attributeValuePlaceholder] = requestBody[field];
      fieldsToUpdateCount++;
    }
  }

  // 更新するフィールドが 'updatedAt' 以外にない場合
  if (fieldsToUpdateCount === 0) {
    return createErrorResponse(400, "No valid fields provided for update");
  }

  const params = {
    TableName: tableName,
    Key: { userId, itemId },
    UpdateExpression: updateExpression,
    // ExpressionAttributeNames が空でない場合のみ設定
    ExpressionAttributeNames:
      Object.keys(expressionAttributeNames).length > 0
        ? expressionAttributeNames
        : undefined,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "attribute_exists(itemId)", // アイテムが存在することを確認
    ReturnValues: "ALL_NEW" as ReturnValue, // 更新後のアイテム全体を返す
  };

  try {
    console.log("Updating item in DynamoDB:", JSON.stringify(params, null, 2));
    const data = await docClient.send(new UpdateCommand(params));
    console.log("DynamoDB Update successful:", JSON.stringify(data, null, 2));
    return createSuccessResponse(200, data.Attributes);
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return createErrorResponse(404, "Inventory item not found");
    }
    return createErrorResponse(500, "Failed to update inventory item.", error);
  }
};

/**
 * 在庫アイテム削除 (DELETE /inventory/:itemId)
 */
const deleteInventoryItem = async (
  event: LambdaFunctionURLEvent,
  itemId: string
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");

  const params = {
    TableName: tableName,
    Key: { userId, itemId },
    ConditionExpression: "attribute_exists(itemId)", // アイテムが存在することを確認
    ReturnValues: "ALL_OLD" as const, // 削除されたアイテム情報を返す場合
  };

  try {
    console.log(
      "Deleting item from DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    const data = await docClient.send(new DeleteCommand(params));
    console.log("DynamoDB Delete successful:", JSON.stringify(data, null, 2));

    // 削除成功レスポンス (削除されたアイテム情報を含むか、含まないか選択)
    return createSuccessResponse(200, {
      message: "Inventory item deleted successfully",
      deletedItem: data.Attributes, // ReturnValues=ALL_OLD の場合
    });
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return createErrorResponse(404, "Inventory item not found");
    }
    return createErrorResponse(500, "Failed to delete inventory item.", error);
  }
};

// --- エクスポート用ルーターハンドラー ---
// inventoryパスのルーティングを担当
export const handleInventoryRoutes = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  console.log("Handling inventory route:", event.rawPath);
  
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  
  const itemId = extractItemIdFromPath(path);
  const hasItemId = itemId !== null;

  // --- ルーティング ---
  if (method === "POST" && path === "/inventory") {
    // POST /inventory
    return await createInventoryItem(event);
  } else if (method === "GET" && hasItemId) {
    // GET /inventory/{itemId}
    return await getInventoryItem(event, itemId);
  } else if (method === "GET" && path === "/inventory") {
    // GET /inventory
    return await listInventoryItems(event);
  } else if (method === "PUT" && hasItemId) {
    // PUT /inventory/{itemId}
    return await updateInventoryItem(event, itemId);
  } else if (method === "DELETE" && hasItemId) {
    // DELETE /inventory/{itemId}
    return await deleteInventoryItem(event, itemId);
  } else {
    // マッチしないリクエスト
    return createErrorResponse(
      404,
      `Not Found: The requested inventory resource or method (${method} ${path}) was not found.`
    );
  }
};