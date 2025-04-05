import { fetchApi } from "../lib/api";
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
    return fetchApi<InventoryItem>(`/inventory/${itemId}`);
};

export const createInventoryItem = async (
    item: CreateInventoryItemInput
): Promise<InventoryItem> => {
    return fetchApi<InventoryItem>("/inventory", "POST", item);
};

export const updateInventoryItem = async (
    itemId: string,
    updates: UpdateInventoryItemInput
): Promise<InventoryItem> => {
    return fetchApi<InventoryItem>(`/inventory/${itemId}`, "PUT", updates);
};

export const deleteInventoryItem = async (
    itemId: string
): Promise<{ message: string; deletedItem: InventoryItem }> => {
    return fetchApi<{ message: string; deletedItem: InventoryItem }>(
        `/inventory/${itemId}`,
        "DELETE"
    );
};
