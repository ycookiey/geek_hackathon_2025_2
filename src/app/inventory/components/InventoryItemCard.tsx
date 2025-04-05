"use client";

import { motion } from "framer-motion";
import { InventoryItem } from "../models/InventoryItem";
import { Category } from "./CategorySidebar";

interface InventoryItemCardProps {
  item: InventoryItem;
  categoryInfo: Category;
  index: number;
  animateItems: boolean;
  isInitialLoad: boolean;
}

export default function InventoryItemCard({
  item,
  categoryInfo,
  index,
  animateItems,
  isInitialLoad,
}: InventoryItemCardProps) {
  const getStorageLocationLabel = (location: string): string => {
    switch (location) {
      case "refrigerator":
        return "冷蔵庫";
      case "freezer":
        return "冷凍庫";
      case "pantry":
        return "常温";
      default:
        return location;
    }
  };

  return (
    <motion.div
      key={item.id}
      layout
      initial={
        isInitialLoad
          ? {
              opacity: 0,
              scale: 0.8,
            }
          : false
      }
      animate={{
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.4,
          delay: animateItems ? index * 0.05 : 0,
        },
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl cursor-pointer ${
        item.daysUntilExpiry <= 1
          ? "bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30"
          : item.daysUntilExpiry <= 3
          ? "bg-gradient-to-br from-amber-900/20 to-amber-800/20 border border-amber-500/30"
          : "bg-white/5 hover:bg-white/10"
      }`}
    >
      <div
        className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${categoryInfo.color}`}
      ></div>

      <div className="p-4 pl-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center`}
            >
              <span>{categoryInfo.icon}</span>
            </div>
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-xs text-gray-400">{categoryInfo.name}</p>
            </div>
          </div>

          <div className="flex gap-1">
            <button className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
            <button className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
          <div>
            <p className="text-xs text-gray-400">数量</p>
            <p className="font-medium">
              {item.quantity} {item.unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">保存場所</p>
            <p className="font-medium">
              {getStorageLocationLabel(item.storageLocation)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">購入日</p>
            <p className="font-medium">{item.purchaseDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">賞味期限</p>
            <p
              className={`font-medium ${
                item.daysUntilExpiry <= 1
                  ? "text-red-400"
                  : item.daysUntilExpiry <= 3
                  ? "text-amber-400"
                  : ""
              }`}
            >
              {item.expiryDate}
            </p>
          </div>
        </div>

        {item.daysUntilExpiry <= 3 && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`inline-flex h-2 w-2 rounded-full ${
                item.daysUntilExpiry <= 1
                  ? "bg-red-500 animate-pulse"
                  : "bg-amber-500"
              }`}
            ></span>
            <span className="text-xs font-medium">
              {item.daysUntilExpiry === 0
                ? "今日が期限です！"
                : item.daysUntilExpiry === 1
                ? "明日が期限です"
                : `あと${item.daysUntilExpiry}日で期限切れ`}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
