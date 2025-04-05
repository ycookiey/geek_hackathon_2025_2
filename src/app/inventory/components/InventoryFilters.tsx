"use client";

import { motion } from "framer-motion";

export type StorageLocation = "all" | "refrigerator" | "freezer" | "pantry";
export type SortOption = "expiryDate" | "name" | "purchaseDate";

interface InventoryFiltersProps {
    activeTab: StorageLocation;
    setActiveTab: (tab: StorageLocation) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortBy: SortOption;
    setSortBy: (option: SortOption) => void;
}

export default function InventoryFilters({
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
}: InventoryFiltersProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl h-20 p-4"
        >
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex bg-gray-800/50 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab("all")}
                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                            activeTab === "all"
                                ? "bg-purple-500 text-white"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        全て
                    </button>
                    <button
                        onClick={() => setActiveTab("refrigerator")}
                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                            activeTab === "refrigerator"
                                ? "bg-blue-500 text-white"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        冷蔵
                    </button>
                    <button
                        onClick={() => setActiveTab("freezer")}
                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                            activeTab === "freezer"
                                ? "bg-cyan-500 text-white"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        冷凍
                    </button>
                    <button
                        onClick={() => setActiveTab("pantry")}
                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                            activeTab === "pantry"
                                ? "bg-amber-500 text-white"
                                : "text-gray-300 hover:text-white"
                        }`}
                    >
                        常温
                    </button>
                </div>

                <div className="flex flex-1 gap-2">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4 text-gray-400"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="食材を検索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 bg-gray-800/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value as SortOption)
                        }
                        className="bg-gray-800/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="expiryDate">賞味期限順</option>
                        <option value="name">名前順</option>
                        <option value="purchaseDate">購入日順</option>
                    </select>
                </div>
            </div>
        </motion.div>
    );
}
