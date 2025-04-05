import { ApiResponse } from "./types";

// エラーレスポンス生成ヘルパー
export const createErrorResponse = (
    statusCode: number,
    message: string,
    error?: any
): ApiResponse => {
    console.error(`Error ${statusCode}: ${message}`, error);
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            error: error instanceof Error ? error.message : String(error),
        }),
    };
};

export const createSuccessResponse = (
    statusCode: number,
    data: any
): ApiResponse => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
};

// OPTIONSリクエスト用レスポンス
export const createOptionsResponse = (): ApiResponse => {
    return {
        statusCode: 200,
        headers: {},
        body: "",
    };
};
