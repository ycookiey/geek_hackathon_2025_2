/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT, // ローカルテスト用
});
const docClient = DynamoDBDocumentClient.from(client);

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 必要に応じてドメインを指定
  "Access-Control-Allow-Methods": "DELETE,OPTIONS", // DELETEメソッドを許可
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
};

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

  // 3. 環境変数からテーブル名を取得
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

  // 4. DeleteCommand のパラメータを設定
  // --- 注意 ---
  // このコードは、DynamoDBテーブルのプライマリキーが 'userId' (パーティションキー) と
  // 'itemId' (ソートキー) の複合キーであることを前提としています。
  const params = {
    TableName: tableName,
    Key: {
      userId: userId,
      itemId: itemId,
    },
    ConditionExpression: "attribute_exists(itemId)", // ★ 削除対象のアイテムが存在することを確認 (推奨)
    ReturnValues: "ALL_OLD" as const, // オプション: 削除されたアイテムの情報を返す場合
  };

  try {
    console.log(
      "Deleting item from DynamoDB with params:",
      JSON.stringify(params, null, 2)
    );
    // DynamoDBからアイテムを削除 (DeleteCommand)
    const command = new DeleteCommand(params);
    const data = await docClient.send(command);
    console.log("DynamoDB Delete successful:", JSON.stringify(data, null, 2));

    // 5. 成功レスポンス (ステータスコード 200 OK)
    // ReturnValues: 'ALL_OLD' を指定したので、削除されたアイテム情報が data.Attributes に入る
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Inventory item deleted successfully",
        deletedItem: data.Attributes, // 削除されたアイテム情報
      }),
      // もし削除されたアイテム情報を返す必要がなければ、statusCode: 204 No Content と bodyなしにするのが一般的
      // statusCode: 204,
      // headers: corsHeaders,
      // body: '',
    };
  } catch (error: any) {
    console.error("Error deleting item from DynamoDB:", error);
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
        message: "Failed to delete inventory item.",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
