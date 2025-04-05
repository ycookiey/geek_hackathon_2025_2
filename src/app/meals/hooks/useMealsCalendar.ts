// src/app/meals/hooks/useMealsCalendar.ts (抜粋・修正後)
import { useState, useMemo, useCallback } from "react";
// ★ ユーティリティ関数をインポート
import {
    isToday as isTodayUtil, // isToday は useState の変数名と被る可能性があるので別名で import
    isSameDate,
    getDaysInMonth,
    getFirstDayOfMonth,
    getMealTypeInfo,
    getMonthName,
    getDayName,
    getDayColor,
} from '../utils/mealUtils'; // パスは要調整

// ... (他の import や 型定義)

export const useMealsCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    // ... (他の useState)

    const today = useMemo(() => new Date(), []);

    // --- 日付ヘルパー関数 (utils から import したものを呼び出す) ---
    const isToday = useCallback((date: Date) => {
        return isTodayUtil(date, today); // インポートした関数を使用
    }, [today]);

    // ★ isSameDate, getDaysInMonth, getFirstDayOfMonth, getMealTypeInfo,
    // ★ getMonthName, getDayName, getDayColor の関数定義をここから削除

    // --- 食事データ取得 (現状はサンプル) ---
    const getMealsForDate = useCallback((date: Date) => {
        // ... (変更なし)
    }, [/* 依存配列 */]);

    // --- カレンダーデータ生成 ---
    const calendarData = useMemo(() => {
        console.log("Generating calendar data for", currentYear, currentMonth);
        // ★ ここで使用している getDaysInMonth, getFirstDayOfMonth, getMealsForDate は
        //    import されたものか、このスコープ内で定義されたもの(getMealsForDate)を指すようになります。
        const daysInMonth = getDaysInMonth(currentYear, currentMonth); // utils から
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth); // utils から
        // ... (以降のロジックは変更なし)
        const days: CalendarDay[] = [];
        // ...
         return weeks;
    }, [currentYear, currentMonth, getDaysInMonth, getFirstDayOfMonth, getMealsForDate]); // getDaysInMonth 等を依存配列に追加


    // --- イベントハンドラー (変更なし) ---
    const handleChangeMonth = useCallback(/* ... */, [currentYear]);
    const handleGoToToday = useCallback(/* ... */, []);
    const handleDateClick = useCallback(/* ... */, []);
    const handleShowAddMealModal = useCallback(/* ... */, []);
    const handleCloseModal = useCallback(/* ... */, []);
    const handleCloseExpandedDay = useCallback(/* ... */, []);

    // --- モーダル内のロジック (変更なし) ---
    const sampleMeals: SampleMeal[] = useMemo(() => [/* ... */], []);
    const filteredMeals = useMemo(() => sampleMeals.filter(/* ... */), [searchQuery, sampleMeals]);
    const handleAddMeal = useCallback(async (mealToAdd: SampleMeal) => {/* ... */}, [selectedDate, mealType, handleCloseModal]);

    // --- フックの戻り値 (utils から import したヘルパー関数を返す) ---
    return {
        // ... (他の状態やハンドラー)
        isToday,
        isSameDate,
        getMealTypeInfo,
        getMonthName,
        getDayName,
        getDayColor,
        // ...
    };
};