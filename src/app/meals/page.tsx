// src/app/meals/page.tsx (抜粋)

import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useMealsCalendar } from "./hooks/useMealsCalendar";
import CalendarGrid from "./components/CalendarGrid";
import ExpandedDayView from "./components/ExpandedDayView";
import AddMealModal from "./components/AddMealModal"; // ★ 新しく import

export default function MealsPage() {
  const {
    // ... (他の状態や関数)
    showAddMeal, // モーダルの表示状態
    handleCloseModal, // モーダルを閉じる関数
    selectedDate, // モーダルに渡す選択された日付
    mealType, // モーダルに渡す初期の食事タイプ
    getMealTypeInfo, // モーダルに渡すヘルパー
    // ★ モーダル内部で管理するため、ページからは不要になる可能性あり
    // searchQuery, setSearchQuery, filteredMeals,
    // ★ 代わりに実際の在庫データや検索関数を渡す必要がある
    sampleMeals, // 現状はサンプルデータリストを渡す
    handleAddMeal, // ★ モーダルに渡す追加処理関数
    // ...
  } = useMealsCalendar();

  // ... (expandedDayData の計算など)

  return (
    <div className="min-h-screen ...">
      <Header activeItem="meals" />
      <main className="max-w-7xl mx-auto ...">
        {/* ... 月ナビゲーション ... */}
        {/* ... カレンダーグリッド (CalendarGrid使用済み) ... */}
        {/* ... 展開表示 (ExpandedDayView使用済み) ... */}

        {/* --- 食事追加モーダル --- */}
        {/* ★★★ ここを AddMealModal コンポーネントに置き換え ★★★ */}
        <AnimatePresence>
          {showAddMeal &&
            selectedDate && ( // showAddMeal で表示を制御
              <AddMealModal
                isOpen={showAddMeal}
                onClose={handleCloseModal}
                selectedDate={selectedDate}
                initialMealType={mealType} // フックが持つ mealType を初期値として渡す
                getMealTypeInfo={getMealTypeInfo}
                sampleMeals={sampleMeals} // ★ 現状はサンプルデータ
                onAddMeal={handleAddMeal} // ★ 追加処理関数
              />
            )}
        </AnimatePresence>

        {/* --- Floating Action Button --- */}
        {/* ... 省略 ... */}
      </main>

      {/* Global Styles */}
      {/* ... 省略 ... */}
    </div>
  );
}
