"use client";

import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useMealsCalendar } from "./hooks/useMealsCalendar";
// ★ 新しく作成したコンポーネントを import
import CalendarGrid from "./components/CalendarGrid";
// ★ ExpandedDayView と AddMealModal も後で import する

export default function MealsPage() {
    const {
        currentMonth,
        currentYear,
        calendarData,
        expandedDate,
        // setExpandedDate, // handleDateClick を使うので不要
        handleCloseExpandedDay,
        showAddMeal,
        // setShowAddMeal, // handleCloseModal を使うので不要
        selectedDate,
        mealType,
        setMealType,
        searchQuery,
        setSearchQuery,
        filteredMeals,
        isToday,
        isSameDate,
        getMealTypeInfo,
        getMonthName,
        getDayName,
        getDayColor,
        handleChangeMonth,
        handleGoToToday,
        handleDateClick, // ★ これを CalendarGrid に渡す
        handleShowAddMealModal, // ★ これを CalendarGrid と ExpandedDayView に渡す
        handleCloseModal, // ★ これを AddMealModal に渡す
        handleAddMeal, // ★ これを AddMealModal に渡す
    } = useMealsCalendar();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="meals" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* --- 月ナビゲーション --- */}
                <motion.div /* ...省略... */ >
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 justify-end">
                         {/* ... 月移動、今日へボタン ... */}
                        <button onClick={() => handleChangeMonth(-1)}>{/* SVG */}</button>
                        <h2 className="text-xl font-semibold px-4">{currentYear}年 {getMonthName(currentMonth)}</h2>
                        <button onClick={() => handleChangeMonth(1)}>{/* SVG */}</button>
                        <button onClick={handleGoToToday} className="ml-4 ...">今日</button>
                    </div>
                </motion.div>

                {/* --- カレンダー本体 --- */}
                 {/* ★★★ ここで CalendarGrid コンポーネントを使用 ★★★ */}
                 <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    // className は CalendarGrid 側に移動したので削除しても良い
                 >
                    <CalendarGrid
                        calendarData={calendarData}
                        expandedDate={expandedDate}
                        isToday={isToday}
                        isSameDate={isSameDate}
                        getDayColor={getDayColor}
                        getDayName={getDayName}
                        getMealTypeInfo={getMealTypeInfo}
                        onDateClick={handleDateClick}
                        onAddMealClick={handleShowAddMealModal}
                    />
                 </motion.div>

                {/* --- 展開された日付の詳細ビュー --- */}
                {/* ★★★ 将来的にはこの AnimatePresence 部分を ExpandedDayView コンポーネントに切り出す ★★★ */}
                <AnimatePresence mode="wait">
                    {expandedDate && calendarData.flat().find(d => isSameDate(d.date, expandedDate)) && ( // expandedDateに対応するデータを見つける
                         <motion.div /* ... 展開表示のコンテナ ... */ >
                             <motion.div /* ... 展開表示の中身 ... */ className="p-4 h-full overflow-y-auto ...">
                                 <div className="p-4 min-h-[400px] ...">
                                      <div className="flex justify-between items-center mb-4">
                                          {/* ... 日付タイトルと閉じるボタン ... */}
                                          <button onClick={handleCloseExpandedDay}>{/* SVG */}</button>
                                      </div>
                                      {/* ... 食事タイプごとの表示ループ ... */}
                                       <div className="space-y-6">
                                          {/* ... map ループ ... */}
                                       </div>
                                 </div>
                             </motion.div>
                         </motion.div>
                    )}
                </AnimatePresence>


                {/* --- 食事追加モーダル --- */}
                {/* ★★★ 将来的にはこの AnimatePresence 部分を AddMealModal コンポーネントに切り出す ★★★ */}
                <AnimatePresence>
                    {showAddMeal && selectedDate && (
                        <div className="fixed inset-0 ..." onClick={handleCloseModal}>
                             <motion.div /* ... モーダルコンテナ ... */ onClick={(e) => e.stopPropagation()}>
                                 {/* Modal Header */}
                                 <div className="p-6 border-b ...">
                                     {/* ... モーダルタイトルと閉じるボタン ... */}
                                     <button onClick={handleCloseModal}>{/* SVG */}</button>
                                 </div>
                                 {/* Modal Content */}
                                  <div className="p-6 overflow-y-auto flex-grow">
                                     {/* ... Meal Type Selection ... */}
                                     {/* ... Search Input ... */}
                                      <div className="max-h-[30vh] overflow-y-auto ...">
                                         {/* ... Meal List / Search Results ... */}
                                          {filteredMeals.map((meal) => (
                                             <motion.div key={meal.id} onClick={() => handleAddMeal(meal)}>{/* ... meal card ... */}</motion.div>
                                         ))}
                                     </div>
                                 </div>
                                 {/* Modal Footer */}
                                  <div className="p-4 border-t ...">
                                      {/* ... */}
                                      <button onClick={handleCloseModal}>キャンセル</button>
                                      {/* ★ Add Button */}
                                      <button onClick={() => console.log("Actual Add Action Needed")}>追加</button>
                                  </div>
                             </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                 {/* --- Floating Action Button --- */}
                 <motion.button onClick={() => { handleShowAddMealModal(new Date(), "breakfast"); }} /* ... 省略 ... */ >{/* SVG */}</motion.motion.button>

            </main>

            {/* Global Styles */}
            <style jsx global>{`/* ... 省略 ... */`}</style>
        </div>
    );
}