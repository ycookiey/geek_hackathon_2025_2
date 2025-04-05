/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient, ReturnValue } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT, // ローカルテスト用
});
const docClient = DynamoDBDocumentClient.from(client);

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 必要に応じてドメインを指定
  "Access-Control-Allow-Methods": "PUT,OPTIONS", // PUTメソッドを許可
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
};

// 更新可能なフィールドを定義 (例)
// 不変な値 (userId, itemId, createdAt) は含めない
interface UpdateInventoryItemInput {
  name?: string;
  quantity?: number;
  unit?: string;
  storageLocation?: string;
  memo?: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event:", JSON.stringify(event, null, 2));

  // 1. userId の取得と検証 (クエリパラメータから)
  const userId = event.queryStringParameters?.userId;
  if (!userId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Missing userId query parameter" }),
    };
  }

  // 2. itemId の取得と検証 (パスパラメータから)
  const itemId = event.pathParameters?.itemId;
  if (!itemId) {
    console.error("Missing itemId in path parameters.");
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Missing itemId path parameter" }),
    };
  }

  // 3. リクエストボディの取得と検証
  if (!event.body) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Missing request body" }),
    };
  }

  let requestBody: UpdateInventoryItemInput;
  try {
    requestBody = JSON.parse(event.body);
  } catch (error) {
    console.error("Failed to parse request body:", error);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Invalid request body format" }),
    };
  }

  // 更新するフィールドが少なくとも1つ存在するかチェック
  const updateFields = Object.keys(requestBody).filter(
    (key) => requestBody[key as keyof UpdateInventoryItemInput] !== undefined
  );
  if (updateFields.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "No fields provided for update" }),
    };
  }
  // quantity が指定されている場合は数値かチェック (例)
  if (
    requestBody.quantity !== undefined &&
    typeof requestBody.quantity !== "number"
  ) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Invalid type for field: quantity must be a number",
      }),
    };
  }

  // 4. 環境変数からテーブル名を取得
  const tableName = process.env.INVENTORY_TABLE_NAME;
  if (!tableName) {
    console.error("INVENTORY_TABLE_NAME environment variable is not set.");
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal server error: Table name configuration missing.",
      }),
    };
  }

  // 5. UpdateCommand のパラメータを動的に構築
  const now = new Date().toISOString();
  let updateExpression = "SET updatedAt = :updatedAt";
  const expressionAttributeNames: Record<string, string> = {}; // #name など予約語回避用
  const expressionAttributeValues: Record<string, any> = {
    // :nameVal など実際の値用
    ":updatedAt": now,
  };

  // リクエストボディに含まれる更新可能なフィールドを UpdateExpression に追加
  for (const field of updateFields) {
    // 'name' など DynamoDBの予約語の可能性がある属性名はプレースホルダーを使う
    const attributeNamePlaceholder = `#${field}`;
    const attributeValuePlaceholder = `:${field}Val`;

    updateExpression += `, ${attributeNamePlaceholder} = ${attributeValuePlaceholder}`;
    expressionAttributeNames[attributeNamePlaceholder] = field;
    expressionAttributeValues[attributeValuePlaceholder] =
      requestBody[field as keyof UpdateInventoryItemInput];
  }

  // --- 注意 ---
  // このコードは、DynamoDBテーブルのプライマリキーが 'userId' (パーティションキー) と
  // 'itemId' (ソートキー) の複合キーであることを前提としています。
  const params = {
    TableName: tableName,
    Key: {
      userId: userId,
      itemId: itemId,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames, // 空オブジェクトになる可能性もあるが、SDKが処理してくれる
    ExpressionAttributeValues: expressionAttributeValues,
    ConditionExpression: "attribute_exists(itemId)", // ★ 更新対象のアイテムが存在することを確認
    ReturnValues: "ALL_NEW" as ReturnValue, // 更新後のすべての属性を返す
  };

  try {
    console.log(
      "Updating item in DynamoDB with params:",
      JSON.stringify(params, null, 2)
    );
    // DynamoDBでアイテムを更新 (UpdateCommand)
    const command = new UpdateCommand(params);
    const data = await docClient.send(command);
    console.log("DynamoDB Update successful:", JSON.stringify(data, null, 2));

    // 6. 成功レスポンス (ステータスコード 200 OK)
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(data.Attributes), // 更新後のアイテム情報を返す
    };
  } catch (error: any) {
    console.error("Error updating item in DynamoDB:", error);
    // 条件チェック失敗（アイテムが存在しない）の場合
    if (error.name === "ConditionalCheckFailedException") {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Inventory item not found" }),
      };
    }
    // その他のエラー
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to update inventory item.",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
