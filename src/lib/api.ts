import { ApiErrorResponse } from "../types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// TODO: 実際のアプリケーションでは認証機能から取得する
export const getUserId = (): string => {
    return "test-user-1";
};

export async function fetchApi<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    additionalParams?: Record<string, string>
): Promise<T> {
    const userId = getUserId();
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    url.searchParams.append("userId", userId);

    if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };

    if (body && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url.toString(), options);

        const data = await response.json();

        if (!response.ok) {
            const errorData = data as ApiErrorResponse;
            throw new Error(
                errorData.message || `API error: ${response.status}`
            );
        }

        return data as T;
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export function formatDateToIso(date: Date): string {
    return date.toISOString().split("T")[0];
}
