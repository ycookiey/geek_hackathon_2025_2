// Lambda Function URL イベント型定義
export interface LambdaFunctionURLEvent {
    version: string;
    routeKey: string;
    rawPath: string;
    rawQueryString: string;
    headers: Record<string, string>;
    queryStringParameters: Record<string, string> | null;
    requestContext: {
        accountId: string;
        apiId: string;
        domainName: string;
        domainPrefix: string;
        http: {
            method: string;
            path: string;
            protocol: string;
            sourceIp: string;
            userAgent: string;
        };
        requestId: string;
        routeKey: string;
        stage: string;
        time: string;
        timeEpoch: number;
    };
    body: string;
    isBase64Encoded: boolean;
}

// レスポンス型
export interface ApiResponse {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
}

// CORSヘッダー (全メソッド許可)
export const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // 必要に応じてより厳格なドメインを指定
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
};
