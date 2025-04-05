import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({
  endpoint: process.env.DYNAMODB_ENDPOINT, // ローカルテスト用
});
const docClient = DynamoDBDocumentClient.from(client);

// CORSヘッダー
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // 必要に応じてドメインを指定
  "Access-Control-Allow-Methods": "GET,OPTIONS", // GETメソッドを許可
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
  // template.yaml で API Gateway のパスを /api/inventory/{itemId} のように定義する必要があります
  const itemId = event.pathParameters?.itemId;
  if (!itemId) {
    // 通常、API Gateway の設定が正しければここには来ないはずですが念のため
    console.error(
      "Missing itemId in path parameters. Check API Gateway configuration."
    );
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

  // 4. DynamoDB GetItem のパラメータを設定
  // --- 注意 ---
  // このコードは、DynamoDBテーブルのプライマリキーが 'userId' (パーティションキー) と
  // 'itemId' (ソートキー) の複合キーであることを前提としています。
  // もしプライマリキーの構成が異なる場合は、'Key' オブジェクトを修正してください。
  const params = {
    TableName: tableName,
    Key: {
      userId: userId, // パーティションキー
      itemId: itemId, // ソートキー
    },
  };

  try {
    console.log(
      "Getting item from DynamoDB with params:",
      JSON.stringify(params, null, 2)
    );
    // DynamoDBからアイテムを取得 (GetCommand)
    const command = new GetCommand(params);
    const data = await docClient.send(command);
    console.log("DynamoDB Get successful:", JSON.stringify(data, null, 2));

    // 5. アイテムが見つかったかどうか確認
    if (data.Item) {
      // アイテムが見つかった場合 (ステータスコード 200 OK)
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(data.Item),
      };
    } else {
      // アイテムが見つからなかった場合 (ステータスコード 404 Not Found)
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Inventory item not found" }),
      };
    }
  } catch (error) {
    console.error("Error getting item from DynamoDB:", error);
    // エラーレスポンス (ステータスコード 500 Internal Server Error)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Failed to retrieve inventory item.",
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};
