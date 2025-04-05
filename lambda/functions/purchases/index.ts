/* eslint-disable @typescript-eslint/no-explicit-any */
// 想定ファイル名: lambda/functions/purchases/index.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  TransactWriteCommand,
  TransactWriteCommandInput,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { LambdaFunctionURLEvent, ApiResponse } from "../utils/types";
import { createErrorResponse, createSuccessResponse } from "../utils/response";

// --- 共通設定 ---
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const PURCHASES_TABLE_NAME = "PurchaseRecord"; // ★ ハードコード済み
const INVENTORY_TABLE_NAME = "InventoryItem"; // ★ ハードコード済み
const INVENTORY_GSI_SOURCE_PURCHASE_ID = "SourcePurchaseIdIndex"; // ★ ハードコード済み (要AWS上で作成)

// --- 型定義 ---
interface PurchaseItem {
  name: string;
  quantity: number;
  category: string;
  expiryDate: string;
  price?: number;
  unit?: string;
}
interface PurchaseRecord {
  userId: string;
  purchaseId: string;
  purchaseDate: string;
  items: PurchaseItem[]; // ★ PurchaseItem が category/expiryDate を持つように変更 // category: string; // ★ トップレベルからは削除
  totalAmount?: number;
  store?: string; // API仕様書に合わせて storeName から store に戻す (どちらでも良いが一貫性のため)
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
interface CreatePurchaseRecordInput {
  purchaseDate: string;
  items: PurchaseItem[]; // ★ PurchaseItem が category/expiryDate を持てるように変更
  totalAmount?: number;
  store?: string;
  memo?: string; // category?: string; // ★ トップレベルからは削除
}
interface UpdatePurchaseRecordInput {
  purchaseDate?: string;
  totalAmount?: number;
  store?: string;
  memo?: string; // category?: string; // ★ 更新対象外 // items は更新対象外
}
interface InventoryItemKey {
  userId: string;
  itemId: string;
}

// --- ヘルパー関数 ---
const extractPurchaseIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/purchases\/([^\/]+)$/);
  return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/** 購入記録作成 (POST /purchases) */
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

  if (
    !requestBody.purchaseDate ||
    !Array.isArray(requestBody.items) ||
    requestBody.items.length === 0
  ) {
    return createErrorResponse(
      400,
      "Missing required fields: purchaseDate and non-empty items array"
    );
  }
  if (isNaN(Date.parse(requestBody.purchaseDate))) {
    return createErrorResponse(400, "Invalid format for purchaseDate.");
  }
  for (const item of requestBody.items) {
    if (!item.name || typeof item.quantity !== "number" || item.quantity < 0) {
      return createErrorResponse(
        400,
        `Missing or invalid fields in item: name (string) and quantity (non-negative number). Item: ${JSON.stringify(
          item
        )}`
      );
    }
    // ★ expiryDate の形式チェック (任意項目のため存在する場合のみチェック)
    if (item.expiryDate && isNaN(Date.parse(item.expiryDate))) {
      return createErrorResponse(
        400,
        `Invalid format for expiryDate in item: ${item.name}`
      );
    }
  }

  const purchaseId = randomUUID();
  const now = new Date().toISOString();
  const transactionItems: TransactWriteCommandInput["TransactItems"] = []; // 購入記録本体 (トップレベルの category は削除)

  const purchaseRecord: PurchaseRecord = {
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
  transactionItems.push({
    Put: {
      TableName: PURCHASES_TABLE_NAME,
      Item: purchaseRecord,
      ConditionExpression: "attribute_not_exists(purchaseId)",
    },
  }); // 在庫アイテム作成 (category と expiryDate を purchasedItem から引き継ぐ)

  for (const purchasedItem of requestBody.items) {
    const inventoryItemId = randomUUID();
    const inventoryItem = {
      userId: userId,
      itemId: inventoryItemId,
      name: purchasedItem.name,
      quantity: purchasedItem.quantity,
      category: purchasedItem.category, // ★ 追加
      expiryDate: purchasedItem.expiryDate, // ★ 追加
      unit: purchasedItem.unit,
      sourcePurchaseId: purchaseId,
      createdAt: now,
      updatedAt: now,
      // storageLocation や memo は購入情報からは設定しない (必要なら別途追加)
    };
    transactionItems.push({
      Put: {
        TableName: INVENTORY_TABLE_NAME,
        Item: inventoryItem,
        ConditionExpression: "attribute_not_exists(itemId)",
      },
    });
  }

  const params: TransactWriteCommandInput = { TransactItems: transactionItems };
  try {
    console.log(
      "Putting record and inventory items into DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    await docClient.send(new TransactWriteCommand(params));
    console.log("DynamoDB Transaction successful");
    return createSuccessResponse(201, purchaseRecord);
  } catch (error) {
    return createErrorResponse(
      500,
      "Failed to create purchase record and inventory items.",
      error
    );
  }
};

/** 購入記録取得 (GET /purchases/:purchaseId) */
const getPurchaseRecord = async (
  event: LambdaFunctionURLEvent,
  purchaseId: string
): Promise<ApiResponse> => {
  // (変更なし)
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  const params = {
    TableName: PURCHASES_TABLE_NAME,
    Key: { userId, purchaseId },
  };
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

/** 購入記録一覧取得 (GET /purchases) */
const listPurchaseRecords = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  // (変更なし)
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  const params = {
    TableName: PURCHASES_TABLE_NAME,
    KeyConditionExpression: "userId = :uid",
    ExpressionAttributeValues: { ":uid": userId },
  };
  try {
    console.log(
      "Querying records from DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    const result = await docClient.send(new QueryCommand(params));
    console.log(
      `DynamoDB Query successful, found ${result.Items?.length ?? 0} records.`
    );
    return createSuccessResponse(200, result.Items || []);
  } catch (error) {
    return createErrorResponse(500, "Failed to fetch purchase records.", error);
  }
};

/** 購入記録更新 (PUT /purchases/:purchaseId) */
const updatePurchaseRecord = async (
  event: LambdaFunctionURLEvent,
  purchaseId: string
): Promise<ApiResponse> => {
  // (category / expiryDate は items 配列内なので、簡易版のこの関数では変更なし)
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
  const now = new Date().toISOString();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = { ":updatedAt": now };
  let fieldsToUpdateCount = 0;
  const allowedUpdateFields: (keyof UpdatePurchaseRecordInput)[] = [
    "purchaseDate",
    "totalAmount",
    "store",
    "memo",
  ]; // items と category は除外
  for (const field of allowedUpdateFields) {
    if (requestBody[field] !== undefined) {
      if (
        field === "purchaseDate" &&
        isNaN(Date.parse(requestBody.purchaseDate!))
      ) {
        return createErrorResponse(400, "Invalid format for purchaseDate.");
      }
      if (
        field === "totalAmount" &&
        typeof requestBody.totalAmount !== "number"
      ) {
        return createErrorResponse(400, "Invalid type for totalAmount.");
      }
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
    TableName: PURCHASES_TABLE_NAME,
    Key: { userId, purchaseId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames:
      Object.keys(expressionAttributeNames).length > 0
        ? expressionAttributeNames
        : undefined,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "attribute_exists(purchaseId)",
    ReturnValues: "ALL_NEW" as const,
  };
  try {
    console.log(
      "Updating record in DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    const data = await docClient.send(new UpdateCommand(params));
    console.log("DynamoDB Update successful:", JSON.stringify(data, null, 2));
    return createSuccessResponse(200, data.Attributes);
  } catch (error: any) {
    if (error.name === "ConditionalCheckFailedException") {
      return createErrorResponse(404, "Purchase record not found");
    }
    return createErrorResponse(500, "Failed to update purchase record.", error);
  }
};

/** 購入記録削除 (DELETE /purchases/:purchaseId) */
const deletePurchaseRecord = async (
  event: LambdaFunctionURLEvent,
  purchaseId: string
): Promise<ApiResponse> => {
  // (削除ロジック自体に変更はないが、削除される在庫アイテムに category/expiryDate が含まれるようになる)
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  const transactionItems: TransactWriteCommandInput["TransactItems"] = [];
  const queryInventoryParams: QueryCommandInput = {
    TableName: INVENTORY_TABLE_NAME,
    IndexName: INVENTORY_GSI_SOURCE_PURCHASE_ID,
    KeyConditionExpression: "sourcePurchaseId = :pid",
    ExpressionAttributeValues: { ":pid": purchaseId },
    ProjectionExpression: "userId, itemId",
  };
  let relatedInventoryItems: InventoryItemKey[] = [];
  try {
    console.log(
      "Querying related inventory items using GSI:",
      JSON.stringify(queryInventoryParams, null, 2)
    );
    const inventoryResult = await docClient.send(
      new QueryCommand(queryInventoryParams)
    );
    relatedInventoryItems = (inventoryResult.Items as InventoryItemKey[]) || [];
    console.log(
      `Found ${relatedInventoryItems.length} related inventory items to delete.`
    );
  } catch (error) {
    return createErrorResponse(
      500,
      "Failed to query related inventory items. Ensure GSI is configured correctly.",
      error
    );
  }
  transactionItems.push({
    Delete: {
      TableName: PURCHASES_TABLE_NAME,
      Key: { userId, purchaseId },
      ConditionExpression: "attribute_exists(purchaseId)",
    },
  });
  for (const invItemKey of relatedInventoryItems) {
    transactionItems.push({
      Delete: {
        TableName: INVENTORY_TABLE_NAME,
        Key: { userId: invItemKey.userId, itemId: invItemKey.itemId },
      },
    });
  }
  if (transactionItems.length === 1 && relatedInventoryItems.length === 0) {
    console.log("Purchase record exists but no related inventory items found.");
  } else if (transactionItems.length === 0) {
    console.warn("No items constructed for transaction.");
    return createErrorResponse(
      404,
      "Purchase record not found or invalid state."
    );
  }
  if (transactionItems.length > 100) {
    return createErrorResponse(
      400,
      `Cannot delete purchase: too many associated inventory items (${relatedInventoryItems.length}).`
    );
  }
  const params: TransactWriteCommandInput = { TransactItems: transactionItems };
  try {
    console.log(
      `Executing Purchase Delete Transaction with ${transactionItems.length} items:`,
      JSON.stringify(params, null, 2)
    );
    await docClient.send(new TransactWriteCommand(params));
    console.log(
      "DynamoDB Transaction successful (Purchase and related inventory deleted)"
    );
    return createSuccessResponse(200, {
      message:
        "Purchase record and associated inventory items deleted successfully",
      deletedPurchaseId: purchaseId,
      deletedInventoryItemCount: relatedInventoryItems.length,
    });
  } catch (error: any) {
    console.error("DynamoDB Transaction failed:", error);
    if (
      error.name === "TransactionCanceledException" &&
      error.CancellationReasons?.some(
        (reason: any) => reason.Code === "ConditionalCheckFailed"
      )
    ) {
      const purchaseDeleteFailed = error.CancellationReasons?.find(
        (reason: any, index: number) =>
          index === 0 && reason.Code === "ConditionalCheckFailed"
      );
      if (purchaseDeleteFailed) {
        return createErrorResponse(404, "Purchase record not found.");
      }
      console.error(
        "Transaction canceled, possibly due to concurrent modification or condition failure on inventory items:",
        error.CancellationReasons
      );
    }
    return createErrorResponse(
      500,
      "Failed to delete purchase record and/or associated inventory items.",
      error
    );
  }
};

// --- エクスポート用ルーターハンドラー ---
export const handlePurchaseRoutes = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  console.log("Handling purchase route:", event.rawPath);
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const purchaseId = extractPurchaseIdFromPath(path);
  const hasPurchaseId = purchaseId !== null;

  if (method === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        /* ★ utilsのcorsHeaders推奨 */ "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
      },
      body: "",
    };
  }

  if (method === "POST" && path === "/purchases") {
    return await createPurchaseRecord(event);
  } else if (method === "GET" && hasPurchaseId) {
    return await getPurchaseRecord(event, purchaseId!);
  } // purchaseIdがnullでないことを保証
  else if (method === "GET" && path === "/purchases") {
    return await listPurchaseRecords(event);
  } else if (method === "PUT" && hasPurchaseId) {
    return await updatePurchaseRecord(event, purchaseId!);
  } // purchaseIdがnullでないことを保証
  else if (method === "DELETE" && hasPurchaseId) {
    return await deletePurchaseRecord(event, purchaseId!);
  } // purchaseIdがnullでないことを保証
  else {
    return createErrorResponse(
      404,
      `Not Found: The requested purchase resource or method (${method} ${path}) was not found.`
    );
  }
};
