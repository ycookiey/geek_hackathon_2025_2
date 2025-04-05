import { InventoryItem } from "../models/InventoryItem";
import { Category } from "../components/CategorySidebar";
import { SortOption, StorageLocation } from "../components/InventoryFilters";

export const filterInventoryItems = (
  items: InventoryItem[],
  activeTab: StorageLocation,
  searchQuery: string,
  selectedCategory: string | null,
  sortBy: SortOption
): InventoryItem[] => {
  return items
    .filter(
      (item) => activeTab === "all" || item.storageLocation === activeTab
    )
    .filter(
      (item) =>
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (item) => selectedCategory === null || item.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === "expiryDate") {
        return a.daysUntilExpiry - b.daysUntilExpiry;
      } else if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "purchaseDate") {
        return (
          new Date(b.purchaseDate).getTime() -
          new Date(a.purchaseDate).getTime()
        );
      }
      return 0;
    });
};

export const getCategoryInfo = (
  categoryId: string,
  categories: Category[]
): Category => {
  return (
    categories.find((cat) => cat.id === categoryId) ||
    categories[categories.length - 1]
  );
};

export const getCategoryItemCount = (
  categoryId: string,
  items: InventoryItem[]
): number => {
  return items.filter((item) => item.category === categoryId).length;
};
