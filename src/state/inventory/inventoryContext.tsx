"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getInventoryItems } from "@/services/inventoryService";
import { mapApiInventoryItemToUiInventoryItem } from "./inventoryAdapter";
import { InventoryItem } from "@/app/inventory/models/InventoryItem";

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  isLoading: boolean;
  error: Error | null;
  refreshInventory: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInventoryItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apiInventoryItems = await getInventoryItems();
      const uiInventoryItems = apiInventoryItems.map(mapApiInventoryItemToUiInventoryItem);
      setInventoryItems(uiInventoryItems);
    } catch (err) {
      console.error("Failed to fetch inventory items:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch inventory items"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const refreshInventory = async () => {
    await fetchInventoryItems();
  };

  const value = {
    inventoryItems,
    isLoading,
    error,
    refreshInventory,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
