"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MealTypeSelector from "./MealTypeSelector";
import MealSearch from "./MealSearch";
import MealList from "./MealList";
import { MealType, MealItem } from "../../types";
import { getMealTypeInfo } from "../../utils";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  mealType: MealType;
  setMealType: (type: MealType) => void;
}

export default function AddMealModal({
  isOpen,
  onClose,
  selectedDate,
  mealType,
  setMealType,
}: AddMealModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMeals, setFilteredMeals] = useState<MealItem[]>([]);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // 後でバックエンドからのデータフェッチに置き換え予定
  const handleAddMeal = () => {
    // 後で実装
    onClose();
  };

  if (!isOpen || !selectedDate) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full ${
                  getMealTypeInfo(mealType).color
                }`}
              ></span>
              {selectedDate.getFullYear()}年
              {selectedDate.getMonth() + 1}月
              {selectedDate.getDate()}日の
              {getMealTypeInfo(mealType).label}を追加
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <MealTypeSelector mealType={mealType} setMealType={setMealType} />
            <MealSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          <MealList
            filteredMeals={filteredMeals}
            searchQuery={searchQuery}
          />
        </div>

        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          <div className="text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomAmount}
                onChange={() => setIsCustomAmount(!isCustomAmount)}
                className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/30"
              />
              <span className="text-gray-300">カスタム量を指定</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleAddMeal}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-300 transition-colors"
            >
              追加
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
