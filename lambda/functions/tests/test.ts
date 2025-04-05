import type {
    APIGatewayProxyEventV2,
    APIGatewayProxyResultV2,
} from "aws-lambda";
import { createResponse } from "../../utils/response.js";

/**
 * テスト用のシンプルな Lambda 関数
 * 現在の時刻を JSON レスポンスとして返します
 */
export const handler = async (
    event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
    console.log("Timestamp function called at:", new Date().toISOString());
    console.log("Request event:", JSON.stringify(event, null, 2));

    try {
        const timestamp = new Date().toISOString();
        const message = `Hello from Lambda! Current time is: ${timestamp}`;

        // GitHub Actions デプロイワークフローのテスト用メッセージ
        return createResponse(200, {
            message,
            timestamp,
            environment: process.env.NODE_ENV || "unknown",
            deployedBy: "GitHub Actions Workflow",
            version: "1.0.0",
        });
    } catch (error: unknown) {
        console.error("Error in timestamp function:", error);
        return createResponse(500, {
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
