import { fetchApi, formatDateToIso } from "../lib/api";
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
    return fetchApi<MealRecord>(`/meals/${recordId}`);
};

export const createMealRecord = async (
    record: CreateMealRecordInput
): Promise<MealRecord> => {
    return fetchApi<MealRecord>("/meals", "POST", record);
};

export const updateMealRecord = async (
    recordId: string,
    updates: UpdateMealRecordInput
): Promise<MealRecord> => {
    return fetchApi<MealRecord>(`/meals/${recordId}`, "PUT", updates);
};

export const deleteMealRecord = async (
    recordId: string
): Promise<{ message: string; deletedRecord: MealRecord }> => {
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
