import { fetchApi, validateRequired } from "../lib/api";
import {
    InventoryItem,
    CreateInventoryItemInput,
    UpdateInventoryItemInput,
} from "../types/api";

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
    return fetchApi<InventoryItem[]>("/inventory");
};

export const getInventoryItem = async (
    itemId: string
): Promise<InventoryItem> => {
    if (!itemId) {
        throw new Error("アイテムIDが必要です");
    }
    return fetchApi<InventoryItem>(`/inventory/${itemId}`);
};

export const createInventoryItem = async (
    item: CreateInventoryItemInput
): Promise<InventoryItem> => {
    // 入力バリデーション
    const validationError = validateRequired(item, [
        "name",
        "category",
        "quantity",
    ]);

    if (validationError) {
        throw new Error(validationError);
    }

    if (item.quantity <= 0) {
        throw new Error("数量は正の値である必要があります");
    }

    // 現在日時をセット
    const now = new Date().toISOString();
    const itemWithTimestamp = {
        ...item,
        createdAt: now,
        updatedAt: now,
    };

    return fetchApi<InventoryItem>("/inventory", "POST", itemWithTimestamp);
};

export const updateInventoryItem = async (
    itemId: string,
    updates: UpdateInventoryItemInput
): Promise<InventoryItem> => {
    if (!itemId) {
        throw new Error("アイテムIDが必要です");
    }

    // 入力チェック
    if (updates.quantity !== undefined && updates.quantity <= 0) {
        throw new Error("数量は正の値である必要があります");
    }

    // 現在の更新日時をセット
    const updatedItem = {
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    return fetchApi<InventoryItem>(`/inventory/${itemId}`, "PUT", updatedItem);
};

export const deleteInventoryItem = async (
    itemId: string
): Promise<{ message: string; deletedItem: InventoryItem }> => {
    if (!itemId) {
        throw new Error("アイテムIDが必要です");
    }
    return fetchApi<{ message: string; deletedItem: InventoryItem }>(
        `/inventory/${itemId}`,
        "DELETE"
    );
};

export const searchInventoryItems = async (
    searchTerm: string,
    category?: string,
    limit?: number
): Promise<InventoryItem[]> => {
    const params: Record<string, string> = {};

    if (searchTerm) {
        params.search = searchTerm;
    }

    if (category) {
        params.category = category;
    }

    if (limit) {
        params.limit = limit.toString();
    }

    return fetchApi<InventoryItem[]>(
        "/inventory/search",
        "GET",
        undefined,
        params
    );
};

export const getExpiringItems = async (
    daysThreshold: number = 7
): Promise<InventoryItem[]> => {
    return fetchApi<InventoryItem[]>("/inventory/expiring", "GET", undefined, {
        days: daysThreshold.toString(),
    });
};
