import { fetchApi, formatDateToIso, validateRequired } from "../lib/api";
import {
    MealRecord,
    CreateMealRecordInput,
    UpdateMealRecordInput,
} from "../types/api";

export const getMealRecords = async (
    startDate?: Date,
    endDate?: Date
): Promise<MealRecord[]> => {
    const params: Record<string, string> = {};

    if (startDate) {
        params.startDate = formatDateToIso(startDate);
    }

    if (endDate) {
        params.endDate = formatDateToIso(endDate);
    }

    return fetchApi<MealRecord[]>(
        "/meals",
        "GET",
        undefined,
        Object.keys(params).length > 0 ? params : undefined
    );
};

export const getMealRecord = async (recordId: string): Promise<MealRecord> => {
    if (!recordId) {
        throw new Error("記録IDが必要です");
    }
    return fetchApi<MealRecord>(`/meals/${recordId}`);
};

export const createMealRecord = async (
    record: CreateMealRecordInput
): Promise<MealRecord> => {
    // 入力バリデーション
    const validationError = validateRequired(record, [
        "recordDate",
        "mealType",
        "items",
    ]);

    if (validationError) {
        throw new Error(validationError);
    }

    if (!record.items || record.items.length === 0) {
        throw new Error("少なくとも1つの食品アイテムが必要です");
    }

    // 現在日時をセット
    const now = new Date().toISOString();
    const recordWithTimestamp = {
        ...record,
        createdAt: now,
        updatedAt: now,
    };

    return fetchApi<MealRecord>("/meals", "POST", recordWithTimestamp);
};

export const updateMealRecord = async (
    recordId: string,
    updates: UpdateMealRecordInput
): Promise<MealRecord> => {
    if (!recordId) {
        throw new Error("記録IDが必要です");
    }

    // 現在の更新日時をセット
    const updatedRecord = {
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    return fetchApi<MealRecord>(`/meals/${recordId}`, "PUT", updatedRecord);
};

export const deleteMealRecord = async (
    recordId: string
): Promise<{ message: string; deletedRecord: MealRecord }> => {
    if (!recordId) {
        throw new Error("記録IDが必要です");
    }
    return fetchApi<{ message: string; deletedRecord: MealRecord }>(
        `/meals/${recordId}`,
        "DELETE"
    );
};

export const getMealRecordsForDate = async (
    date: Date
): Promise<MealRecord[]> => {
    const formattedDate = formatDateToIso(date);
    return fetchApi<MealRecord[]>("/meals", "GET", undefined, {
        startDate: formattedDate,
        endDate: formattedDate,
    });
};

export const getMealRecordsForDateRange = async (
    startDate: Date,
    endDate: Date
): Promise<MealRecord[]> => {
    return fetchApi<MealRecord[]>("/meals", "GET", undefined, {
        startDate: formatDateToIso(startDate),
        endDate: formatDateToIso(endDate),
    });
};
