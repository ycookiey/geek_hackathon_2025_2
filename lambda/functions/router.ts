import { LambdaFunctionURLEvent, ApiResponse } from "./utils/types";
import { createErrorResponse, createOptionsResponse } from "./utils/response";
import { handleInventoryRoutes } from "./inventory";
import { handlePurchaseRoutes } from "./purchases";
import { handleMealRoutes } from "./meals";
import { handleFoodCategoryRoutes } from "./food-category";

/**
 * メインルーターハンドラー
 * リクエストパスに基づいて適切なハンドラーにルーティングする
 */
export const handler = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    console.log(
        "Received event in main router:",
        JSON.stringify(event, null, 2)
    );

    // OPTIONSメソッド（CORSプリフライトリクエスト）への対応
    if (event.requestContext.http.method === "OPTIONS") {
        return createOptionsResponse();
    }

    const path = event.rawPath;

    try {
        // パスの先頭部分で判別（/inventory/... /purchases/... など）
        if (path.startsWith("/inventory")) {
            return await handleInventoryRoutes(event);
        } else if (path.startsWith("/purchases")) {
            return await handlePurchaseRoutes(event);
        } else if (path.startsWith("/meals")) {
            return await handleMealRoutes(event);
        } else if (path.startsWith("/food-category")) {
            return await handleFoodCategoryRoutes(event);
        } else if (path === "/health" || path === "/") {
            // ヘルスチェックエンドポイント
            return {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "ok",
                    timestamp: new Date().toISOString(),
                    api: "Nutrition Management API",
                    version: "1.0.0",
                }),
            };
        } else {
            // マッチしないパス
            return createErrorResponse(
                404,
                `Not Found: The requested path (${path}) does not exist.`
            );
        }
    } catch (error) {
        console.error("Unhandled error in main router:", error);
        return createErrorResponse(
            500,
            "An unexpected error occurred while processing the request.",
            error
        );
    }
};
