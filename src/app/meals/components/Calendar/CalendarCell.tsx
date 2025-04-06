"use client";

import { motion } from "framer-motion";
import { MealDay } from "../../types";
import { getMealTypeInfo, isToday, getDayColor } from "../../utils";

interface CalendarCellProps {
  day: MealDay;
  isExpanded: boolean;
  expandedDate: Date | null;
  setExpandedDate: (date: Date | null) => void;
  showAddMealModal: (date: Date, type: "breakfast" | "lunch" | "dinner" | "snack") => void;
}

export default function CalendarCell({
  day,
  isExpanded,
  expandedDate,
  setExpandedDate,
  showAddMealModal,
}: CalendarCellProps) {
  return (
    <div className="relative h-36">
      <motion.div
        layoutId={`cell-${day.date.toISOString()}`}
        className="relative h-full"
      >
        {!isExpanded && (
          <div
            className={`
              border border-white/5 rounded-lg p-2 h-full transition-all overflow-hidden flex flex-col
              ${day.currentMonth ? "" : "opacity-40"}
              ${isToday(day.date) ? "ring-2 ring-blue-500/50" : "hover:bg-white/10"}
              ${expandedDate ? "opacity-70" : ""}
              cursor-pointer
            `}
            onClick={() => setExpandedDate(day.date)}
          >
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-lg font-medium
                  ${isToday(day.date) ? "text-blue-400" : ""}
                  ${getDayColor(day.date.getDay())}
                `}
              >
                {day.date.getDate()}
              </span>
            </div>

            <div className="space-y-1.5 overflow-hidden flex-grow">
              {day.meals.length > 0
                ? day.meals.slice(0, 3).map((meal) => {
                    const typeInfo = getMealTypeInfo(meal.type);
                    return (
                      <div
                        key={meal.id}
                        className={`text-xs py-1 px-2 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis
                        ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
                      >
                        <span className={typeInfo.textColor}>
                          {meal.name}
                        </span>
                      </div>
                    );
                  })
                : day.currentMonth && (
                    <div className="h-16 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showAddMealModal(day.date, "breakfast");
                        }}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        + 記録を追加
                      </button>
                    </div>
                  )}

              {day.meals.length > 3 && (
                <div className="text-xs text-gray-400 pl-2 pt-1">
                  + {day.meals.length - 3} more
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
