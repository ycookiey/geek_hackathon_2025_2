"use client";

import { MealType } from "../../types";
import { getMealTypeInfo } from "../../utils";

interface MealTypeSelectorProps {
  mealType: MealType;
  setMealType: (type: MealType) => void;
}

export default function MealTypeSelector({
  mealType,
  setMealType,
}: MealTypeSelectorProps) {
  return (
    <div className="flex space-x-2 mb-4">
      {(["breakfast", "lunch", "dinner", "snack"] as const).map((type) => {
        const typeInfo = getMealTypeInfo(type);
        return (
          <button
            key={type}
            onClick={() => setMealType(type)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1
                ${
                  mealType === type
                    ? `${typeInfo.color} text-gray-900`
                    : "bg-white/10 hover:bg-white/15"
                }`}
          >
            {typeInfo.label}
          </button>
        );
      })}
    </div>
  );
}
