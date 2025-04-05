// src/app/meals/components/MonthNavigation.tsx
import { motion } from "framer-motion";

interface MonthNavigationProps {
  currentYear: number;
  currentMonth: number;
  getMonthName: (month: number) => string;
  onChangeMonth: (delta: number) => void;
  onGoToToday: () => void;
}

export default function MonthNavigation({
  currentYear,
  currentMonth,
  getMonthName,
  onChangeMonth,
  onGoToToday,
}: MonthNavigationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center space-x-2 mt-4 sm:mt-0 justify-end">
        <button
          onClick={() => onChangeMonth(-1)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="前の月へ"
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
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold px-4 tabular-nums">
          {" "}
          {/* 年月表示用に tabular-nums を追加 */}
          {currentYear}年 {getMonthName(currentMonth)}
        </h2>

        <button
          onClick={() => onChangeMonth(1)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="次の月へ"
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
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>

        <button
          onClick={onGoToToday}
          className="ml-4 px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-full text-sm font-medium transition-colors"
        >
          今日
        </button>
      </div>
    </motion.div>
  );
}
