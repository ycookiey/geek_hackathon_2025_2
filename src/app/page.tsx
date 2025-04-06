"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // サンプルデータ - 期限切れが近い食材
    const expiringItems = [
        {
            id: "1",
            name: "トマト",
            category: "野菜",
            daysLeft: 2,
            location: "冷蔵庫",
        },
        {
            id: "2",
            name: "牛肉",
            category: "肉類",
            daysLeft: 1,
            location: "冷凍庫",
        },
        {
            id: "3",
            name: "牛乳",
            category: "乳製品",
            daysLeft: 3,
            location: "冷蔵庫",
        },
    ];

    // サンプルデータ - 栄養素
    const nutrients = [
        {
            id: "calories",
            name: "カロリー",
            current: 1450,
            target: 2200,
            percentage: 66,
        },
        {
            id: "protein",
            name: "タンパク質",
            current: 52,
            target: 80,
            percentage: 65,
        },
        {
            id: "fat",
            name: "脂質",
            current: 38,
            target: 73,
            percentage: 52,
        },
    ];

    // サンプルデータ - レシピ推奨
    const recipes = [
        {
            id: "recipe-1",
            name: "トマトとモッツァレラのサラダ",
            time: "15分",
            difficulty: "簡単",
            image: "from-green-400 to-emerald-500",
            ingredients: ["トマト", "モッツァレラ", "バジル", "オリーブオイル"],
        },
        {
            id: "recipe-2",
            name: "ビーフストロガノフ",
            time: "30分",
            difficulty: "普通",
            image: "from-red-400 to-orange-500",
            ingredients: ["牛肉", "玉ねぎ", "マッシュルーム", "サワークリーム"],
        },
        {
            id: "recipe-3",
            name: "キッシュロレーヌ",
            time: "45分",
            difficulty: "普通",
            image: "from-yellow-400 to-amber-500",
            ingredients: ["卵", "牛乳", "ベーコン", "玉ねぎ"],
        },
    ];

    // サンプルデータ - 食事プラン
    const mealItems = [
        {
            id: "meal-1",
            name: "全粒粉トースト",
            calories: 180,
            protein: 6,
            image: "from-amber-500 to-yellow-500",
        },
        {
            id: "meal-2",
            name: "サラダチキン",
            calories: 120,
            protein: 24,
            image: "from-blue-500 to-cyan-500",
        },
        {
            id: "meal-3",
            name: "玄米ごはん",
            calories: 220,
            protein: 5,
            image: "from-emerald-500 to-green-500",
        },
    ];

    // カテゴリと色の対応を取得する関数
    const getCategoryColor = (category: string): string => {
        switch (category) {
            case "野菜":
                return "from-green-400 to-emerald-500";
            case "肉類":
                return "from-red-400 to-rose-500";
            case "魚介類":
                return "from-blue-400 to-cyan-500";
            case "乳製品":
                return "from-blue-200 to-indigo-400";
            case "穀物":
                return "from-amber-400 to-yellow-500";
            case "調味料":
                return "from-orange-300 to-amber-400";
            default:
                return "from-gray-400 to-gray-500";
        }
    };

    // カテゴリとアイコンの対応を取得する関数
    const getCategoryIcon = (category: string): string => {
        switch (category) {
            case "野菜":
                return "🥬";
            case "肉類":
                return "🥩";
            case "魚介類":
                return "🐟";
            case "乳製品":
                return "🥛";
            case "穀物":
                return "🌾";
            case "調味料":
                return "🧂";
            default:
                return "📦";
        }
    };

    // 期限に応じた色を取得する関数
    const getExpirationColor = (daysLeft: number): string => {
        if (daysLeft <= 1) {
            return "bg-red-500/20 border-red-500/30";
        } else if (daysLeft <= 3) {
            return "bg-amber-500/20 border-amber-500/30";
        } else {
            return "bg-white/10 border-white/10";
        }
    };

    // 難易度に応じた色を取得する関数
    const getDifficultyColor = (difficulty: string): string => {
        switch (difficulty.toLowerCase()) {
            case "簡単":
                return "bg-green-500/20 text-green-300";
            case "普通":
                return "bg-amber-500/20 text-amber-300";
            case "難しい":
                return "bg-red-500/20 text-red-300";
            default:
                return "bg-gray-500/20 text-gray-300";
        }
    };

    // 栄養素に応じた色を取得する関数
    const getNutrientColor = (nutrientName: string): string => {
        switch (nutrientName.toLowerCase()) {
            case "カロリー":
                return "from-blue-500 to-cyan-400";
            case "タンパク質":
                return "from-green-500 to-emerald-400";
            case "脂質":
                return "from-yellow-500 to-amber-400";
            case "炭水化物":
                return "from-orange-500 to-amber-400";
            default:
                return "from-gray-500 to-gray-400";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white overflow-hidden font-[family-name:var(--font-geist-sans)]">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div
                    className="absolute w-full h-full"
                    style={{
                        transform: `translateY(${scrollPosition * 0.3}px)`,
                    }}
                >
                    <div
                        className={`absolute top-20 left-[10%] transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: "0.2s" }}
                    >
                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-orange-400 to-red-500 shadow-xl animate-float-slow"></div>
                    </div>
                    <div
                        className={`absolute top-40 right-[15%] transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: "0.4s" }}
                    >
                        <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-xl animate-float-medium"></div>
                    </div>
                    <div
                        className={`absolute bottom-40 left-[20%] transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: "0.6s" }}
                    >
                        <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 shadow-xl animate-float-fast"></div>
                    </div>
                    <div
                        className={`absolute bottom-60 right-[25%] transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: "0.8s" }}
                    >
                        <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-xl animate-float-slow"></div>
                    </div>
                </div>

                <div className="z-10 text-center px-6 max-w-4xl">
                    <div
                        className={`transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 scale-100"
                                : "opacity-0 scale-90"
                        }`}
                    >
                        <h1 className="text-4xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                            MealCopilot
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8">
                            食生活オールインワンアプリ
                        </p>
                    </div>

                    <div
                        className={`flex flex-col md:flex-row gap-6 justify-center transition-all duration-1000 ${
                            isLoaded
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{ transitionDelay: "0.3s" }}
                    >
                        <button
                            onClick={() => router.push("/inventory")}
                            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-lg font-medium transform hover:scale-105 transition-all hover:shadow-lg hover:shadow-blue-500/25"
                        >
                            食材を管理する
                        </button>
                        <button
                            onClick={() => router.push("/recipes")}
                            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-medium transform hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/25"
                        >
                            レシピを提案する
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1440 320"
                        className="w-full"
                    >
                        <path
                            fill="#0369a1"
                            fillOpacity="0.5"
                            d="M0,128L48,133.3C96,139,192,149,288,144C384,139,480,117,576,128C672,139,768,181,864,181.3C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative py-20 px-6 bg-[#0369a1] bg-opacity-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        主な機能
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-4">食材管理</h3>
                            <p className="text-gray-300">
                                手持ちの食材の賞味期限を管理。無駄を減らし、効率的な食材利用をサポートします
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                レシピ提案
                            </h3>
                            <p className="text-gray-300">
                                栄養バランスと冷蔵庫の食材を考慮した、パーソナライズされたレシピを提案します
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                栄養素分析
                            </h3>
                            <p className="text-gray-300">
                                日々の食事から摂取する栄養素を分析し、バランスを視覚化。不足している栄養素を特定します
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inventory Management Section */}
            <section className="py-20 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
                        スマートな食材管理
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        冷蔵庫や食品棚の在庫を一元管理することで、賞味期限の見逃しを防ぎ、ムダなく使い切ることができます
                    </p>

                    {/* Expiring Items UI (Similar to ExpiringItems component) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                賞味期限が近い食材
                            </h3>
                            <div className="flex items-center gap-3">
                                <button className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1.5">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                        />
                                    </svg>
                                    更新
                                </button>
                                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                                    すべて見る
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {expiringItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: 0.1 + index * 0.05,
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    className={`rounded-lg p-4 flex items-center gap-4 ${getExpirationColor(
                                        item.daysLeft
                                    )} border`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-r ${getCategoryColor(
                                            item.category
                                        )}`}
                                    >
                                        <span className="text-xl">
                                            {getCategoryIcon(item.category)}
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
                                                {item.daysLeft === 0
                                                    ? "今日が期限！"
                                                    : `あと${item.daysLeft}日`}
                                            </span>
                                            <span className="text-gray-400">
                                                •
                                            </span>
                                            <span className="text-gray-300">
                                                {item.location}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                                <span className="text-cyan-400 text-xl">
                                    ⏰
                                </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">
                                賞味期限アラート
                            </h3>
                            <p className="text-sm text-gray-300">
                                消費すべき食材を自動でお知らせし、食品ロスを防ぎます
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                <span className="text-emerald-400 text-xl">
                                    📊
                                </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">
                                簡単在庫管理
                            </h3>
                            <p className="text-sm text-gray-300">
                                バーコードスキャンや音声入力で、簡単に食材を登録できます
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                                <span className="text-purple-400 text-xl">
                                    🔄
                                </span>
                            </div>
                            <h3 className="text-lg font-bold mb-2">自動更新</h3>
                            <p className="text-sm text-gray-300">
                                料理を作ると自動的に使用食材を更新し、常に正確な在庫を維持します
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recipe Recommendations Section */}
            <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-[#0e1b30] to-[#102036]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
                        パーソナライズされたレシピ
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        手持ちの食材と栄養バランスに基づいて、あなたにぴったりのレシピを提案します
                    </p>

                    {/* Recipe Recommendations UI (Similar to RecipeRecommendations component) */}
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {recipes.map((recipe, index) => (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: index * 0.1,
                                    }}
                                    whileHover={{ y: -4 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all hover:shadow-lg flex flex-col border border-white/10"
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="mb-3 flex-grow">
                                            <h5 className="text-sm text-gray-300 mb-2">
                                                使用する食材
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {recipe.ingredients.map(
                                                    (ing, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-2 py-1 rounded-full text-xs ${
                                                                expiringItems.some(
                                                                    (item) =>
                                                                        item.name ===
                                                                        ing
                                                                )
                                                                    ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                                    : "bg-gray-700/50 text-gray-300"
                                                            }`}
                                                        >
                                                            {ing}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors mt-auto">
                                            レシピを見る
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-pink-400 text-xl">
                                            🧪
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">
                                            栄養素ベースの提案
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            あなたに不足している栄養素を補うためのレシピを優先的に提案し、バランスの良い食事をサポートします
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-amber-400 text-xl">
                                            🍲
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">
                                            在庫を活用
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            手持ちの食材を最大限に活用するレシピを提案し、食品ロスを削減します
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Nutrition Visualization Section */}
            <section className="py-20 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
                        栄養バランスを可視化
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        食事内容から栄養素摂取状況を分析し、あなたの健康に必要な栄養素バランスを視覚的に確認できます
                    </p>

                    {/* Nutrient Summary UI (Similar to NutrientSummary component) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/5 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">本日の栄養素</h3>
                        </div>

                        <div className="space-y-6">
                            {nutrients.map((nutrient, index) => (
                                <motion.div
                                    key={nutrient.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                    }}
                                    className="mb-4"
                                >
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm text-gray-300">
                                            {nutrient.name}
                                        </span>
                                        <div className="flex items-baseline">
                                            <span className="text-2xl font-bold mr-1">
                                                {nutrient.current}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                / {nutrient.target}g
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${nutrient.percentage}%`,
                                            }}
                                            transition={{
                                                duration: 1,
                                                delay: 0.3 + index * 0.1,
                                            }}
                                            className={`h-full rounded-full bg-gradient-to-r ${getNutrientColor(
                                                nutrient.name
                                            )}`}
                                        ></motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 relative bg-gradient-to-b from-[#0e1b30] to-[#0f172a]">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        毎日のごはんを、もっとスマートに
                    </h2>
                    <p className="text-xl text-gray-300  max-w-2xl mx-auto">
                        食品管理の効率化、レシピの発見、そして栄養バランスの改善
                    </p>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        すべてが一つのアプリで可能に
                    </p>

                    <button
                        className="px-10 py-5 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full text-xl font-medium transform hover:scale-105 transition-all hover:shadow-lg hover:shadow-blue-500/25"
                        onClick={() => router.push("/dashboard")}
                    >
                        今すぐ始める
                    </button>
                </div>
            </section>

            <style jsx global>{`
                @keyframes float-slow {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                @keyframes float-medium {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-15px);
                    }
                }
                @keyframes float-fast {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                @keyframes spin-slow {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 5s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 4s ease-in-out infinite;
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
            `}</style>
        </div>
    );
}
