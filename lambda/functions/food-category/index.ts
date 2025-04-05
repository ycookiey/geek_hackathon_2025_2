import { LambdaFunctionURLEvent, ApiResponse } from "../utils/types";
import { createErrorResponse, createSuccessResponse } from "../utils/response";
import fetch from "node-fetch";

type FoodCategory =
    | "野菜"
    | "果物"
    | "肉類"
    | "魚介類"
    | "乳製品"
    | "穀物"
    | "調味料"
    | "その他";

interface FoodCategoryResponse {
    foodName: string;
    category: FoodCategory;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

const categorizeFoodItem = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    if (!GEMINI_API_KEY) {
        console.error("Missing GEMINI_API_KEY environment variable");
        return createErrorResponse(
            500,
            "Server configuration error: Missing API key"
        );
    }

    const foodName = event.queryStringParameters?.foodName;
    if (!foodName) {
        return createErrorResponse(400, "Missing foodName query parameter");
    }

    try {
        const prompt = `
      あなたは食品カテゴリ分類AIです。以下の食品がどのカテゴリに属するか、以下のリストから一つだけ選んでください。
      
      カテゴリリスト:
      - 野菜
      - 果物
      - 肉類
      - 魚介類
      - 乳製品
      - 穀物
      - 調味料
      - その他
      
      食品名: ${foodName}
      
      カテゴリ名のみを出力してください。説明は不要です。
    `;

        console.log(`Sending request to Gemini AI for food item: ${foodName}`);

        const response = await fetch(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.0,
                        maxOutputTokens: 10,
                    },
                }),
            }
        );

        const data = await response.json();
        console.log("Gemini API response:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            return createErrorResponse(
                response.status,
                "Error calling Gemini AI API",
                data
            );
        }

        let generatedText = "";

        if (
            data.candidates &&
            data.candidates[0] &&
            data.candidates[0].content &&
            data.candidates[0].content.parts &&
            data.candidates[0].content.parts[0] &&
            data.candidates[0].content.parts[0].text
        ) {
            generatedText = data.candidates[0].content.parts[0].text.trim();
        } else {
            console.error(
                "Unexpected Gemini API response format:",
                JSON.stringify(data)
            );
            return createErrorResponse(
                500,
                "Unexpected response format from Gemini AI"
            );
        }

        const validCategories: FoodCategory[] = [
            "野菜",
            "果物",
            "肉類",
            "魚介類",
            "乳製品",
            "穀物",
            "調味料",
            "その他",
        ];

        let category: FoodCategory = "その他";

        if (validCategories.includes(generatedText as FoodCategory)) {
            category = generatedText as FoodCategory;
        } else {
            for (const validCategory of validCategories) {
                if (generatedText.includes(validCategory)) {
                    category = validCategory;
                    break;
                }
            }
        }

        const result: FoodCategoryResponse = {
            foodName,
            category,
        };

        return createSuccessResponse(200, result);
    } catch (error) {
        console.error("Error in food categorization:", error);
        return createErrorResponse(
            500,
            "Failed to categorize food item",
            error
        );
    }
};

export const handleFoodCategoryRoutes = async (
    event: LambdaFunctionURLEvent
): Promise<ApiResponse> => {
    console.log("Handling food category route:", event.rawPath);

    const method = event.requestContext.http.method;

    if (method === "GET" && event.rawPath === "/food-category") {
        return await categorizeFoodItem(event);
    } else {
        return createErrorResponse(
            404,
            `Not Found: The requested food category resource or method (${method} ${event.rawPath}) was not found.`
        );
    }
};
