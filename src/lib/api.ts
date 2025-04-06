import {
    API_TIMEOUT,
    getCommonHeaders,
    getApiUrl,
    getUserId,
    getErrorMessage,
} from "@/services/apiConfig";

export async function fetchApi<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    additionalParams?: Record<string, string>,
    retries: number = 2
): Promise<T> {
    const userId = getUserId();
    const url = new URL(getApiUrl(endpoint));

    url.searchParams.append("userId", userId);

    if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const options: RequestInit = {
        method,
        headers: getCommonHeaders(),
        ...(body && (method === "POST" || method === "PUT")
            ? { body: JSON.stringify(body) }
            : {}),
    };

    try {
        // タイムアウト処理
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        options.signal = controller.signal;

        const response = await fetch(url.toString(), options);
        clearTimeout(timeoutId);

        const contentType = response.headers.get("content-type");
        let data: any;

        if (contentType && contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorData =
                typeof data === "object" ? data : { message: data };
            throw new Error(
                errorData.message || `API error: ${response.status}`
            );
        }

        return data as T;
    } catch (error: any) {
        // リトライロジック
        if (retries > 0 && !error.message?.includes("aborted")) {
            console.warn(
                `API call to ${endpoint} failed. Retrying... (${retries} left)`
            );
            // 再帰的に呼び出し、リトライ回数を減らす
            return fetchApi<T>(
                endpoint,
                method,
                body,
                additionalParams,
                retries - 1
            );
        }

        console.error(`API Error (${endpoint}):`, error);
        throw new Error(getErrorMessage(error));
    }
}

/**
 * 日付をISO形式（YYYY-MM-DD）に変換
 */
export function formatDateToIso(date: Date): string {
    return date.toISOString().split("T")[0];
}

/**
 * 現在の日時を取得
 */
export function getCurrentISODateTime(): string {
    return new Date().toISOString();
}

/**
 * データ送信前の基本バリデーション
 */
export function validateRequired(
    fields: Record<string, any>,
    requiredFields: string[]
): string | null {
    for (const field of requiredFields) {
        const value = fields[field];
        if (value === undefined || value === null || value === "") {
            return `${field}は必須項目です`;
        }
    }
    return null;
}
