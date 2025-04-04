"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

export default function MealsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [expandedDate, setExpandedDate] = useState<Date | null>(null);
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [mealType, setMealType] = useState<
        "breakfast" | "lunch" | "dinner" | "snack"
    >("breakfast");
    const [searchQuery, setSearchQuery] = useState("");

    const today = new Date();
    const isToday = (date: Date) => {
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const isSameDate = (date1: Date, date2: Date) => {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    };

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const generateCalendarData = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
            const day = prevMonthDays - firstDayOfMonth + i + 1;
            days.push({
                date: new Date(currentYear, currentMonth - 1, day),
                meals: getMealsForDate(
                    new Date(currentYear, currentMonth - 1, day)
                ),
                currentMonth: false,
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                meals: getMealsForDate(new Date(currentYear, currentMonth, i)),
                currentMonth: true,
            });
        }

        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, i),
                meals: getMealsForDate(
                    new Date(currentYear, currentMonth + 1, i)
                ),
                currentMonth: false,
            });
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks;
    };

    const getMealsForDate = (date: Date) => {
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
            const breakfastOptions = [
                { name: "全粒粉トースト", time: "7:30", calories: 180 },
                { name: "グラノーラ＆ヨーグルト", time: "8:00", calories: 320 },
                { name: "オートミール", time: "7:15", calories: 230 },
                { name: "アボカドトースト", time: "7:45", calories: 290 },
                { name: "卵かけご飯", time: "6:45", calories: 350 },
                { name: "フレンチトースト", time: "8:30", calories: 420 },
            ];
            meals.push({
                id: `${date.toISOString()}-breakfast`,
                type: "breakfast",
                ...breakfastOptions[seed % breakfastOptions.length],
            });
        }

        if (hasLunch) {
            const lunchOptions = [
                { name: "鮭弁当", time: "12:00", calories: 490 },
                { name: "チキンサラダ", time: "13:15", calories: 380 },
                { name: "和風パスタ", time: "12:30", calories: 450 },
                { name: "サンドイッチ", time: "12:45", calories: 410 },
                { name: "野菜カレー", time: "13:00", calories: 520 },
                { name: "冷やし中華", time: "12:15", calories: 430 },
            ];
            meals.push({
                id: `${date.toISOString()}-lunch`,
                type: "lunch",
                ...lunchOptions[(seed + 2) % lunchOptions.length],
            });
        }

        if (hasDinner) {
            const dinnerOptions = [
                { name: "鶏の照り焼き", time: "19:00", calories: 580 },
                { name: "野菜炒め", time: "18:30", calories: 320 },
                { name: "焼き鮭と味噌汁", time: "19:15", calories: 490 },
                { name: "豚の生姜焼き", time: "19:30", calories: 620 },
                { name: "牛丼", time: "18:45", calories: 680 },
                { name: "シーフードリゾット", time: "20:00", calories: 540 },
            ];
            meals.push({
                id: `${date.toISOString()}-dinner`,
                type: "dinner",
                ...dinnerOptions[(seed + 4) % dinnerOptions.length],
            });
        }

        if (hasSnack) {
            const snackOptions = [
                { name: "プロテインバー", time: "15:30", calories: 180 },
                { name: "ミックスナッツ", time: "16:00", calories: 210 },
                { name: "フルーツヨーグルト", time: "15:00", calories: 160 },
                { name: "エナジーバー", time: "16:15", calories: 190 },
                { name: "バナナ", time: "15:45", calories: 120 },
                { name: "チーズ＆クラッカー", time: "16:30", calories: 230 },
            ];
            meals.push({
                id: `${date.toISOString()}-snack`,
                type: "snack",
                ...snackOptions[(seed + 6) % snackOptions.length],
            });
        }

        if (month !== currentMonth && year !== currentYear) {
            return [];
        }

        return meals;
    };

    const changeMonth = (delta: number) => {
        setExpandedDate(null);

        let newMonth = currentMonth + delta;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const goToToday = () => {
        const now = new Date();
        setCurrentMonth(now.getMonth());
        setCurrentYear(now.getFullYear());
        setExpandedDate(now);
    };

    const showAddMealModal = (
        date: Date,
        type: "breakfast" | "lunch" | "dinner" | "snack"
    ) => {
        setSelectedDate(date);
        setMealType(type);
        setShowAddMeal(true);
    };

    const getMealTypeInfo = (type: string) => {
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
    };

    const getMonthName = (month: number) => {
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
    };

    const getDayName = (day: number) => {
        const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
        return dayNames[day];
    };

    const getDayColor = (day: number) => {
        if (day === 0) return "text-red-400";
        if (day === 6) return "text-blue-400";
        return "text-gray-200";
    };

    const calendarData = generateCalendarData();

    const sampleMeals = [
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
        {
            id: 6,
            name: "グリークヨーグルト",
            category: "乳製品",
            calories: 130,
            protein: 15,
            carbs: 6,
            fat: 5,
        },
        {
            id: 7,
            name: "アボカドトースト",
            category: "主食",
            calories: 250,
            protein: 6,
            carbs: 25,
            fat: 15,
        },
        {
            id: 8,
            name: "バナナ",
            category: "果物",
            calories: 105,
            protein: 1,
            carbs: 27,
            fat: 0,
        },
        {
            id: 9,
            name: "味噌汁",
            category: "汁物",
            calories: 60,
            protein: 3,
            carbs: 8,
            fat: 2,
        },
        {
            id: 10,
            name: "茶碗蒸し",
            category: "和食",
            calories: 110,
            protein: 9,
            carbs: 5,
            fat: 6,
        },
        {
            id: 11,
            name: "豚肉の生姜焼き",
            category: "肉料理",
            calories: 320,
            protein: 25,
            carbs: 10,
            fat: 18,
        },
        {
            id: 12,
            name: "ほうれん草のおひたし",
            category: "野菜料理",
            calories: 45,
            protein: 3,
            carbs: 5,
            fat: 0,
        },
    ];

    const filteredMeals = sampleMeals.filter(
        (meal) =>
            meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            meal.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="meals" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 justify-end">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
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

                        <h2 className="text-xl font-semibold px-4">
                            {currentYear}年 {getMonthName(currentMonth)}
                        </h2>

                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
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
                            onClick={goToToday}
                            className="ml-4 px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-full text-sm font-medium transition-colors"
                        >
                            今日
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8"
                >
                    <div className="grid grid-cols-7 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <div
                                key={`header-${day}`}
                                className="text-center py-2 font-medium"
                            >
                                <span className={`${getDayColor(day)}`}>
                                    {getDayName(day)}
                                </span>
                            </div>
                        ))}

                        {calendarData.flat().map((day, index) => (
                            <div key={index} className="relative h-36">
                                <motion.div
                                    layoutId={`cell-${day.date.toISOString()}`}
                                    className="relative h-full"
                                >
                                    {(!expandedDate ||
                                        !isSameDate(
                                            day.date,
                                            expandedDate
                                        )) && (
                                        <div
                                            className={`
                                                border border-white/5 rounded-lg p-2 h-full transition-all overflow-hidden flex flex-col
                                                ${
                                                    day.currentMonth
                                                        ? ""
                                                        : "opacity-40"
                                                }
                                                ${
                                                    isToday(day.date)
                                                        ? "ring-2 ring-blue-500/50"
                                                        : "hover:bg-white/10"
                                                }
                                                ${
                                                    expandedDate
                                                        ? "opacity-70"
                                                        : ""
                                                }
                                                cursor-pointer
                                            `}
                                            onClick={() =>
                                                setExpandedDate(day.date)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span
                                                    className={`text-lg font-medium 
                                                    ${
                                                        isToday(day.date)
                                                            ? "text-blue-400"
                                                            : ""
                                                    } 
                                                    ${getDayColor(
                                                        day.date.getDay()
                                                    )}
                                                `}
                                                >
                                                    {day.date.getDate()}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 overflow-hidden flex-grow">
                                                {day.meals.length > 0
                                                    ? day.meals
                                                          .slice(0, 3)
                                                          .map((meal) => {
                                                              const typeInfo =
                                                                  getMealTypeInfo(
                                                                      meal.type
                                                                  );
                                                              return (
                                                                  <div
                                                                      key={
                                                                          meal.id
                                                                      }
                                                                      className={`text-xs py-1 px-2 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis 
                                                                ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
                                                                  >
                                                                      <span
                                                                          className={
                                                                              typeInfo.textColor
                                                                          }
                                                                      >
                                                                          {
                                                                              meal.name
                                                                          }
                                                                      </span>
                                                                  </div>
                                                              );
                                                          })
                                                    : day.currentMonth && (
                                                          <div className="h-16 flex items-center justify-center">
                                                              <button
                                                                  onClick={(
                                                                      e
                                                                  ) => {
                                                                      e.stopPropagation();
                                                                      showAddMealModal(
                                                                          day.date,
                                                                          "breakfast"
                                                                      );
                                                                  }}
                                                                  className="text-xs text-gray-400 hover:text-white transition-colors"
                                                              >
                                                                  + 記録を追加
                                                              </button>
                                                          </div>
                                                      )}

                                                {day.meals.length > 3 && (
                                                    <div className="text-xs text-gray-400 pl-2 pt-1">
                                                        + {day.meals.length - 3}{" "}
                                                        more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <AnimatePresence mode="wait">
                                        {expandedDate &&
                                            isSameDate(
                                                day.date,
                                                expandedDate
                                            ) && (
                                                <motion.div
                                                    initial={{
                                                        height: "9rem",
                                                        width: "100%",
                                                        opacity: 0.9,
                                                    }}
                                                    animate={{
                                                        height: "650px",
                                                        width: "300%",
                                                        opacity: 1,
                                                        transition: {
                                                            height: {
                                                                duration: 0.2,
                                                                ease: "easeOut",
                                                            },
                                                            width: {
                                                                duration: 0.2,
                                                                delay: 0.1,
                                                                ease: "easeOut",
                                                            },
                                                            opacity: {
                                                                duration: 0.2,
                                                            },
                                                        },
                                                    }}
                                                    exit={{
                                                        height: "9rem",
                                                        width: "100%",
                                                        transition: {
                                                            width: {
                                                                duration: 0.2,
                                                                ease: "easeOut",
                                                            },
                                                            height: {
                                                                duration: 0.2,
                                                                delay: 0.1,
                                                                ease: "easeOut",
                                                            },
                                                        },
                                                    }}
                                                    className="absolute top-0 left-0 z-20 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-white/10 shadow-xl overflow-hidden"
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity: 1,
                                                            transition: {
                                                                delay: 0.3,
                                                                duration: 0.2,
                                                            },
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            transition: {
                                                                duration: 0.0,
                                                            },
                                                        }}
                                                        className="p-4 h-full overflow-y-auto overflow-x-hidden"
                                                    >
                                                        <div className="p-4 min-h-[400px] overflow-y-auto overflow-x-hidden">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="text-xl font-bold">
                                                                    {day.date.getFullYear()}
                                                                    年
                                                                    {day.date.getMonth() +
                                                                        1}
                                                                    月
                                                                    {day.date.getDate()}
                                                                    日
                                                                    <span
                                                                        className={`ml-2 ${getDayColor(
                                                                            day.date.getDay()
                                                                        )}`}
                                                                    >
                                                                        (
                                                                        {getDayName(
                                                                            day.date.getDay()
                                                                        )}
                                                                        )
                                                                    </span>
                                                                    {isToday(
                                                                        day.date
                                                                    ) && (
                                                                        <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                                                            TODAY
                                                                        </span>
                                                                    )}
                                                                </h3>

                                                                <button
                                                                    onClick={() =>
                                                                        setExpandedDate(
                                                                            null
                                                                        )
                                                                    }
                                                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
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

                                                            <div className="space-y-6">
                                                                {[
                                                                    "breakfast",
                                                                    "lunch",
                                                                    "dinner",
                                                                    "snack",
                                                                ].map(
                                                                    (type) => {
                                                                        const typeInfo =
                                                                            getMealTypeInfo(
                                                                                type
                                                                            );
                                                                        const mealsOfType =
                                                                            day.meals.filter(
                                                                                (
                                                                                    m
                                                                                ) =>
                                                                                    m.type ===
                                                                                    type
                                                                            );

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    type
                                                                                }
                                                                                className="space-y-3"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <span
                                                                                        className={`w-3 h-3 rounded-full ${typeInfo.color}`}
                                                                                    ></span>
                                                                                    <h4 className="font-medium">
                                                                                        {
                                                                                            typeInfo.label
                                                                                        }
                                                                                    </h4>
                                                                                </div>

                                                                                {mealsOfType.length >
                                                                                0 ? (
                                                                                    <div className="space-y-2">
                                                                                        {mealsOfType.map(
                                                                                            (
                                                                                                meal
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        meal.id
                                                                                                    }
                                                                                                    className={`p-3 rounded-lg ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
                                                                                                >
                                                                                                    <div className="flex justify-between items-start">
                                                                                                        <div>
                                                                                                            <h5 className="font-medium">
                                                                                                                {
                                                                                                                    meal.name
                                                                                                                }
                                                                                                            </h5>
                                                                                                            <div className="text-sm text-gray-400 mt-1">
                                                                                                                {
                                                                                                                    meal.time
                                                                                                                }{" "}
                                                                                                                •{" "}
                                                                                                                {
                                                                                                                    meal.calories
                                                                                                                }{" "}
                                                                                                                kcal
                                                                                                            </div>
                                                                                                        </div>

                                                                                                        <div className="flex gap-1">
                                                                                                            <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                                                                                                                <svg
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    fill="none"
                                                                                                                    viewBox="0 0 24 24"
                                                                                                                    strokeWidth={
                                                                                                                        1.5
                                                                                                                    }
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
                                                                                                                <svg
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    fill="none"
                                                                                                                    viewBox="0 0 24 24"
                                                                                                                    strokeWidth={
                                                                                                                        1.5
                                                                                                                    }
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
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div
                                                                                        className={`py-4 px-4 border ${typeInfo.borderColor} border-dashed rounded-lg text-center`}
                                                                                    >
                                                                                        <p className="text-gray-400 mb-2">
                                                                                            この日の
                                                                                            {
                                                                                                typeInfo.label
                                                                                            }
                                                                                            は記録されていません
                                                                                        </p>
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                showAddMealModal(
                                                                                                    day.date,
                                                                                                    type as any
                                                                                                )
                                                                                            }
                                                                                            className={`px-4 py-2 ${typeInfo.lightColor} rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors`}
                                                                                        >
                                                                                            {
                                                                                                typeInfo.label
                                                                                            }
                                                                                            を追加
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <AnimatePresence>
                    {showAddMeal && selectedDate && (
                        <div
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                            onClick={() => setShowAddMeal(false)}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-white/10">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            <span
                                                className={`w-4 h-4 rounded-full ${
                                                    getMealTypeInfo(mealType)
                                                        .color
                                                }`}
                                            ></span>
                                            {selectedDate.getFullYear()}年
                                            {selectedDate.getMonth() + 1}月
                                            {selectedDate.getDate()}日の
                                            {getMealTypeInfo(mealType).label}
                                            を追加
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setShowAddMeal(false)
                                            }
                                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
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
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="mb-6">
                                        <div className="flex space-x-2 mb-4">
                                            {(
                                                [
                                                    "breakfast",
                                                    "lunch",
                                                    "dinner",
                                                    "snack",
                                                ] as const
                                            ).map((type) => {
                                                const typeInfo =
                                                    getMealTypeInfo(type);
                                                return (
                                                    <button
                                                        key={type}
                                                        onClick={() =>
                                                            setMealType(type)
                                                        }
                                                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1
                                                            ${
                                                                mealType ===
                                                                type
                                                                    ? `${typeInfo.color} text-gray-900`
                                                                    : "bg-white/10 hover:bg-white/15"
                                                            }`}
                                                    >
                                                        {typeInfo.label}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="w-5 h-5 text-gray-400"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                                    />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="料理を検索またはカスタム料理を入力..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {searchQuery.length > 0 &&
                                                filteredMeals.length === 0 && (
                                                    <div className="col-span-2 bg-white/5 rounded-xl p-6 text-center">
                                                        <div className="text-5xl mb-4">
                                                            🍽️
                                                        </div>
                                                        <p className="text-gray-400 mb-4">
                                                            "{searchQuery}"
                                                            に一致する料理が見つかりません
                                                        </p>
                                                        <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors">
                                                            新しい料理として登録
                                                        </button>
                                                    </div>
                                                )}

                                            {(searchQuery.length === 0
                                                ? sampleMeals
                                                : filteredMeals
                                            ).map((meal) => (
                                                <motion.div
                                                    key={meal.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer transition-all border border-white/10"
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-medium">
                                                            {meal.name}
                                                        </h4>
                                                        <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                                                            {meal.calories} kcal
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 mb-3">
                                                        {meal.category}
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                                        <div className="bg-white/10 rounded-lg p-1">
                                                            <div className="text-blue-300 font-medium">
                                                                {meal.protein}g
                                                            </div>
                                                            <div className="text-gray-400">
                                                                タンパク質
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/10 rounded-lg p-1">
                                                            <div className="text-amber-300 font-medium">
                                                                {meal.carbs}g
                                                            </div>
                                                            <div className="text-gray-400">
                                                                炭水化物
                                                            </div>
                                                        </div>
                                                        <div className="bg-white/10 rounded-lg p-1">
                                                            <div className="text-pink-300 font-medium">
                                                                {meal.fat}g
                                                            </div>
                                                            <div className="text-gray-400">
                                                                脂質
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-white/10 flex justify-between items-center">
                                    <div className="text-sm">
                                        <label className="inline-flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/30"
                                            />
                                            <span className="text-gray-300">
                                                カスタム量を指定
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                setShowAddMeal(false)
                                            }
                                            className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            キャンセル
                                        </button>
                                        <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-300 transition-colors">
                                            追加
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const today = new Date();
                        showAddMealModal(today, "breakfast");
                    }}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 flex items-center justify-center shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </motion.button>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
