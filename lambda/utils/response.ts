// /lambda/utils/response.ts
export const createResponse = (statusCode: number, body: any) => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            // CORS設定 (Lambda Function URL側でも設定が必要)
            "Access-Control-Allow-Origin": "*", // 開発中は *、本番では適切なオリジンを指定
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
        body: JSON.stringify(body),
    };
};