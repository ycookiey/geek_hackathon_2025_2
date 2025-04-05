/* eslint-disable @typescript-eslint/no-explicit-any */
// 想定ファイル名: lambda/functions/inventory/index.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ★ ReturnValue は不要だったので削除
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
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = "InventoryItem"; // ★ ハードコード済み

// --- 型定義 ---
interface InventoryItem {
  userId: string;
  itemId: string;
  name: string;
  category: string;
  quantity: number;
  expiryDate: string;
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
  expiryDate: string;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

// PUT リクエストボディ用 (全フィールド任意)
interface UpdateInventoryItemInput {
  name?: string;
  category?: string;
  quantity?: number;
  expiryDate?: string;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

// --- ヘルパー関数 ---
const extractItemIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/inventory\/([^\/]+)$/);
  return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/** 在庫アイテム追加 (POST /inventory) */
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
  } // ★ 必須項目に category を含める (既存)

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
  // ★ expiryDate の形式チェック (任意項目のため存在する場合のみチェック)
  if (requestBody.expiryDate && isNaN(Date.parse(requestBody.expiryDate))) {
    return createErrorResponse(400, "Invalid format for expiryDate.");
  }

  const itemId = randomUUID();
  const now = new Date().toISOString();
  const itemToSave: InventoryItem = {
    userId,
    itemId,
    name: requestBody.name,
    category: requestBody.category, // ★ 既存
    quantity: requestBody.quantity,
    expiryDate: requestBody.expiryDate, // ★ 追加
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

/** 在庫アイテム取得 (GET /inventory/:itemId) */
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

/** 在庫一覧取得 (GET /inventory) */
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
    return createSuccessResponse(200, result.Items || []);
  } catch (error) {
    return createErrorResponse(500, "Failed to fetch inventory list.", error);
  }
};

/** 在庫アイテム更新 (PUT /inventory/:itemId) */
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

  const now = new Date().toISOString();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = { ":updatedAt": now };
  let fieldsToUpdateCount = 0; // ★ 更新可能フィールドに expiryDate を追加

  const allowedUpdateFields: (keyof UpdateInventoryItemInput)[] = [
    "name",
    "category",
    "quantity",
    "expiryDate",
    "unit",
    "storageLocation",
    "memo",
  ];
  for (const field of allowedUpdateFields) {
    if (requestBody[field] !== undefined) {
      // --- 型チェック ---
      if (
        field === "quantity" &&
        (typeof requestBody.quantity !== "number" || requestBody.quantity < 0)
      ) {
        return createErrorResponse(
          400,
          "Invalid type or value for field: quantity must be a non-negative number"
        );
      }
      if (
        field === "expiryDate" &&
        requestBody.expiryDate &&
        isNaN(Date.parse(requestBody.expiryDate))
      ) {
        return createErrorResponse(400, "Invalid format for expiryDate.");
      }
      // --- 型チェック終わり ---

      const attributeNamePlaceholder = `#${field}`;
      const attributeValuePlaceholder = `:${field}Val`;
      updateExpression += `, ${attributeNamePlaceholder} = ${attributeValuePlaceholder}`;
      expressionAttributeNames[attributeNamePlaceholder] = field;
      expressionAttributeValues[attributeValuePlaceholder] = requestBody[field];
      fieldsToUpdateCount++;
    }
  }

  if (fieldsToUpdateCount === 0) {
    return createErrorResponse(400, "No valid fields provided for update");
  }

  const params = {
    TableName: tableName,
    Key: { userId, itemId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames:
      Object.keys(expressionAttributeNames).length > 0
        ? expressionAttributeNames
        : undefined,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "attribute_exists(itemId)",
    ReturnValues: "ALL_NEW" as const, // ★ 修正: as const を使用
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

/** 在庫アイテム削除 (DELETE /inventory/:itemId) */
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
    ConditionExpression: "attribute_exists(itemId)",
    ReturnValues: "ALL_OLD" as const,
  };
  try {
    console.log(
      "Deleting item from DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    const data = await docClient.send(new DeleteCommand(params));
    console.log("DynamoDB Delete successful:", JSON.stringify(data, null, 2));
    return createSuccessResponse(200, {
      message: "Inventory item deleted successfully",
      deletedItem: data.Attributes,
    });
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return createErrorResponse(404, "Inventory item not found");
    }
    return createErrorResponse(500, "Failed to delete inventory item.", error);
  }
};

// --- エクスポート用ルーターハンドラー ---
export const handleInventoryRoutes = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  console.log("Handling inventory route:", event.rawPath);
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const itemId = extractItemIdFromPath(path);
  const hasItemId = itemId !== null;

  if (method === "OPTIONS") {
    // OPTIONSメソッドの処理
    return {
      statusCode: 200,
      headers: {
        // ★ utilsのcorsHeadersを使うように修正推奨
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      },
      body: "",
    };
  }

  if (method === "POST" && path === "/inventory") {
    return await createInventoryItem(event);
  } else if (method === "GET" && hasItemId) {
    return await getInventoryItem(event, itemId);
  } else if (method === "GET" && path === "/inventory") {
    return await listInventoryItems(event);
  } else if (method === "PUT" && hasItemId) {
    return await updateInventoryItem(event, itemId);
  } else if (method === "DELETE" && hasItemId) {
    return await deleteInventoryItem(event, itemId);
  } else {
    return createErrorResponse(
      404,
      `Not Found: The requested inventory resource or method (${method} ${path}) was not found.`
    );
  }
};
