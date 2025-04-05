// src/app/meals/page.tsx (抜粋)

import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useMealsCalendar } from "./hooks/useMealsCalendar";
import CalendarGrid from "./components/CalendarGrid";
import ExpandedDayView from "./components/ExpandedDayView";
import AddMealModal from "./components/AddMealModal";
import MonthNavigation from "./components/MonthNavigation"; // ★ 新しく import

export default function MealsPage() {
  const {
    currentMonth,
    currentYear,
    getMonthName, // MonthNavigation に渡す
    handleChangeMonth, // MonthNavigation に渡す
    handleGoToToday, // MonthNavigation に渡す
    // ... 他のフックからの戻り値
  } = useMealsCalendar();

  // ... (expandedDayData の計算など)

  return (
    <div className="min-h-screen ...">
      <Header activeItem="meals" />
      <main className="max-w-7xl mx-auto ...">
        {/* --- 月ナビゲーション --- */}
        {/* ★★★ ここを MonthNavigation コンポーネントに置き換え ★★★ */}
        <MonthNavigation
          currentYear={currentYear}
          currentMonth={currentMonth}
          getMonthName={getMonthName}
          onChangeMonth={handleChangeMonth}
          onGoToToday={handleGoToToday}
        />

        {/* --- カレンダー本体 (CalendarGrid使用済み) --- */}
        {/* ... */}
        {/* --- 展開表示 (ExpandedDayView使用済み) --- */}
        {/* ... */}
        {/* --- 食事追加モーダル (AddMealModal使用済み) --- */}
        {/* ... */}
        {/* --- Floating Action Button --- */}
        {/* ... */}
      </main>
      {/* Global Styles */}
      {/* ... */}
    </div>
  );
}
