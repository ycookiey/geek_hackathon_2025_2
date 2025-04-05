// src/app/meals/hooks/useMealsCalendar.ts
import { useState, useMemo, useCallback } from "react";

// モーダルで使う食事の型の仮定義 (後でAPI連携時に調整)
// utils/types.ts などに移動しても良い
export interface SampleMeal {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// カレンダーセルのデータ型
export interface CalendarDay {
  date: Date;
  meals: any[]; // ★ 将来的にAPIから取得する MealRecord[] 型に
  currentMonth: boolean;
}

// useMealsCalendar フック
export const useMealsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [expandedDate, setExpandedDate] = useState<Date | null>(null);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [mealType, setMealType] = useState<
    "breakfast" | "lunch" | "dinner" | "snack"
  >("breakfast");
  const [searchQuery, setSearchQuery] = useState(""); // モーダル内の検索用

  const today = useMemo(() => new Date(), []); // today は不変なので useMemo

  // --- 日付ヘルパー関数 ---
  const isToday = useCallback(
    (date: Date) => {
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    },
    [today]
  );

  const isSameDate = useCallback((date1: Date | null, date2: Date | null) => {
    if (!date1 || !date2) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }, []);

  const getDaysInMonth = useCallback((year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  const getFirstDayOfMonth = useCallback((year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  }, []);

  // --- 食事データ取得 (現状はサンプル) ---
  // ★★★ 将来的にはここでAPIを呼び出し、useStateで食事データを管理する ★★★
  const getMealsForDate = useCallback(
    (date: Date) => {
      // page.tsx から持ってきたサンプルデータ生成ロジック
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const seed = day + month * 31 + (year % 10) * 365;
      const hasBreakfast = seed % 5 !== 0;
      const hasLunch = seed % 4 !== 1;
      const hasDinner = seed % 3 !== 2;
      const hasSnack = seed % 7 === 3;
      const meals = [];
      if (hasBreakfast) {
        /* ... breakfastOptions ... */ meals.push({
          id: `${date.toISOString()}-breakfast`,
          type: "breakfast",
          name: "サンプル朝食",
          time: "7:30",
          calories: 200,
        });
      }
      if (hasLunch) {
        /* ... lunchOptions ... */ meals.push({
          id: `${date.toISOString()}-lunch`,
          type: "lunch",
          name: "サンプル昼食",
          time: "12:30",
          calories: 500,
        });
      }
      if (hasDinner) {
        /* ... dinnerOptions ... */ meals.push({
          id: `${date.toISOString()}-dinner`,
          type: "dinner",
          name: "サンプル夕食",
          time: "19:00",
          calories: 600,
        });
      }
      if (hasSnack) {
        /* ... snackOptions ... */ meals.push({
          id: `${date.toISOString()}-snack`,
          type: "snack",
          name: "サンプル間食",
          time: "15:00",
          calories: 150,
        });
      }

      // 他の月のデータを表示しない処理は generateCalendarData 内で行う方が自然かもしれない
      // if (month !== currentMonth && year !== currentYear) { return []; }

      return meals;
    },
    [
      /* ★ API連携時はここに依存配列 (currentMonth, currentYear など) */
    ]
  );

  // --- カレンダーデータ生成 ---
  const calendarData = useMemo(() => {
    console.log("Generating calendar data for", currentYear, currentMonth); // 再計算確認用
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 前月の日付
    const prevMonthDaysCount = getDaysInMonth(currentYear, currentMonth - 1);
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = prevMonthDaysCount - firstDayOfMonth + i + 1;
      const date = new Date(currentYear, currentMonth - 1, day);
      days.push({
        date: date,
        meals: getMealsForDate(date),
        currentMonth: false,
      });
    }

    // 当月の日付
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      days.push({
        date: date,
        meals: getMealsForDate(date),
        currentMonth: true,
      });
    }

    // 次月の日付
    const totalDaysAdded = firstDayOfMonth + daysInMonth;
    const neededRows = Math.ceil(totalDaysAdded / 7);
    const totalCells = neededRows * 7;
    const remainingDays = totalCells - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: date,
        meals: getMealsForDate(date),
        currentMonth: false,
      });
    }

    // 週ごとに分割
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [
    currentYear,
    currentMonth,
    getDaysInMonth,
    getFirstDayOfMonth,
    getMealsForDate,
  ]);

  // --- 表示用ヘルパー ---
  const getMealTypeInfo = useCallback((type: string) => {
    // page.tsx から持ってきたロジック
    switch (type) {
      case "breakfast":
        return {
          label: "朝食",
          color: "bg-rose-700",
          lightColor: "bg-rose-900/30",
          textColor: "text-gray-300",
          borderColor: "border-rose-800/40",
          accentColor: "rose",
        };
      case "lunch":
        return {
          label: "昼食",
          color: "bg-teal-700",
          lightColor: "bg-teal-900/30",
          textColor: "text-gray-300",
          borderColor: "border-teal-800/40",
          accentColor: "teal",
        };
      case "dinner":
        return {
          label: "夕食",
          color: "bg-indigo-700",
          lightColor: "bg-indigo-900/30",
          textColor: "text-gray-300",
          borderColor: "border-indigo-800/40",
          accentColor: "indigo",
        };
      case "snack":
        return {
          label: "間食",
          color: "bg-amber-700",
          lightColor: "bg-amber-900/30",
          textColor: "text-gray-300",
          borderColor: "border-amber-800/40",
          accentColor: "amber",
        };
      default:
        return {
          label: "食事",
          color: "bg-gray-700",
          lightColor: "bg-gray-900/30",
          textColor: "text-gray-300",
          borderColor: "border-gray-800/40",
          accentColor: "gray",
        };
    }
  }, []);

  const getMonthName = useCallback((month: number) => {
    const monthNames = [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ];
    return monthNames[month];
  }, []);

  const getDayName = useCallback((day: number) => {
    const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
    return dayNames[day];
  }, []);

  const getDayColor = useCallback(
    (dayOfWeek: number, isCurrentMonth: boolean = true) => {
      if (!isCurrentMonth) return "text-gray-600"; // 当月以外はグレーアウト
      if (dayOfWeek === 0) return "text-red-400"; // 日曜
      if (dayOfWeek === 6) return "text-blue-400"; // 土曜
      return "text-gray-200"; // 平日
    },
    []
  );

  // --- イベントハンドラー ---
  const handleChangeMonth = useCallback(
    (delta: number) => {
      setExpandedDate(null); // 月が変わったら展開表示を閉じる
      setCurrentMonth((prevMonth) => {
        let newMonth = prevMonth + delta;
        let newYear = currentYear;
        if (newMonth < 0) {
          newMonth = 11;
          newYear--;
        } else if (newMonth > 11) {
          newMonth = 0;
          newYear++;
        }
        setCurrentYear(newYear); // 年の更新もここで行う
        return newMonth;
      });
    },
    [currentYear]
  ); // currentYear も依存配列に追加

  const handleGoToToday = useCallback(() => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setExpandedDate(now); // 今日を選択状態にする
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setExpandedDate(date);
  }, []);

  const handleShowAddMealModal = useCallback(
    (date: Date, type: "breakfast" | "lunch" | "dinner" | "snack") => {
      setSelectedDate(date);
      setMealType(type);
      setShowAddMeal(true);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setShowAddMeal(false);
    setSearchQuery(""); // モーダルを閉じたら検索クエリもリセット
  }, []);

  const handleCloseExpandedDay = useCallback(() => {
    setExpandedDate(null);
  }, []);

  // --- モーダル内のロジック (サンプルデータ) ---
  // ★★★ 将来的には在庫検索や API 呼び出しに置き換える ★★★
  const sampleMeals: SampleMeal[] = useMemo(
    () => [
      // page.tsx から持ってきたサンプルデータ
      {
        id: 1,
        name: "鮭の塩焼き",
        category: "魚料理",
        calories: 250,
        protein: 28,
        carbs: 0,
        fat: 14,
      },
      {
        id: 2,
        name: "サラダチキン",
        category: "肉料理",
        calories: 180,
        protein: 32,
        carbs: 2,
        fat: 5,
      },
      {
        id: 3,
        name: "野菜炒め",
        category: "野菜料理",
        calories: 120,
        protein: 5,
        carbs: 15,
        fat: 6,
      },
      {
        id: 4,
        name: "玄米ごはん",
        category: "主食",
        calories: 220,
        protein: 5,
        carbs: 45,
        fat: 2,
      },
      {
        id: 5,
        name: "シーザーサラダ",
        category: "サラダ",
        calories: 180,
        protein: 7,
        carbs: 10,
        fat: 12,
      },
      // ... 他のサンプルデータ ...
    ],
    []
  );

  const filteredMeals = useMemo(
    () =>
      sampleMeals.filter(
        (meal) =>
          meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          meal.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery, sampleMeals]
  );

  // ★★★ 将来的にはここに AddMeal API 呼び出しロジックを追加 ★★★
  const handleAddMeal = useCallback(
    async (mealToAdd: SampleMeal /* または実際の登録データ型 */) => {
      if (!selectedDate) return;
      console.log(
        "Adding meal:",
        mealToAdd,
        "to date:",
        selectedDate,
        "as type:",
        mealType
      );
      // ここで POST /api/meals の呼び出し (inventoryItemIdを含めて)
      // 例: await mealsApi.create({ recordDate: selectedDate.toISOString(), mealType, items: [{ inventoryItemId: 'xxx', consumedQuantity: 1, ...mealToAdd }], userId: '...' });
      // 成功したらモーダルを閉じる、カレンダーデータを再取得 or 更新
      handleCloseModal();
    },
    [selectedDate, mealType, handleCloseModal]
  );

  // --- フックの戻り値 ---
  return {
    currentMonth,
    currentYear,
    calendarData, // 生成されたカレンダーデータ (週ごとの配列)
    expandedDate,
    setExpandedDate: handleDateClick, // 日付クリックで展開
    handleCloseExpandedDay,
    showAddMeal,
    setShowAddMeal, // 直接制御も可能にするか、専用ハンドラだけにするか
    selectedDate,
    mealType,
    setMealType, // モーダル内でタイプ変更可能にする
    searchQuery, // モーダル用
    setSearchQuery, // モーダル用
    filteredMeals, // モーダル用 (現状サンプル)
    isToday,
    isSameDate,
    getMealTypeInfo,
    getMonthName,
    getDayName,
    getDayColor,
    handleChangeMonth,
    handleGoToToday,
    handleShowAddMealModal, // モーダル表示用ハンドラ
    handleCloseModal, // モーダル非表示用ハンドラ
    handleAddMeal, // ★ モーダルからの食事追加処理ハンドラ (現状コンソールログ)
    // --- 将来追加する状態 ---
    // fetchedMeals: [], // APIから取得した食事データ
    // isLoading: false, // APIロード中フラグ
    // error: null,      // APIエラー
    // refreshMeals: () => {}, // データ再取得関数
  };
};
