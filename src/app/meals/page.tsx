// src/app/meals/page.tsx (抜粋)

import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  useMealsCalendar,
  CalendarDay /* フックから型をimport */,
} from "./hooks/useMealsCalendar";
import CalendarGrid from "./components/CalendarGrid";
import ExpandedDayView from "./components/ExpandedDayView"; // ★ 新しく import
// ★ AddMealModal も後で import する

export default function MealsPage() {
  const {
    // ... (他の状態や関数)
    calendarData,
    expandedDate,
    handleCloseExpandedDay, // ExpandedDayView に渡す
    isToday,
    isSameDate,
    getDayName,
    getDayColor,
    getMealTypeInfo,
    handleShowAddMealModal, // ExpandedDayView に渡す
    // ... (モーダル関連の state や handler)
  } = useMealsCalendar();

  // 選択されている日付のデータを取得するロジック
  // (API連携後はフック内で管理する方が良いが、現状はここで計算)
  const expandedDayData = useMemo(() => {
    if (!expandedDate) return null;
    // calendarData は weeks の配列なので flat() する
    return (
      calendarData.flat().find((d) => isSameDate(d.date, expandedDate)) || null
    );
  }, [expandedDate, calendarData, isSameDate]);

  return (
    <div className="min-h-screen ...">
      <Header activeItem="meals" />
      <main className="max-w-7xl mx-auto ...">
        {/* --- 月ナビゲーション --- */}
        {/* ... 省略 ... */}

        {/* --- カレンダー本体 (CalendarGrid は使用済み) --- */}
        <motion.div /* ... 省略 ... */>
          <CalendarGrid /* ... props ... */ />
        </motion.div>

        {/* --- 展開された日付の詳細ビュー --- */}
        {/* ★★★ ここを ExpandedDayView コンポーネントに置き換え ★★★ */}
        <AnimatePresence mode="wait">
          {expandedDate &&
            expandedDayData && ( // データが存在する場合のみレンダリング
              <ExpandedDayView
                key={expandedDayData.date.toISOString()} // キーを渡して再マウントを促す
                dayData={expandedDayData}
                isToday={isToday}
                getDayName={getDayName}
                getDayColor={getDayColor}
                getMealTypeInfo={getMealTypeInfo}
                onClose={handleCloseExpandedDay}
                onAddMealClick={handleShowAddMealModal}
              />
            )}
        </AnimatePresence>

        {/* --- 食事追加モーダル --- */}
        {/* ★★★ 将来的にはこの AnimatePresence 部分を AddMealModal コンポーネントに切り出す ★★★ */}
        <AnimatePresence>
          {/* ... モーダル表示のロジック (変更なし) ... */}
        </AnimatePresence>

        {/* --- Floating Action Button --- */}
        {/* ... 省略 ... */}
      </main>

      {/* Global Styles */}
      {/* ... 省略 ... */}
    </div>
  );
}
