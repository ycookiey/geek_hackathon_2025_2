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

// --- 共通設定 ---

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT, // ローカルテスト用。AWS環境では不要な場合が多い
});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = "InventoryItem"

// CORSヘッダー (全メソッド許可)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 必要に応じてより厳格なドメインを指定
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
};

// --- 型定義 ---

// Lambda Function URL イベント型定義
interface LambdaFunctionURLEvent {
  version: string;
  routeKey: string;
  rawPath: string;
  rawQueryString: string;
  headers: Record<string, string>;
  queryStringParameters: Record<string, string> | null;
  requestContext: {
    accountId: string;
    apiId: string;
    domainName: string;
    domainPrefix: string;
    http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    requestId: string;
    routeKey: string;
    stage: string;
    time: string;
    timeEpoch: number;
  };
  body: string;
  isBase64Encoded: boolean;
}

interface InventoryItem {
  userId: string;
  itemId: string;
  name: string;
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
  quantity: number;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

// PUT リクエストボディ用 (全フィールド任意)
interface UpdateInventoryItemInput {
  name?: string;
  quantity?: number;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

// レスポンス型
interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

// --- ヘルパー関数 ---

// パスからitemIdを抽出
const extractItemIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/inventory\/([^\/]+)$/);
  return matches ? matches[1] : null;
};

// エラーレスポンス生成ヘルパー
const createErrorResponse = (
  statusCode: number,
  message: string,
  error?: any
): ApiResponse => {
  console.error(`Error ${statusCode}: ${message}`, error);
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify({
      message,
      error: error instanceof Error ? error.message : String(error),
    }),
  };
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
    typeof requestBody.quantity !== "number" ||
    requestBody.quantity < 0
  ) {
    return createErrorResponse(
      400,
      "Missing or invalid required fields: name (string) and quantity (non-negative number)"
    );
  }

  const itemId = randomUUID();
  const now = new Date().toISOString();
  const itemToSave: InventoryItem = {
    userId,
    itemId,
    name: requestBody.name,
    quantity: requestBody.quantity,
    unit: requestBody.unit,
    storageLocation: requestBody.storageLocation,
    memo: requestBody.memo,
    createdAt: now,
    updatedAt: now,
  };

  const params = { TableName: tableName!, Item: itemToSave };

  try {
    console.log("Putting item into DynamoDB:", JSON.stringify(params, null, 2));
    await docClient.send(new PutCommand(params));
    console.log("DynamoDB Put successful");
    return {
      statusCode: 201, // Created
      headers: corsHeaders,
      body: JSON.stringify(itemToSave),
    };
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

  const params = { TableName: tableName!, Key: { userId, itemId } };

  try {
    console.log("Getting item from DynamoDB:", JSON.stringify(params, null, 2));
    const data = await docClient.send(new GetCommand(params));
    console.log("DynamoDB Get result:", JSON.stringify(data, null, 2));

    if (data.Item) {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(data.Item),
      };
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
    TableName: tableName!,
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
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(result.Items || []), // Itemsがない場合は空配列
    };
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
    TableName: tableName!,
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
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data.Attributes),
    };
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
    TableName: tableName!,
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
    return {
      statusCode: 200, // または 204 No Content
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Inventory item deleted successfully",
        deletedItem: data.Attributes, // ReturnValues=ALL_OLD の場合
      }),
    };
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return createErrorResponse(404, "Inventory item not found");
    }
    return createErrorResponse(500, "Failed to delete inventory item.", error);
  }
};

// --- メインハンドラー (ルーター) ---
export const handler = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  // 環境変数チェック
  if (!tableName) {
    return createErrorResponse(
      500,
      "Internal server error: INVENTORY_TABLE_NAME environment variable is not set."
    );
  }

  // OPTIONS メソッド (CORS プリフライトリクエスト) への対応
  if (event.requestContext.http.method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  const method = event.requestContext.http.method;
  const path = event.rawPath;
  
  const itemId = extractItemIdFromPath(path);
  const hasItemId = itemId !== null;

  console.log(`Processing request: ${method} ${path} (itemId: ${itemId || 'none'})`);

  try {
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
        `Not Found: The requested resource or method (${method} ${path}) was not found.`
      );
    }
  } catch (error) {
    // 予期しない内部エラーの最終キャッチ
    return createErrorResponse(
      500,
      "An unexpected internal server error occurred.",
      error
    );
  }
};