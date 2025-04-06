"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CategorySidebar, { categories } from "./components/CategorySidebar";
import InventoryFilters, {
    StorageLocation,
    SortOption,
} from "./components/InventoryFilters";
import InventoryItemList from "./components/InventoryItemList";
import {
    InventoryProvider,
    useInventory,
} from "@/state/inventory/inventoryContext";
import {
    filterInventoryItems,
    getCategoryInfo,
    getCategoryItemCount,
} from "./utils/inventoryUtils";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "./components/ErrorState";

function InventoryPageContent() {
    const { inventoryItems, isLoading, error, refreshInventory } =
        useInventory();
    const [activeTab, setActiveTab] = useState<StorageLocation>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [sortBy, setSortBy] = useState<SortOption>("expiryDate");
    const [animateItems, setAnimateItems] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        if (!isLoading) {
            setIsInitialLoad(false);
            setAnimateItems(true);

            const timer = setTimeout(() => {
                setAnimateItems(false);
            }, 1200);

            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    const handleRefresh = async () => {
        setAnimateItems(true);
        await refreshInventory();
        setTimeout(() => setAnimateItems(false), 1200);
    };

    const filteredItems = filterInventoryItems(
        inventoryItems,
        activeTab,
        searchQuery,
        selectedCategory,
        sortBy
    );

    const getCategoryInfoWrapper = (categoryId: string) => {
        return getCategoryInfo(categoryId, categories);
    };

    const getCategoryItemCountWrapper = (categoryId: string) => {
        return getCategoryItemCount(categoryId, inventoryItems);
    };

    if (error) {
        return <ErrorState error={error} onRetry={refreshInventory} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="inventory" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isLoading && isInitialLoad ? (
                    <LoadingState />
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1">
                                <div className="pt-26">
                                    <CategorySidebar
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        setSelectedCategory={
                                            setSelectedCategory
                                        }
                                        getCategoryItemCount={
                                            getCategoryItemCountWrapper
                                        }
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <div className="mb-6">
                                    <InventoryFilters
                                        activeTab={activeTab}
                                        setActiveTab={setActiveTab}
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        sortBy={sortBy}
                                        setSortBy={setSortBy}
                                    />
                                </div>

                                <InventoryItemList
                                    items={filteredItems}
                                    getCategoryInfo={getCategoryInfoWrapper}
                                    activeTab={activeTab}
                                    animateItems={animateItems}
                                    setAnimateItems={handleRefresh}
                                    isInitialLoad={isInitialLoad}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default function InventoryPage() {
    return (
        <InventoryProvider>
            <InventoryPageContent />
        </InventoryProvider>
    );
}
