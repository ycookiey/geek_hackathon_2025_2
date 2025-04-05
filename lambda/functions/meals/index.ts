/* eslint-disable @typescript-eslint/no-explicit-any */
// 想定ファイル名: lambda/functions/meals/index.ts
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  // PutCommand, // TransactWrite に含めるため直接は使わない
  // DeleteCommand, // TransactWrite に含めるため直接は使わない
  GetCommand,
  QueryCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
  TransactWriteCommand, // ★ 追加: トランザクション用
  TransactWriteCommandInput,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import {
  LambdaFunctionURLEvent,
  ApiResponse,
  corsHeaders,
} from "../utils/types"; // corsHeaders も import
import { createErrorResponse, createSuccessResponse } from "../utils/response";

// --- 共通設定 ---
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// テーブル名・GSI名のハードコーディング ★★★ 実際の名前を確認・修正してください ★★★
const MEALS_TABLE_NAME = "MealRecord";
const INVENTORY_TABLE_NAME = "InventoryItem";
const MEALS_GSI_DATE_INDEX = "RecordDateIndex"; // ★ 食事記録テーブルの日付検索用GSI名

// --- 型定義 ---
// ★ MealItem に inventoryItemId と consumedQuantity を追加
interface MealItem {
  inventoryItemId: string; // ★必須: 消費した在庫アイテムのID
  consumedQuantity: number; // ★必須: 消費量 (quantity から変更)
  name?: string; // 表示用などに任意で保持可能
  unit?: string; // 表示用などに任意で保持可能
  foodId?: string; // spec にあった任意項目
}
interface MealRecord {
  userId: string; // PK
  recordId: string; // SK
  recordDate: string;
  mealType: string;
  items: MealItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
// ★ Create input も MealItem の変更を反映
interface CreateMealRecordInput {
  recordDate: string;
  mealType: string;
  items: MealItem[]; // inventoryItemId と consumedQuantity が必須
  notes?: string;
}
// ★ Update input は items を含まない簡易版
interface UpdateMealRecordInput {
  recordDate?: string;
  mealType?: string;
  notes?: string;
}
// interface InventoryItemKey { userId: string; itemId: string; } // 必要なら purchases から import または再定義

// --- ヘルパー関数 ---
const extractRecordIdFromPath = (path: string): string | null => {
  const matches = path.match(/\/meals\/([^\/]+)$/);
  return matches ? matches[1] : null;
};

// --- 各API処理関数 ---

/**
 * 食事記録追加 (POST /meals)
 * ★修正: 在庫アイテムの数量を減算する (トランザクション使用)
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

  // --- 入力検証 ---
  if (
    !requestBody.recordDate ||
    !requestBody.mealType ||
    !Array.isArray(requestBody.items) ||
    requestBody.items.length === 0
  ) {
    return createErrorResponse(
      400,
      "Missing required fields: recordDate, mealType, and non-empty items array"
    );
  }
  if (isNaN(Date.parse(requestBody.recordDate))) {
    return createErrorResponse(400, "Invalid format for recordDate.");
  }
  for (const item of requestBody.items) {
    // ★ inventoryItemId と consumedQuantity のチェックを追加
    if (
      !item.inventoryItemId ||
      typeof item.consumedQuantity !== "number" ||
      item.consumedQuantity <= 0
    ) {
      return createErrorResponse(
        400,
        `Missing or invalid fields in item: inventoryItemId (string) and consumedQuantity (positive number). Item: ${JSON.stringify(
          item
        )}`
      );
    }
  }
  // --- 検証終わり ---

  const recordId = randomUUID();
  const now = new Date().toISOString();
  const transactionItems: TransactWriteCommandInput["TransactItems"] = [];

  // 1. 食事記録本体の作成オペレーション
  const mealRecord: MealRecord = {
    userId,
    recordId,
    recordDate: requestBody.recordDate,
    mealType: requestBody.mealType,
    items: requestBody.items,
    notes: requestBody.notes,
    createdAt: now,
    updatedAt: now,
  };
  transactionItems.push({
    Put: {
      TableName: MEALS_TABLE_NAME,
      Item: mealRecord,
      ConditionExpression: "attribute_not_exists(recordId)",
    },
  });

  // 2. 各消費アイテムに対応する在庫の減算オペレーション
  for (const item of requestBody.items) {
    transactionItems.push({
      Update: {
        TableName: INVENTORY_TABLE_NAME,
        Key: { userId: userId, itemId: item.inventoryItemId },
        UpdateExpression:
          "SET quantity = quantity - :consumed, updatedAt = :now",
        ConditionExpression:
          "attribute_exists(itemId) AND quantity >= :consumed", // ★ 在庫存在＆不足チェック
        ExpressionAttributeValues: {
          ":consumed": item.consumedQuantity,
          ":now": now,
        },
      },
    });
  }

  // トランザクションアイテム数チェック
  if (transactionItems.length > 100) {
    return createErrorResponse(
      400,
      `Cannot create meal record: too many items consumed (${requestBody.items.length}). Limit is 99 items per record for inventory update.`
    );
  } // 1(MealRecord) + 99(InventoryItems) = 100

  // トランザクション実行
  const params: TransactWriteCommandInput = { TransactItems: transactionItems };
  try {
    console.log(
      `Executing Meal Create Transaction with ${transactionItems.length} items:`,
      JSON.stringify(params, null, 2)
    );
    await docClient.send(new TransactWriteCommand(params));
    console.log(
      "DynamoDB Transaction successful (Meal record created and inventory updated)"
    );
    return createSuccessResponse(201, mealRecord);
  } catch (error: any) {
    console.error("DynamoDB Transaction failed:", error);
    // 在庫不足や在庫アイテムが存在しない場合のエラーハンドリング
    if (
      error.name === "TransactionCanceledException" &&
      error.CancellationReasons?.some(
        (reason: any) => reason.Code === "ConditionalCheckFailed"
      )
    ) {
      const failedReason = error.CancellationReasons.find(
        (reason: any) => reason.Code === "ConditionalCheckFailed"
      );
      // 失敗したアイテムのインデックスを探す (0はMealRecordのPut)
      const failedItemIndex = error.CancellationReasons.findIndex(
        (reason: any) => reason.Code === "ConditionalCheckFailed"
      );
      if (failedItemIndex > 0 && failedItemIndex <= requestBody.items.length) {
        const failedInventoryItem = requestBody.items[failedItemIndex - 1];
        return createErrorResponse(
          400,
          `Failed to consume item: Insufficient stock or item not found for inventoryItemId '${failedInventoryItem.inventoryItemId}'.`,
          error.message
        );
      }
    }
    return createErrorResponse(
      500,
      "Failed to create meal record or update inventory.",
      error
    );
  }
};

/**
 * 食事記録一覧取得 (GET /meals)
 * ★修正: 日付フィルタリングに GSI (`RecordDateIndex`) を使用
 */
const listMealRecords = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");

  const startDate = event.queryStringParameters?.startDate;
  const endDate = event.queryStringParameters?.endDate;

  // ★ GSI を使うためのパラメータ設定
  const params: QueryCommandInput = {
    TableName: MEALS_TABLE_NAME,
    IndexName: MEALS_GSI_DATE_INDEX, // ★ GSI 名を指定
    KeyConditionExpression: "userId = :uid", // GSI の HASH キー
    ExpressionAttributeValues: { ":uid": userId },
  };

  // 日付フィルタを KeyConditionExpression に追加 (GSI の RANGE キー 'recordDate' を使用)
  if (startDate && endDate) {
    params.KeyConditionExpression += " AND recordDate BETWEEN :start AND :end";
    params.ExpressionAttributeValues![":start"] = startDate;
    params.ExpressionAttributeValues![":end"] = endDate;
  } else if (startDate) {
    params.KeyConditionExpression += " AND recordDate >= :start";
    params.ExpressionAttributeValues![":start"] = startDate;
  } else if (endDate) {
    params.KeyConditionExpression += " AND recordDate <= :end";
    params.ExpressionAttributeValues![":end"] = endDate;
  }
  // itemType フィルタリングは未実装

  try {
    console.log(
      "Querying meal records from DynamoDB using GSI:",
      JSON.stringify(params, null, 2)
    );
    const result = await docClient.send(new QueryCommand(params));
    console.log(
      `DynamoDB Query successful, found ${result.Items?.length ?? 0} records.`
    );
    return createSuccessResponse(200, result.Items || []);
  } catch (error) {
    // GSI が存在しない場合などのエラーを考慮
    return createErrorResponse(
      500,
      "Failed to fetch meal records. Ensure RecordDateIndex GSI exists.",
      error
    );
  }
};

/** 食事記録取得 (GET /meals/:recordId) */
const getMealRecord = async (
  event: LambdaFunctionURLEvent,
  recordId: string
): Promise<ApiResponse> => {
  // (PK/SKが userId/recordId であれば変更なし)
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  const params = { TableName: MEALS_TABLE_NAME, Key: { userId, recordId } };
  try {
    console.log(
      "Getting meal record from DynamoDB:",
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
    return createErrorResponse(500, "Failed to retrieve meal record.", error);
  }
};

/**
 * 食事記録更新 (PUT /meals/:recordId)
 * ★修正: items 配列の更新は行わない簡易版
 */
const updateMealRecord = async (
  event: LambdaFunctionURLEvent,
  recordId: string
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");
  if (!event.body) return createErrorResponse(400, "Missing request body");

  let requestBody: UpdateMealRecordInput; // items を含まない型
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
  const allowedUpdateFields: (keyof UpdateMealRecordInput)[] = [
    "recordDate",
    "mealType",
    "notes",
  ];
  for (const field of allowedUpdateFields) {
    if (requestBody[field] !== undefined) {
      if (
        field === "recordDate" &&
        isNaN(Date.parse(requestBody.recordDate!))
      ) {
        return createErrorResponse(400, "Invalid format for recordDate.");
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
    TableName: MEALS_TABLE_NAME,
    Key: { userId, recordId },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames:
      Object.keys(expressionAttributeNames).length > 0
        ? expressionAttributeNames
        : undefined,
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "attribute_exists(recordId)",
    ReturnValues: "ALL_NEW" as const, // ★修正: as const
  };
  try {
    console.log(
      "Updating meal record in DynamoDB:",
      JSON.stringify(params, null, 2)
    );
    const data = await docClient.send(new UpdateCommand(params));
    console.log("DynamoDB Update successful:", JSON.stringify(data, null, 2));
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
 * ★修正: 関連する在庫アイテムの数量を戻す (トランザクション使用)
 */
const deleteMealRecord = async (
  event: LambdaFunctionURLEvent,
  recordId: string
): Promise<ApiResponse> => {
  const userId = event.queryStringParameters?.userId;
  if (!userId)
    return createErrorResponse(400, "Missing userId query parameter");

  // 1. 削除対象の食事記録を取得して、消費されたアイテム情報を得る
  let mealRecordToDelete: MealRecord | null = null;
  try {
    const getParams = {
      TableName: MEALS_TABLE_NAME,
      Key: { userId, recordId },
    };
    const getData = await docClient.send(new GetCommand(getParams));
    if (!getData.Item) {
      return createErrorResponse(404, "Meal record not found");
    }
    mealRecordToDelete = getData.Item as MealRecord;
  } catch (error) {
    return createErrorResponse(
      500,
      "Failed to retrieve meal record before deletion.",
      error
    );
  }

  // 2. トランザクションアイテムを構築
  const transactionItems: TransactWriteCommandInput["TransactItems"] = [];
  const now = new Date().toISOString();

  // 2a. 食事記録本体の削除オペレーション
  transactionItems.push({
    Delete: {
      TableName: MEALS_TABLE_NAME,
      Key: { userId, recordId },
      ConditionExpression: "attribute_exists(recordId)", // 存在確認
    },
  });

  // 2b. 消費された在庫アイテムの数量を戻すオペレーション
  if (mealRecordToDelete && mealRecordToDelete.items) {
    for (const item of mealRecordToDelete.items) {
      if (item.inventoryItemId && item.consumedQuantity > 0) {
        // 念のためチェック
        transactionItems.push({
          Update: {
            TableName: INVENTORY_TABLE_NAME,
            Key: { userId: userId, itemId: item.inventoryItemId },
            UpdateExpression:
              "SET quantity = quantity + :consumed, updatedAt = :now",
            ConditionExpression: "attribute_exists(itemId)", // 在庫が存在することを確認
            ExpressionAttributeValues: {
              ":consumed": item.consumedQuantity, // 削除なので消費量を加算する
              ":now": now,
            },
          },
        });
      } else {
        console.warn(
          `Skipping inventory update for item in deleted meal record ${recordId} due to missing inventoryItemId or consumedQuantity: ${JSON.stringify(
            item
          )}`
        );
      }
    }
  }

  // トランザクションアイテム数チェック
  if (
    transactionItems.length === 1 &&
    (!mealRecordToDelete?.items || mealRecordToDelete.items.length === 0)
  ) {
    console.log("Meal record exists but no related inventory items to update.");
  } else if (transactionItems.length === 0) {
    // Getでチェック済みなので通常ここには来ない
    console.error("No items constructed for transaction.");
    return createErrorResponse(404, "Meal record not found or invalid state.");
  }
  if (transactionItems.length > 100) {
    return createErrorResponse(
      400,
      `Cannot delete meal record: too many items consumed (${
        mealRecordToDelete?.items?.length ?? 0
      }). Limit is 99 items per record.`
    );
  }

  // 3. トランザクションの実行
  const params: TransactWriteCommandInput = { TransactItems: transactionItems };
  try {
    console.log(
      `Executing Meal Delete Transaction with ${transactionItems.length} items:`,
      JSON.stringify(params, null, 2)
    );
    await docClient.send(new TransactWriteCommand(params));
    console.log(
      "DynamoDB Transaction successful (Meal record deleted and inventory updated)"
    );
    return createSuccessResponse(200, {
      message:
        "Meal record and associated inventory adjustments completed successfully",
      deletedRecordId: recordId,
      inventoryItemsAdjusted: mealRecordToDelete?.items?.length ?? 0,
    });
  } catch (error: any) {
    console.error("DynamoDB Transaction failed:", error);
    if (
      error.name === "TransactionCanceledException" &&
      error.CancellationReasons?.some(
        (reason: any) => reason.Code === "ConditionalCheckFailed"
      )
    ) {
      const mealDeleteFailed = error.CancellationReasons?.find(
        (reason: any, index: number) =>
          index === 0 && reason.Code === "ConditionalCheckFailed"
      );
      if (mealDeleteFailed) {
        return createErrorResponse(
          404,
          "Meal record not found (or changed since retrieval)."
        );
      }
      // 在庫更新時のエラー (例: 在庫アイテムが削除されていた)
      const inventoryUpdateFailedIndex = error.CancellationReasons.findIndex(
        (reason: any, index: number) =>
          index > 0 && reason.Code === "ConditionalCheckFailed"
      );
      if (inventoryUpdateFailedIndex > 0) {
        const failedInventoryItem =
          mealRecordToDelete?.items[inventoryUpdateFailedIndex - 1];
        console.error(
          `Failed to revert inventory quantity for inventoryItemId: ${failedInventoryItem?.inventoryItemId}. Item might not exist.`,
          error.CancellationReasons
        );
        return createErrorResponse(
          500,
          `Failed to revert inventory quantity for item ${failedInventoryItem?.inventoryItemId}. Item might not exist.`,
          error.message
        );
      }
    }
    return createErrorResponse(
      500,
      "Failed to delete meal record and/or adjust inventory.",
      error
    );
  }
};

// --- エクスポート用ルーターハンドラー ---
export const handleMealRoutes = async (
  event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
  console.log("Handling meal route:", event.rawPath);
  const method = event.requestContext.http.method;
  const path = event.rawPath;
  const recordId = extractRecordIdFromPath(path); // recordIdをパスから抽出
  const hasRecordId = recordId !== null;

  if (method === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" }; // corsHeaders を使用
  }

  try {
    if (method === "POST" && path === "/meals") {
      return await createMealRecord(event);
    } else if (method === "GET" && hasRecordId) {
      return await getMealRecord(event, recordId!);
    } // recordIdがnullでないことを保証
    else if (method === "GET" && path === "/meals") {
      return await listMealRecords(event);
    } else if (method === "PUT" && hasRecordId) {
      return await updateMealRecord(event, recordId!);
    } // recordIdがnullでないことを保証
    else if (method === "DELETE" && hasRecordId) {
      return await deleteMealRecord(event, recordId!);
    } // recordIdがnullでないことを保証
    else {
      return createErrorResponse(
        404,
        `Not Found: The requested meal resource or method (${method} ${path}) was not found.`
      );
    }
  } catch (error) {
    return createErrorResponse(
      500,
      "An unexpected internal server error occurred in router.",
      error
    );
  }
};

// export const handler = handleMealRoutes; // 必要ならエントリーポイントにする
