"use client";

// Header は共通コンポーネントを想定
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
// 作成したカスタムフックを import
import { useMealsCalendar } from "./hooks/useMealsCalendar";

export default function MealsPage() {
    // カスタムフックから状態と関数を取得
    const {
        currentMonth,
        currentYear,
        calendarData,
        expandedDate,
        showAddMeal,
        selectedDate,
        mealType,
        setMealType, // モーダル内で使用
        searchQuery, // モーダル内で使用
        setSearchQuery, // モーダル内で使用
        filteredMeals, // モーダル内で使用 (現状サンプル)
        isToday,
        isSameDate,
        getMealTypeInfo,
        getMonthName,
        getDayName,
        getDayColor,
        handleChangeMonth,
        handleGoToToday,
        handleDateClick, // setExpandedDate の代わり
        handleShowAddMealModal,
        handleCloseModal,
        handleCloseExpandedDay,
        handleAddMeal, // ★ モーダルからの追加処理 (現状コンソールログ)
    } = useMealsCalendar();

    // --- ここから下は主に JSX による UI 構造の定義 ---

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="meals" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* --- 月ナビゲーション --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 justify-end">
                        <button
                            onClick={() => handleChangeMonth(-1)} // フックの関数を使用
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {/* SVG Left Arrow */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        </button>
                        <h2 className="text-xl font-semibold px-4">
                            {currentYear}年 {getMonthName(currentMonth)}
                        </h2>
                        <button
                            onClick={() => handleChangeMonth(1)} // フックの関数を使用
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            {/* SVG Right Arrow */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                        </button>
                        <button
                            onClick={handleGoToToday} // フックの関数を使用
                            className="ml-4 px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-full text-sm font-medium transition-colors"
                        >
                            今日
                        </button>
                    </div>
                </motion.div>

                {/* --- カレンダー本体 --- */}
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8"
                >
                    {/* 曜日ヘッダー */}
                    <div className="grid grid-cols-7 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <div key={`header-${day}`} className="text-center py-2 font-medium">
                                <span className={`${getDayColor(day, true)}`}>{getDayName(day)}</span>
                            </div>
                        ))}
                    </div>

                    {/* 日付グリッド */}
                    {/* ★★★ 将来的にはこの部分を CalendarGrid コンポーネントに切り出す ★★★ */}
                    <div className="grid grid-cols-7 gap-2">
                        {calendarData.flat().map((day, index) => (
                            <div key={index} className="relative h-36">
                                <motion.div
                                    layoutId={`cell-${day.date.toISOString()}`}
                                    className="relative h-full"
                                >
                                    {/* --- 通常の日付セル --- */}
                                    {(!expandedDate || !isSameDate(day.date, expandedDate)) && (
                                        <div
                                            className={`border border-white/5 rounded-lg p-2 h-full transition-all overflow-hidden flex flex-col ${day.currentMonth ? "" : "opacity-40"} ${isToday(day.date) ? "ring-2 ring-blue-500/50" : "hover:bg-white/10"} ${expandedDate ? "opacity-70" : ""} cursor-pointer`}
                                            onClick={() => handleDateClick(day.date)} // フックの関数を使用
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-lg font-medium ${isToday(day.date) ? "text-blue-400" : ""} ${getDayColor(day.date.getDay(), day.currentMonth)}`}>
                                                    {day.date.getDate()}
                                                </span>
                                            </div>
                                            {/* 食事サマリー表示 (簡易版) */}
                                            <div className="space-y-1.5 overflow-hidden flex-grow">
                                                {day.meals.length > 0
                                                    ? day.meals.slice(0, 3).map((meal: any) => { // meal の型はフック側で定義した方が良い
                                                          const typeInfo = getMealTypeInfo(meal.type);
                                                          return (
                                                              <div key={meal.id} className={`text-xs py-1 px-2 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis ${typeInfo.lightColor} ${typeInfo.borderColor} border`}>
                                                                  <span className={typeInfo.textColor}>{meal.name}</span>
                                                              </div>
                                                          );
                                                      })
                                                    : day.currentMonth && (
                                                          <div className="h-16 flex items-center justify-center">
                                                              <button onClick={(e) => { e.stopPropagation(); handleShowAddMealModal(day.date, "breakfast"); }} className="text-xs text-gray-400 hover:text-white transition-colors">
                                                                  + 記録を追加
                                                              </button>
                                                          </div>
                                                      )}
                                                {day.meals.length > 3 && (
                                                    <div className="text-xs text-gray-400 pl-2 pt-1">+ {day.meals.length - 3} more</div>