/* eslint-disable @typescript-eslint/no-explicit-any */
// 想定ファイル名: lambda/functions/purchases/index.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  // PutCommand, // TransactWrite に含めるため直接は使わない
  // DeleteCommand, // TransactWrite に含めるため直接は使わない
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  TransactWriteCommand, // ★ 修正: トランザクション用コマンドをインポート
  TransactWriteCommandInput,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { LambdaFunctionURLEvent, ApiResponse } from "../utils/types"; // ユーザー提供の型を使用
import { createErrorResponse, createSuccessResponse } from "../utils/response"; // ユーザー提供のヘルパーを使用

// --- 共通設定 ---

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// テーブル名のハードコーディング ★★★ 実際のテーブル名に合わせてください ★★★
const PURCHASES_TABLE_NAME = "PurchaseRecord";
const INVENTORY_TABLE_NAME = "InventoryItem";
// 在庫テーブルのGSI名 ★★★ 実際に作成するGSI名に合わせてください ★★★
const INVENTORY_GSI_SOURCE_PURCHASE_ID = "SourcePurchaseIdIndex";

// --- 型定義 (ユーザー提供の型に合わせるが、内容は前回同様) ---
interface PurchaseItem {
  name: string;
  quantity: number;
  price?: number;
  unit?: string;
}
interface PurchaseRecord {
  userId: string;
  purchaseId: string;
  purchaseDate: string;
  items: PurchaseItem[];
  totalAmount?: number;
  store?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}
interface CreatePurchaseRecordInput {
  purchaseDate: string;
  items: PurchaseItem[];
  totalAmount?: number;
  store?: string;
  memo?: string;
}
interface UpdatePurchaseRecordInput {
  purchaseDate?: string;
  totalAmount?: number;
  store?: string;
  memo?: string;
} // ★修正: items を更新対象外に
interface InventoryItemKey {
  userId: string;
  itemId: string;
}

// --- ヘルパー関数 ---
// パスからpurchaseIdを抽出 (ユーザー提供のコードを維持)
const extractPurchaseIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/purchases\/([^\/]+)$/);
  return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/**
 * 購入記録追加 (POST /purchases)
 * ★修正: 在庫アイテムも同時に作成する (トランザクション使用)
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
  }

  const purchaseId = randomUUID();
  const now = new Date().toISOString();
  const transactionItems: TransactWriteCommandInput["TransactItems"] = [];

  // 購入記録本体
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
  });

  // 在庫アイテム作成
  for (const purchasedItem of requestBody.items) {
    const inventoryItemId = randomUUID();
    const inventoryItem = {
      userId: userId,
      itemId: inventoryItemId,
      name: purchasedItem.name,
      quantity: purchasedItem.quantity,
      unit: purchasedItem.unit,
      sourcePurchaseId: purchaseId,
      createdAt: now,
      updatedAt: now,
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
    await docClient.send(new TransactWriteCommand(params)); // ★ 修正: TransactWriteCommand を使用
    console.log("DynamoDB Transaction successful");
    return createSuccessResponse(201, purchaseRecord); // Created
  } catch (error) {
    return createErrorResponse(
      500,
      "Failed to create purchase record and inventory items.",
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

/**
 * 購入記録更新 (PUT /purchases/:purchaseId)
 * ★修正: items 配列の更新は行わない簡易版
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

  const now = new Date().toISOString();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = { ":updatedAt": now };
  let fieldsToUpdateCount = 0;

  // ★修正: items を更新対象から除外
  const allowedUpdateFields: (keyof UpdatePurchaseRecordInput)[] = [
    "purchaseDate",
    "totalAmount",
    "store",
    "memo",
  ];

  for (const field of allowedUpdateFields) {
    if (requestBody[field] !== undefined) {
      // --- 型チェック ---
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
    TableName: PURCHASES_TABLE_NAME,
    Key: { userId, purchaseId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames:
      Object.keys(expressionAttributeNames).length > 0
        ? expressionAttributeNames
        : undefined,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "attribute_exists(purchaseId)",
    ReturnValues: "ALL_NEW" as const, // ★修正: as const を使用
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

/**
 * 購入記録削除 (DELETE /purchases/:purchaseId)
 * ★修正: 関連する在庫アイテムも同時に削除する (トランザクション + GSI使用)
 */
const deletePurchaseRecord = async (
  event: LambdaFunctionURLEvent,
  purchaseId: string
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");

  const transactionItems: TransactWriteCommandInput["TransactItems"] = [];

  // 1. 関連する在庫アイテムを検索 (GSIを使用)
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
    // GSI検索失敗は致命的エラーとする
    return createErrorResponse(
      500,
      "Failed to query related inventory items. Ensure GSI is configured correctly.",
      error
    );
  }

  // 2. トランザクションアイテムを構築
  // 2a. 購入記録本体の削除
  transactionItems.push({
    Delete: {
      TableName: PURCHASES_TABLE_NAME,
      Key: { userId, purchaseId },
      ConditionExpression: "attribute_exists(purchaseId)",
    },
  });
  // 2b. 関連在庫アイテムの削除
  for (const invItemKey of relatedInventoryItems) {
    transactionItems.push({
      Delete: {
        TableName: INVENTORY_TABLE_NAME,
        Key: { userId: invItemKey.userId, itemId: invItemKey.itemId },
      },
    });
  }

  // トランザクションアイテム数チェック (上限など)
  if (transactionItems.length === 1 && relatedInventoryItems.length === 0) {
    // 購入記録はあるが関連在庫がない場合 (ありえる)
    console.log("Purchase record exists but no related inventory items found.");
  } else if (transactionItems.length === 0) {
    // 購入記録の削除アイテムすら作れない＝purchaseIdがおかしい等。ただしConditionExpressionで捕捉されるはず。
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

  // 3. トランザクションの実行
  const params: TransactWriteCommandInput = { TransactItems: transactionItems };
  try {
    console.log(
      `Executing Purchase Delete Transaction with ${transactionItems.length} items:`,
      JSON.stringify(params, null, 2)
    );
    await docClient.send(new TransactWriteCommand(params)); // ★ 修正: TransactWriteCommand を使用
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
      // 在庫アイテム削除での ConditionFailed は通常発生しないはずだが、念のため
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
// purchasesパスのルーティングを担当 (ユーザー提供のロジックを維持)
export const handlePurchaseRoutes = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  console.log("Handling purchase route:", event.rawPath);

  // ★ 修正: メソッドの取得元 (Function URL event v2 形式に合わせる)
  const method = event.requestContext.http.method;
  const path = event.rawPath;

  const purchaseId = extractPurchaseIdFromPath(path); // ユーザー提供のヘルパーを使用
  const hasPurchaseId = purchaseId !== null;

  // OPTIONSメソッドの処理 (response.ts に移譲も可能)
  if (method === "OPTIONS") {
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

  // --- ルーティング ---
  // ★ 注意: このルーティングは event.rawPath が期待通り /purchases や /purchases/xyz になっている前提
  if (method === "POST" && path === "/purchases") {
    return await createPurchaseRecord(event);
  } else if (method === "GET" && hasPurchaseId) {
    return await getPurchaseRecord(event, purchaseId);
  } else if (method === "GET" && path === "/purchases") {
    return await listPurchaseRecords(event);
  } else if (method === "PUT" && hasPurchaseId) {
    return await updatePurchaseRecord(event, purchaseId);
  } else if (method === "DELETE" && hasPurchaseId) {
    return await deletePurchaseRecord(event, purchaseId);
  } else {
    return createErrorResponse(
      404,
      `Not Found: The requested purchase resource or method (${method} ${path}) was not found.`
    );
  }
};

// 必要であれば、このファイル自身をLambdaのエントリーポイントにする
// export const handler = handlePurchaseRoutes;
// もしくは、別のエントリーポイントファイルから handlePurchaseRoutes を import して使用する
