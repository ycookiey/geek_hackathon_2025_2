"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InventoryItem } from "../models/InventoryItem";
import InventoryItemCard from "./InventoryItemCard";
import { Category } from "./CategorySidebar";
import { StorageLocation } from "./InventoryFilters";
import AddInventoryItemModal from "./AddInventoryItemModal";

interface InventoryItemListProps {
  items: InventoryItem[];
  getCategoryInfo: (categoryId: string) => Category;
  activeTab: StorageLocation;
  animateItems: boolean;
  setAnimateItems: (animate: boolean) => void;
  isInitialLoad: boolean;
  isLoading?: boolean;
}

export default function InventoryItemList({
  items,
  getCategoryInfo,
  activeTab,
  animateItems,
  setAnimateItems,
  isInitialLoad,
  isLoading = false,
}: InventoryItemListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getTabTitle = (tab: StorageLocation): string => {
    switch (tab) {
      case "refrigerator":
        return "冷蔵庫の中身";
      case "freezer":
        return "冷凍庫の中身";
      case "pantry":
        return "食品棚の中身";
      case "all":
      default:
        return "すべての食材";
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
      >
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-bold">
            {getTabTitle(activeTab)}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({items.length} アイテム)
            </span>
          </h3>

          <button
            onClick={() => setAnimateItems(true)}
            className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1"
            disabled={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
            {isLoading ? "更新中..." : "更新"}
          </button>
        </div>

        {isLoading && !isInitialLoad ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 relative">
              <div className="animate-ping absolute w-full h-full rounded-full bg-blue-500 opacity-75"></div>
              <div className="relative w-full h-full rounded-full bg-blue-500"></div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 mb-4 opacity-50"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 7.5V18A2.25 2.25 0 0 1 18.75 20.25H5.25A2.25 2.25 0 0 1 3 18V7.5m18 0A2.25 2.25 0 0 0 18.75 5.25H5.25A2.25 2.25 0 0 0 3 7.5m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 13.5V7.5"
              />
            </svg>
            <p>該当する食材がありません</p>
            <button 
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-medium text-white transition-transform hover:scale-105"
              onClick={() => setIsAddModalOpen(true)}
            >
              食材を追加する
            </button>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {items.map((item, index) => (
                <InventoryItemCard
                  key={item.id}
                  item={item}
                  categoryInfo={getCategoryInfo(item.category)}
                  index={index}
                  animateItems={animateItems}
                  isInitialLoad={isInitialLoad}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        {items.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-medium text-white transition-transform hover:scale-105 flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              食材を追加する
            </button>
          </div>
        )}
      </motion.div>
      
      <AddInventoryItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
}
