import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'node:crypto'; // Node.js v14.17+ で利用可能

// DynamoDBクライアントの初期化
const client = new DynamoDBClient({
    endpoint: process.env.DYNAMODB_ENDPOINT, // ローカルテスト用
});
const docClient = DynamoDBDocumentClient.from(client);

// CORSヘッダー
const corsHeaders = {
    'Access-Control-Allow-Origin': '*', // 必要に応じてドメインを指定
    'Access-Control-Allow-Methods': 'POST,OPTIONS', // POSTメソッドを許可
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
};

// 想定されるリクエストボディの型 (必要に応じて調整)
interface CreateInventoryItemInput {
    name: string; // 商品名 (必須)
    quantity: number; // 数量 (必須)
    unit?: string; // 単位 (任意)
    storageLocation?: string; // 保存場所 (任意)
    memo?: string; // メモ (任意)
  // itemId はバックエンドで生成するため、通常リクエストには含めない
  // userId はクエリパラメータから取得
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Event:', JSON.stringify(event, null, 2));

  // 1. userId の取得と検証
    const userId = event.queryStringParameters?.userId;
    if (!userId) {
        return {
            statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: 'Missing userId query parameter' }),
        };
    }

  // 2. リクエストボディの取得と検証
    if (!event.body) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Missing request body' }),
        };
    }

    let requestBody: CreateInventoryItemInput;
    try {
        requestBody = JSON.parse(event.body);
    } catch (error) {
        console.error('Failed to parse request body:', error);
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Invalid request body format' }),
        };
    }

  // 必須項目 (name, quantity) の存在チェック
    if (!requestBody.name || typeof requestBody.quantity !== 'number') {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Missing required fields: name and quantity(number)' }),
        };
    }


  // 3. 環境変数からテーブル名を取得
    const tableName = process.env.INVENTORY_TABLE_NAME;
    if (!tableName) {
        console.error('INVENTORY_TABLE_NAME environment variable is not set.');
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Internal server error: Table name configuration missing.' }),
        };
    }

  // 4. DynamoDBに保存するアイテムを作成
    const itemId = randomUUID(); // 新しいアイテムIDを生成
    const now = new Date().toISOString();
    const itemToSave = {
        userId: userId, // パーティションキー
        itemId: itemId, // ソートキー (またはプライマリキーの一部) - ★ スキーマ設計に合わせてください
        name: requestBody.name,
        quantity: requestBody.quantity,
        unit: requestBody.unit,
        storageLocation: requestBody.storageLocation,
        memo: requestBody.memo,
        createdAt: now,
        updatedAt: now,
    };
   // ★注意: 上記の `itemId` をソートキーとするか、あるいは別の属性とするかは、
   // DynamoDBのテーブル設計（特に 'userId' と 'itemId' で一意なアイテムを識別する方法）によります。
   // もしパーティションキー 'userId' だけでアイテムをグループ化し、
   // 個々のアイテムを 'itemId' で識別する場合、この構造で問題ない可能性が高いです。


  // 5. DynamoDBにアイテムを登録 (PutCommand)
    const params = {
        TableName: tableName,
        Item: itemToSave,
    // ConditionExpression: 'attribute_not_exists(itemId)' // オプション: 既に同じitemIdが存在しない場合のみ書き込む場合
    };

  try {
    console.log('Putting item into DynamoDB:', JSON.stringify(params, null, 2));
    const command = new PutCommand(params);
    await docClient.send(command);
    console.log('DynamoDB Put successful');

    // 6. 成功レスポンス (ステータスコード 201 Created)
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify(itemToSave), // 作成されたアイテム情報を返す
    };
  } catch (error) {
    console.error('Error putting item into DynamoDB:', error);
    // エラーレスポンス
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ message: 'Failed to create inventory item.', error: error instanceof Error ? error.message : String(error) }),
    };
  }
};