export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  purchaseDate: string;
  expiryDate: string;
  daysUntilExpiry: number;
  storageLocation: "refrigerator" | "freezer" | "pantry";
  notes?: string;
}
