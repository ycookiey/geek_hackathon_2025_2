"use client";

import { useState } from "react";

export default function Dashboard() {
    const [mealTab, setMealTab] = useState("today");

    // ダミーデータ - 賞味期限が近い食材
    const expiringItems = [
        {
            id: 1,
            name: "牛乳",
            category: "乳製品",
            expiryDate: "2025/04/05",
            daysLeft: 2,
            location: "冷蔵",
        },
        {
            id: 2,
            name: "豚肉",
            category: "肉類",
            expiryDate: "2025/04/06",
            daysLeft: 3,
            location: "冷凍",
        },
        {
            id: 3,
            name: "トマト",
            category: "野菜",
            expiryDate: "2025/04/07",
            daysLeft: 4,
            location: "冷蔵",
        },
        {
            id: 4,
            name: "ほうれん草",
            category: "野菜",
            expiryDate: "2025/04/04",
            daysLeft: 1,
            location: "冷蔵",
        },
        {
            id: 5,
            name: "卵",
            category: "その他",
            expiryDate: "2025/04/09",
            daysLeft: 6,
            location: "冷蔵",
        },
    ];

    // ダミーデータ - 栄養素情報
    const nutrients = [
        {
            name: "カロリー",
            current: 1420,
            target: 2000,
            unit: "kcal",
            percentage: 71,
        },
        {
            name: "タンパク質",
            current: 65,
            target: 80,
            unit: "g",
            percentage: 81,
        },
        { name: "脂質", current: 44, target: 70, unit: "g", percentage: 63 },
        {
            name: "炭水化物",
            current: 165,
            target: 250,
            unit: "g",
            percentage: 66,
        },
        { name: "糖質", current: 38, target: 50, unit: "g", percentage: 76 },
        {
            name: "食物繊維",
            current: 14,
            target: 25,
            unit: "g",
            percentage: 56,
        },
        { name: "塩分", current: 3.8, target: 6, unit: "g", percentage: 63 },
    ];

    // ダミーデータ - 食事予定
    const meals = {
        breakfast: [
            {
                id: 1,
                name: "全粒粉トースト",
                calories: 180,
                protein: 6,
                image: "from-amber-300 to-amber-500",
            },
            {
                id: 2,
                name: "スクランブルエッグ",
                calories: 150,
                protein: 12,
                image: "from-yellow-200 to-yellow-400",
            },
            {
                id: 3,
                name: "アボカド",
                calories: 120,
                protein: 2,
                image: "from-green-300 to-green-500",
            },
        ],
        lunch: [
            {
                id: 4,
                name: "チキンサラダ",
                calories: 320,
                protein: 25,
                image: "from-emerald-300 to-emerald-500",
            },
            {
                id: 5,
                name: "玄米ご飯",
                calories: 220,
                protein: 4,
                image: "from-amber-400 to-amber-600",
            },
        ],
        dinner: [
            {
                id: 6,
                name: "鮭の塩焼き",
                calories: 280,
                protein: 28,
                image: "from-pink-300 to-pink-500",
            },
        ],
    };

    // ダミーデータ - レシピ提案
    const recipes = [
        {
            id: 1,
            name: "ほうれん草とトマトのキッシュ",
            time: "40分",
            difficulty: "普通",
            ingredients: [
                "ほうれん草",
                "トマト",
                "卵",
                "牛乳",
                "ピザ用チーズ",
                "塩",
                "こしょう",
            ],
            expiring: ["ほうれん草", "トマト", "卵", "牛乳"],
            image: "from-green-400 to-emerald-500",
        },
        {
            id: 2,
            name: "豚肉と野菜の味噌炒め",
            time: "20分",
            difficulty: "簡単",
            ingredients: ["豚肉", "キャベツ", "にんじん"],
            expiring: ["豚肉"],
            image: "from-red-400 to-orange-500",
        },
        {
            id: 3,
            name: "トマトとモッツァレラのサラダ",
            time: "10分",
            difficulty: "簡単",
            ingredients: [
                "トマト",
                "モッツァレラチーズ",
                "バジル",
                "オリーブオイル",
                "塩",
                "黒こしょう",
                "バルサミコ酢",
                "レモン汁",
            ],
            expiring: ["トマト"],
            image: "from-red-400 to-pink-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                MealCopilot
                            </h1>
                        </div>

                        <nav className="hidden md:block">
                            <ul className="flex space-x-8">
                                <li className="relative">
                                    <a
                                        href="#"
                                        className="text-white font-medium"
                                    >
                                        ダッシュボード
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        冷蔵庫
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        食事記録
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        レシピ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        分析
                                    </a>
                                </li>
                            </ul>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <button className="p-1 rounded-full text-gray-300 hover:text-white">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                    />
                                </svg>
                            </button>
                            <div className="relative">
                                <button className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                                        <span className="font-medium text-sm">
                                            YT
                                        </span>
                                    </div>
                                    <span className="hidden md:block text-sm">
                                        山田太郎
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 flex flex-col">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
                            <h3 className="text-lg font-bold mb-4">
                                クイックアクション
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <button className="flex flex-col items-center justify-center bg-blue-500/20 hover:bg-blue-500/30 transition-colors rounded-lg p-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center mb-2">
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
                                                d="M12 4.5v15m7.5-7.5h-15"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm">食事を記録</span>
                                </button>

                                <button className="flex flex-col items-center justify-center bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors rounded-lg p-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center mb-2">
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
                                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm">食材を追加</span>
                                </button>

                                <button className="flex flex-col items-center justify-center bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-lg p-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center mb-2">
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
                                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm">献立を計画</span>
                                </button>

                                <button className="flex flex-col items-center justify-center bg-amber-500/20 hover:bg-amber-500/30 transition-colors rounded-lg p-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center mb-2">
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
                                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                            />
                                        </svg>
                                    </div>
                                    <span className="text-sm">レシピ検索</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex-grow">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    賞味期限が近い食材
                                </h3>
                                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    すべて見る
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {expiringItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className={`rounded-lg p-4 flex items-center gap-4 ${
                                            item.daysLeft <= 1
                                                ? "bg-red-500/20 border border-red-500/30"
                                                : item.daysLeft <= 3
                                                ? "bg-amber-500/20 border border-amber-500/30"
                                                : "bg-white/10 border border-white/10"
                                        }`}
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                item.category === "野菜"
                                                    ? "bg-green-500/30"
                                                    : item.category === "肉類"
                                                    ? "bg-red-500/30"
                                                    : item.category === "乳製品"
                                                    ? "bg-blue-500/30"
                                                    : "bg-amber-500/30"
                                            }`}
                                        >
                                            <span className="text-xl">
                                                {item.category === "野菜"
                                                    ? "🥬"
                                                    : item.category === "肉類"
                                                    ? "🥩"
                                                    : item.category === "乳製品"
                                                    ? "🥛"
                                                    : "🥚"}
                                            </span>
                                        </div>

                                        <div className="flex-grow">
                                            <h4 className="font-medium mb-1">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span
                                                    className={`${
                                                        item.daysLeft <= 1
                                                            ? "text-red-300"
                                                            : item.daysLeft <= 3
                                                            ? "text-amber-300"
                                                            : "text-gray-300"
                                                    }`}
                                                >
                                                    あと{item.daysLeft}日
                                                </span>
                                                <span className="text-gray-400">
                                                    •
                                                </span>
                                                <span className="text-gray-300">
                                                    {item.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">
                                    本日の栄養素
                                </h3>
                                <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                    78% 達成
                                </div>
                            </div>

                            <div className="space-y-6">
                                {nutrients.map((nutrient, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-sm text-gray-300">
                                                {nutrient.name}
                                            </span>
                                            <div className="flex items-baseline">
                                                <span className="text-2xl font-bold mr-1">
                                                    {nutrient.current}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    / {nutrient.target}
                                                    {nutrient.unit}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    nutrient.name === "カロリー"
                                                        ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                                        : nutrient.name ===
                                                          "タンパク質"
                                                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                                        : nutrient.name ===
                                                          "脂質"
                                                        ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                                                        : nutrient.name ===
                                                          "炭水化物"
                                                        ? "bg-gradient-to-r from-orange-500 to-amber-400"
                                                        : nutrient.name ===
                                                          "糖質"
                                                        ? "bg-gradient-to-r from-pink-500 to-rose-400"
                                                        : nutrient.name ===
                                                          "食物繊維"
                                                        ? "bg-gradient-to-r from-purple-500 to-indigo-400"
                                                        : "bg-gradient-to-r from-red-500 to-orange-400"
                                                }`}
                                                style={{
                                                    width: `${nutrient.percentage}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">本日の食事予定</h3>
                        <div className="flex bg-gray-800 rounded-full p-1">
                            <button
                                className={`text-sm px-4 py-1.5 rounded-full ${
                                    mealTab === "today"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-300"
                                }`}
                                onClick={() => setMealTab("today")}
                            >
                                今日
                            </button>
                            <button
                                className={`text-sm px-4 py-1.5 rounded-full ${
                                    mealTab === "tomorrow"
                                        ? "bg-blue-500 text-white"
                                        : "text-gray-300"
                                }`}
                                onClick={() => setMealTab("tomorrow")}
                            >
                                明日
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-6 py-3 border-b border-white/10">
                                <h4 className="font-medium">朝食</h4>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="flex-grow min-h-32">
                                    {" "}
                                    {meals.breakfast.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex items-center gap-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full bg-gradient-to-r ${meal.image} flex-shrink-0`}
                                            ></div>
                                            <div className="flex-grow">
                                                <h5 className="font-medium">
                                                    {meal.name}
                                                </h5>
                                                <div className="flex gap-3 text-xs text-gray-300">
                                                    <span>
                                                        {meal.calories} kcal
                                                    </span>
                                                    <span>
                                                        タンパク質{" "}
                                                        {meal.protein}g
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                    + 追加
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-3 border-b border-white/10">
                                <h4 className="font-medium">昼食</h4>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="flex-grow min-h-32">
                                    {" "}
                                    {meals.lunch.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex items-center gap-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full bg-gradient-to-r ${meal.image} flex-shrink-0`}
                                            ></div>
                                            <div className="flex-grow">
                                                <h5 className="font-medium">
                                                    {meal.name}
                                                </h5>
                                                <div className="flex gap-3 text-xs text-gray-300">
                                                    <span>
                                                        {meal.calories} kcal
                                                    </span>
                                                    <span>
                                                        タンパク質{" "}
                                                        {meal.protein}g
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                    + 追加
                                </button>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-3 border-b border-white/10">
                                <h4 className="font-medium">夕食</h4>
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <div className="flex-grow min-h-32">
                                    {" "}
                                    {meals.dinner.map((meal) => (
                                        <div
                                            key={meal.id}
                                            className="flex items-center gap-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                        >
                                            <div
                                                className={`w-10 h-10 rounded-full bg-gradient-to-r ${meal.image} flex-shrink-0`}
                                            ></div>
                                            <div className="flex-grow">
                                                <h5 className="font-medium">
                                                    {meal.name}
                                                </h5>
                                                <div className="flex gap-3 text-xs text-gray-300">
                                                    <span>
                                                        {meal.calories} kcal
                                                    </span>
                                                    <span>
                                                        タンパク質{" "}
                                                        {meal.protein}g
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                                    + 追加
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">
                            期限の近い食材を使ったレシピ提案
                        </h3>
                        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                            もっと見る
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all transform hover:-translate-y-1 hover:shadow-lg flex flex-col"
                            >
                                <div
                                    className={`h-36 bg-gradient-to-r ${recipe.image} relative`}
                                >
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h4 className="text-lg font-bold">
                                            {recipe.name}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full">
                                                {recipe.time}
                                            </span>
                                            <span className="px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full">
                                                難易度：{recipe.difficulty}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 flex-grow flex flex-col">
                                    <div className="mb-3 flex-grow">
                                        <h5 className="text-sm text-gray-300 mb-2">
                                            使用する食材
                                        </h5>
                                        <div className="flex flex-wrap gap-2">
                                            {recipe.ingredients
                                                .slice(0, 5)
                                                .map((ing, i) => (
                                                    <span
                                                        key={i}
                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                            recipe.expiring.includes(
                                                                ing
                                                            )
                                                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                                : "bg-gray-700/50 text-gray-300"
                                                        }`}
                                                    >
                                                        {ing}
                                                    </span>
                                                ))}
                                            {recipe.ingredients.length > 5 && (
                                                <span className="px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-300">
                                                    +
                                                    {recipe.ingredients.length -
                                                        5}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors mt-auto">
                                        レシピを見る
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
