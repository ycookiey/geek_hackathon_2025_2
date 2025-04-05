// src/app/meals/components/CalendarGrid.tsx
import { motion } from "framer-motion";
import { CalendarDay, SampleMeal } from "../hooks/useMealsCalendar"; // フックから型をインポート (パスは要調整)

interface CalendarGridProps {
  calendarData: CalendarDay[][];
  expandedDate: Date | null;
  isToday: (date: Date) => boolean;
  isSameDate: (date1: Date | null, date2: Date | null) => boolean;
  getDayColor: (dayOfWeek: number, isCurrentMonth?: boolean) => string;
  getDayName: (day: number) => string;
  getMealTypeInfo: (type: string) => {
    label: string;
    color: string;
    lightColor: string;
    textColor: string;
    borderColor: string;
    accentColor: string;
  };
  onDateClick: (date: Date) => void;
  onAddMealClick: (
    date: Date,
    type: "breakfast" | "lunch" | "dinner" | "snack"
  ) => void;
}

export default function CalendarGrid({
  calendarData,
  expandedDate,
  isToday,
  isSameDate,
  getDayColor,
  getDayName,
  getMealTypeInfo,
  onDateClick,
  onAddMealClick,
}: CalendarGridProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2">
        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
          <div key={`header-${day}`} className="text-center py-2 font-medium">
            <span className={`${getDayColor(day, true)}`}>
              {getDayName(day)}
            </span>
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-2">
        {calendarData.flat().map((day, index) => (
          <div key={index} className="relative h-36">
            <motion.div
              layoutId={`cell-${day.date.toISOString()}`} // アニメーション用ID
              className="relative h-full"
            >
              {/* --- 通常の日付セル (展開表示部分はこのコンポーネントには含まない) --- */}
              {(!expandedDate || !isSameDate(day.date, expandedDate)) && (
                <div
                  className={`border border-white/5 rounded-lg p-2 h-full transition-all overflow-hidden flex flex-col ${
                    day.currentMonth ? "" : "opacity-40"
                  } ${
                    isToday(day.date)
                      ? "ring-2 ring-blue-500/50"
                      : "hover:bg-white/10"
                  } ${expandedDate ? "opacity-70" : ""} cursor-pointer`}
                  onClick={() => onDateClick(day.date)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-lg font-medium ${
                        isToday(day.date) ? "text-blue-400" : ""
                      } ${getDayColor(day.date.getDay(), day.currentMonth)}`}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>
                  {/* 食事サマリー表示 (簡易版) */}
                  <div className="space-y-1.5 overflow-hidden flex-grow">
                    {day.meals.length > 0
                      ? day.meals.slice(0, 3).map((meal: any) => {
                          const typeInfo = getMealTypeInfo(meal.type);
                          return (
                            <div
                              key={meal.id}
                              className={`text-xs py-1 px-2 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
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
                                onAddMealClick(day.date, "breakfast");
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
              {/* 展開表示はここではレンダリングしない */}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
