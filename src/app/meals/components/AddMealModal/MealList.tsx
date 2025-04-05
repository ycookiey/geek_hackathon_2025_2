"use client";

import { motion } from "framer-motion";
import { MealItem } from "../../types";

interface MealListProps {
  filteredMeals: MealItem[];
  searchQuery: string;
}

export default function MealList({
  filteredMeals,
  searchQuery,
}: MealListProps) {
  return (
    <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {searchQuery.length > 0 && filteredMeals.length === 0 && (
          <div className="col-span-2 bg-white/5 rounded-xl p-6 text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <p className="text-gray-400 mb-4">
              "{searchQuery}"に一致する料理が見つかりません
            </p>
            <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors">
              新しい料理として登録
            </button>
          </div>
        )}

        {filteredMeals.map((meal) => (
          <motion.div
            key={meal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer transition-all border border-white/10"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">{meal.name}</h4>
              <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                {meal.calories} kcal
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-3">
              {meal.category}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/10 rounded-lg p-1">
                <div className="text-blue-300 font-medium">
                  {meal.protein}g
                </div>
                <div className="text-gray-400">タンパク質</div>
              </div>
              <div className="bg-white/10 rounded-lg p-1">
                <div className="text-amber-300 font-medium">
                  {meal.carbs}g
                </div>
                <div className="text-gray-400">炭水化物</div>
              </div>
              <div className="bg-white/10 rounded-lg p-1">
                <div className="text-pink-300 font-medium">
                  {meal.fat}g
                </div>
                <div className="text-gray-400">脂質</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
