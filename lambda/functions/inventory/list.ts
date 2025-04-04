// 保存先: lambda/functions/inventory/list.ts

import { QueryCommand } from "@aws-sdk/lib-dynamodb";
// 共通ファイルをインポートして DynamoDB クライアントとテーブル名を利用
// パスが正しいか確認してください (プロジェクトルートからの相対パス)
import { docClient, INVENTORY_TABLE_NAME } from "../../utils/dynamodb.js"; // ← 拡張子 .js を付けておくのが安全かも
// 共通ファイルをインポートして レスポンス生成ヘルパーを利用
import { createResponse } from "../../utils/response.js"; // ← 拡張子 .js を付けておくのが安全かも
// AWS Lambda の型定義をインポート (エディタの補完などに便利)
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

/**
 * Lambda 関数のメイン処理 (ハンドラー)
 * Lambda Function URL 経由で HTTP GET リクエストが来るとこの関数が実行される
 * @param event - リクエスト情報 (クエリパラメータ、パスパラメータ、ボディなど) を含むオブジェクト
 * @returns HTTP レスポンスオブジェクト
 */
export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    // どんなリクエストが来たかログに出力 (デバッグ用)
    console.log("Received event:", JSON.stringify(event, null, 2));

    // クエリパラメータ (?userId=xxx の xxx部分) を取得
    const userId = event.queryStringParameters?.userId;

    // userId が指定されていない場合はエラーレスポンスを返す
    if (!userId) {
        console.error("Missing userId query parameter");
        return createResponse(400, { message: "Missing required query parameter: userId" });
    }

    // DynamoDB に問い合わせるための設定 (パラメータ) を作成
    // INVENTORY_TABLE_NAME は template.yaml または utils/dynamodb.ts で設定された環境変数から読み込む想定
    const params = {
        TableName: INVENTORY_TABLE_NAME, // 操作対象のテーブル名
        // KeyConditionExpression: DynamoDBに「どのデータを取得したいか」を伝える条件式
        // "userId = :uid" は、「userIdという属性が :uid という値と一致する項目」を探すという意味
        KeyConditionExpression: "userId = :uid",
        // ExpressionAttributeValues: 条件式の中で使うプレースホルダー (:uid) に実際の値を与える
        ExpressionAttributeValues: {
            ":uid": userId, // :uid にはリクエストから取得した userId を設定
        },
    };

    try {
        // DynamoDB に Query コマンド (条件に合う複数の項目を取得) を送信
        // docClient は utils/dynamodb.ts からインポートする想定
        const result = await docClient.send(new QueryCommand(params));
        // 取得できたアイテム数をログに出力
        console.log(`Found ${result.Items?.length ?? 0} inventory items for user ${userId}`);
        // 成功レスポンス (ステータスコード 200) と取得したアイテムリストを返す
        // result.Items が空配列の場合もそのまま返す
        // createResponse は utils/response.ts からインポートする想定
        return createResponse(200, result.Items || []);
    } catch (error: any) {
        // DynamoDB 操作中にエラーが発生した場合
        console.error(`Error fetching inventory for user ${userId}:`, error);
        // エラーレスポンス (ステータスコード 500) を返す
        return createResponse(500, { message: "Failed to fetch inventory", error: error.message });
    }
};