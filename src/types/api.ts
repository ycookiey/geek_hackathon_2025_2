export interface InventoryItem {
    userId: string;
    itemId: string;
    name: string;
    quantity: number;
    unit?: string;
    storageLocation?: string;
    memo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateInventoryItemInput {
    name: string;
    quantity: number;
    unit?: string;
    storageLocation?: string;
    memo?: string;
}

export interface UpdateInventoryItemInput {
    name?: string;
    quantity?: number;
    unit?: string;
    storageLocation?: string;
    memo?: string;
}

export interface PurchaseItem {
    name: string;
    quantity: number;
    price?: number;
    unit?: string;
}

export interface PurchaseRecord {
    userId: string;
    purchaseId: string;
    purchaseDate: string;
    items: PurchaseItem[];
    totalAmount?: number;
    store?: string;
    memo?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePurchaseRecordInput {
    purchaseDate: string;
    items: PurchaseItem[];
    totalAmount?: number;
    store?: string;
    memo?: string;
}

export interface UpdatePurchaseRecordInput {
    purchaseDate?: string;
    items?: PurchaseItem[];
    totalAmount?: number;
    store?: string;
    memo?: string;
}

export interface MealItem {
    name: string;
    quantity: number;
    unit?: string;
    foodId?: string;
}

export interface MealRecord {
    userId: string;
    recordId: string;
    recordDate: string;
    mealType: string;
    items: MealItem[];
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateMealRecordInput {
    recordDate: string;
    mealType: string;
    items: MealItem[];
    notes?: string;
}

export interface UpdateMealRecordInput {
    recordDate?: string;
    mealType?: string;
    items?: MealItem[];
    notes?: string;
}

export interface ApiErrorResponse {
    message: string;
    error?: string;
}

export type FoodCategory =
    | "野菜"
    | "果物"
    | "肉類"
    | "魚介類"
    | "乳製品"
    | "穀物"
    | "調味料"
    | "その他";

export interface FoodCategoryResponse {
    foodName: string;
    category: FoodCategory;
}
