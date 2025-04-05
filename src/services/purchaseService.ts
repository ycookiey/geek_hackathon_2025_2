import { fetchApi } from "../lib/api";
import {
    PurchaseRecord,
    CreatePurchaseRecordInput,
    UpdatePurchaseRecordInput,
} from "../types/api";

export const getPurchaseRecords = async (): Promise<PurchaseRecord[]> => {
    return fetchApi<PurchaseRecord[]>("/purchases");
};

export const getPurchaseRecord = async (
    purchaseId: string
): Promise<PurchaseRecord> => {
    return fetchApi<PurchaseRecord>(`/purchases/${purchaseId}`);
};

export const createPurchaseRecord = async (
    record: CreatePurchaseRecordInput
): Promise<PurchaseRecord> => {
    return fetchApi<PurchaseRecord>("/purchases", "POST", record);
};

export const updatePurchaseRecord = async (
    purchaseId: string,
    updates: UpdatePurchaseRecordInput
): Promise<PurchaseRecord> => {
    return fetchApi<PurchaseRecord>(`/purchases/${purchaseId}`, "PUT", updates);
};

export const deletePurchaseRecord = async (
    purchaseId: string
): Promise<{ message: string; deletedRecord: PurchaseRecord }> => {
    return fetchApi<{ message: string; deletedRecord: PurchaseRecord }>(
        `/purchases/${purchaseId}`,
        "DELETE"
    );
};
