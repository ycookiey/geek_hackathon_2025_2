import type {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
} from "aws-lambda";
import { createResponse } from "../utils/response.js";

/**
 * Lambda Function URL を使用したタイムスタンプ API 関数
 * このファイルは GitHub Actions のワークフローテスト用です
 */
export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    console.log("Lambda Function URL called:", new Date().toISOString());
    console.log("Request event:", JSON.stringify(event, null, 2));

    // クエリパラメータでフォーマットを指定可能にする
    const format = event.queryStringParameters?.format || "iso";

    try {
        // 現在のタイムスタンプを取得
        const now = new Date();
        let formattedTime;

        // フォーマットに応じて時刻を整形
        switch (format) {
            case "unix":
                formattedTime = Math.floor(now.getTime() / 1000);
                break;
            case "human":
                formattedTime = now.toLocaleString("ja-JP", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "Asia/Tokyo",
                });
                break;
            case "iso":
            default:
                formattedTime = now.toISOString();
                break;
        }

        // GitHub Actions テスト用のレスポンスを返す
        return createResponse(200, {
            message: "Lambda Function URL API successfully invoked!",
            timestamp: formattedTime,
            format: format,
            request_id: event.requestContext?.requestId || "unknown",
            source_ip: event.requestContext?.http?.sourceIp || "unknown",
            user_agent: event.requestContext?.http?.userAgent || "unknown",
            version: "1.0.0",
            deployed_at: "__DEPLOYMENT_TIMESTAMP__", // デプロイ時に置換される想定
        });
    } catch (error: any) {
        console.error("Error in timestamp function:", error);
        return createResponse(500, {
            message: "Internal server error",
            error: error.message,
        });
    }
};
