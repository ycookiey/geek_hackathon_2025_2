import { InventoryItem as ApiInventoryItem } from "@/types/api";
import { InventoryItem as UiInventoryItem } from "@/app/inventory/models/InventoryItem";

//
const categoryMapping: Record<string, string> = {
    野菜: "vegetables",
    果物: "fruits",
    肉類: "meats",
    魚介類: "seafood",
    乳製品: "dairy",
    穀物: "grains",
    調味料: "spices",
    その他: "others",
};

const normalizeStorageLocation = (
    location: string | undefined
): "refrigerator" | "freezer" | "pantry" => {
    if (!location) return "pantry";

    if (
        location.includes("冷蔵") ||
        location.toLowerCase().includes("refrigerator")
    ) {
        return "refrigerator";
    } else if (
        location.includes("冷凍") ||
        location.toLowerCase().includes("freezer")
    ) {
        return "freezer";
    } else {
        return "pantry";
    }
};

const calculateExpiryDate = (createdAt: string): string => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 10);
    return date.toISOString().split("T")[0];
};

const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const mapApiInventoryItemToUiInventoryItem = (
    apiItem: ApiInventoryItem
): UiInventoryItem => {
    const purchaseDate = apiItem.createdAt.split("T")[0];

    const expiryDate = calculateExpiryDate(apiItem.createdAt);

    return {
        id: apiItem.itemId,
        name: apiItem.name,
        category: categoryMapping[apiItem.category] || "others",
        quantity: apiItem.quantity,
        unit: apiItem.unit || "個",
        purchaseDate: purchaseDate,
        expiryDate: expiryDate,
        daysUntilExpiry: calculateDaysUntilExpiry(expiryDate),
        storageLocation: normalizeStorageLocation(apiItem.storageLocation),
        notes: apiItem.memo,
    };
};
