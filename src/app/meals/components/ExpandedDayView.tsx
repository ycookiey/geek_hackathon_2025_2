// src/app/meals/components/ExpandedDayView.tsx
import { motion } from "framer-motion";
import { CalendarDay } from "../hooks/useMealsCalendar"; // 型をインポート (パスは要調整)

// Props の型定義
interface ExpandedDayViewProps {
  dayData: CalendarDay; // 選択された日のデータ (日付と食事情報を含む)
  isToday: (date: Date) => boolean;
  getDayName: (day: number) => string;
  getDayColor: (dayOfWeek: number, isCurrentMonth?: boolean) => string;
  getMealTypeInfo: (type: string) => {
    label: string;
    color: string;
    lightColor: string;
    textColor: string;
    borderColor: string;
    accentColor: string;
  };
  onClose: () => void; // 閉じるための関数
  onAddMealClick: (
    date: Date,
    type: "breakfast" | "lunch" | "dinner" | "snack"
  ) => void; // 食事追加モーダルを開く関数
}

export default function ExpandedDayView({
  dayData,
  isToday,
  getDayName,
  getDayColor,
  getMealTypeInfo,
  onClose,
  onAddMealClick,
}: ExpandedDayViewProps) {
  const { date, meals } = dayData;

  return (
    // AnimatePresence は呼び出し元の page.tsx 側にあるので、ここでは motion.div から始める
    <motion.div
      // layoutId は CalendarGrid のセルと合わせるため、呼び出し元で設定するか、ここで date から生成
      layoutId={`cell-${date.toISOString()}`}
      initial={{ height: "9rem", width: "100%", opacity: 0.9 }}
      animate={{
        height: "650px",
        width: "300%",
        opacity: 1,
        transition: {
          height: { duration: 0.2, ease: "easeOut" },
          width: { duration: 0.2, delay: 0.1, ease: "easeOut" },
          opacity: { duration: 0.2 },
        },
      }}
      exit={{
        height: "9rem",
        width: "100%",
        transition: {
          width: { duration: 0.2, ease: "easeOut" },
          height: { duration: 0.2, delay: 0.1, ease: "easeOut" },
        },
      }}
      className="absolute top-0 left-0 z-20 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-white/10 shadow-xl overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.3, duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.0 } }}
        className="p-4 h-full overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        <div className="p-4 min-h-[400px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {date.getFullYear()}年 {date.getMonth() + 1}月 {date.getDate()}日
              <span className={`ml-2 ${getDayColor(date.getDay(), true)}`}>
                ({getDayName(date.getDay())})
              </span>
              {isToday(date) && (
                <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                  TODAY
                </span>
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
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
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Meal Sections */}
          <div className="space-y-6">
            {["breakfast", "lunch", "dinner", "snack"].map((type) => {
              const typeInfo = getMealTypeInfo(type);
              // ★ props で渡された meals 配列を使用
              const mealsOfType = meals.filter((m: any) => m.type === type);
              return (
                <div key={type} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${typeInfo.color}`}
                    ></span>
                    <h4 className="font-medium">{typeInfo.label}</h4>
                  </div>
                  {mealsOfType.length > 0 ? (
                    <div className="space-y-2">
                      {mealsOfType.map((meal: any) => (
                        <div
                          key={meal.id}
                          className={`p-3 rounded-lg ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{meal.name}</h5>
                              <div className="text-sm text-gray-400 mt-1">
                                {meal.time} • {meal.calories} kcal
                              </div>
                            </div>
                            {/* ★ TODO: 編集・削除ボタンのロジック実装 */}
                            <div className="flex gap-1">
                              <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                                {/* SVG Edit */}
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
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  />
                                </svg>
                              </button>
                              <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                                {/* SVG Delete */}
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
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`py-4 px-4 border ${typeInfo.borderColor} border-dashed rounded-lg text-center`}
                    >
                      <p className="text-gray-400 mb-2">
                        この日の{typeInfo.label}は記録されていません
                      </p>
                      <button
                        onClick={() => onAddMealClick(date, type as any)}
                        className={`px-4 py-2 ${typeInfo.lightColor} rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors`}
                      >
                        {typeInfo.label}を追加
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
