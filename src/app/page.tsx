"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<number | null>(
        null
    );
    const [recipeHover, setRecipeHover] = useState<number | null>(null);

    useEffect(() => {
        setIsLoaded(true);
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const ingredients = [
        {
            name: "トマト",
            category: "野菜",
            expiry: "2025/04/05",
            location: "冷蔵",
            status: "good",
        },
        {
            name: "玉ねぎ",
            category: "野菜",
            expiry: "2025/04/10",
            location: "常温",
            status: "good",
        },
        {
            name: "牛肉",
            category: "肉類",
            expiry: "2025/04/03",
            location: "冷凍",
            status: "warning",
        },
        {
            name: "卵",
            category: "その他",
            expiry: "2025/04/12",
            location: "冷蔵",
            status: "good",
        },
        {
            name: "牛乳",
            category: "乳製品",
            expiry: "2025/04/04",
            location: "冷蔵",
            status: "warning",
        },
        {
            name: "にんじん",
            category: "野菜",
            expiry: "2025/04/08",
            location: "冷蔵",
            status: "good",
        },
    ];

    const recipes = [
        {
            name: "ビーフストロガノフ",
            ingredients: ["牛肉", "玉ねぎ", "マッシュルーム", "サワークリーム"],
            nutrition: { protein: 85, carbs: 45, fat: 60, fiber: 30 },
            time: "30分",
            image: "gradient-to-r from-red-400 to-orange-500",
        },
        {
            name: "トマトとモッツァレラのサラダ",
            ingredients: ["トマト", "モッツァレラ", "バジル", "オリーブオイル"],
            nutrition: { protein: 40, carbs: 20, fat: 50, fiber: 65 },
            time: "15分",
            image: "gradient-to-r from-green-400 to-emerald-500",
        },
        {
            name: "キッシュロレーヌ",
            ingredients: ["卵", "牛乳", "ベーコン", "玉ねぎ"],
            nutrition: { protein: 70, carbs: 40, fat: 75, fiber: 25 },
            time: "45分",
            image: "gradient-to-r from-yellow-400 to-amber-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white overflow-hidden font-[family-name:var(--font-geist-sans)]">
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
                            栄養バランスを革新する、次世代の食事管理アプリ
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
                        <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-lg font-medium transform hover:scale-105 transition-all hover:shadow-lg hover:shadow-blue-500/25">
                            冷蔵庫を管理する
                        </button>
                        <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-lg font-medium transform hover:scale-105 transition-all hover:shadow-lg hover:shadow-purple-500/25">
                            献立を提案する
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

            <section className="relative py-20 px-6 bg-[#0369a1] bg-opacity-50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
                        主な機能
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 flex items-center justify-center text-white text-2xl font-bold">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                栄養素分析
                            </h3>
                            <p className="text-gray-300">
                                日々の食事から摂取する栄養素を分析し、バランスを視覚化。不足している栄養素を特定します。
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-4">食材管理</h3>
                            <p className="text-gray-300">
                                冷蔵庫内の食材を管理し、賞味期限を追跡。無駄を減らし、効率的な食材利用をサポートします。
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all transform hover:-translate-y-2 hover:shadow-xl">
                            <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 flex items-center justify-center text-white text-2xl font-bold">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-4">
                                レシピ提案
                            </h3>
                            <p className="text-gray-300">
                                栄養バランスと冷蔵庫の食材を考慮した、パーソナライズされたレシピを提案します。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
                        栄養バランスを可視化
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        食事内容から栄養素摂取状況を分析し、あなたの健康に必要な栄養素バランスを視覚的に確認できます
                    </p>

                    <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-10 overflow-hidden">
                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-blue-500 opacity-10 blur-2xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-purple-500 opacity-10 blur-2xl"></div>

                        <div className="w-full h-80 rounded-xl bg-gradient-to-br from-black/30 to-gray-800/30 backdrop-blur-lg p-6 flex items-center justify-center">
                            <div className="w-full max-w-md h-full relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-48 h-48 rounded-full border-8 border-gray-700 flex items-center justify-center">
                                        <div className="w-full h-full rounded-full border-8 border-t-blue-500 border-r-purple-500 border-b-emerald-500 border-l-yellow-500 animate-spin-slow"></div>
                                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                                            <span className="text-4xl font-bold">
                                                78%
                                            </span>
                                            <span className="text-sm text-gray-400">
                                                栄養バランス
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-16 h-32 flex flex-col justify-end">
                                    <div className="h-[65%] w-6 bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg"></div>
                                    <p className="text-xs mt-2 text-gray-400">
                                        タンパク質
                                    </p>
                                </div>

                                <div className="absolute bottom-0 left-20 w-16 h-32 flex flex-col justify-end">
                                    <div className="h-[40%] w-6 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-lg"></div>
                                    <p className="text-xs mt-2 text-gray-400">
                                        脂質
                                    </p>
                                </div>

                                <div className="absolute bottom-0 right-20 w-16 h-32 flex flex-col justify-end">
                                    <div className="h-[75%] w-6 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"></div>
                                    <p className="text-xs mt-2 text-gray-400">
                                        炭水化物
                                    </p>
                                </div>

                                <div className="absolute bottom-0 right-0 w-16 h-32 flex flex-col justify-end">
                                    <div className="h-[25%] w-6 bg-gradient-to-t from-purple-500 to-purple-300 rounded-t-lg"></div>
                                    <p className="text-xs mt-2 text-gray-400">
                                        食物繊維
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-b from-[#0e1b30] to-[#102036]">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
                        スマートな食材管理
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        冷蔵庫や食材棚の中身を一元管理。賞味期限を自動でトラッキングし、ムダを削減します
                    </p>

                    <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl p-6 md:p-10 overflow-hidden mb-6">
                        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-blue-500 opacity-10 blur-2xl"></div>
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-emerald-500 opacity-10 blur-2xl"></div>

                        <div className="relative w-full bg-gradient-to-br from-black/30 to-gray-800/30 backdrop-blur-lg rounded-xl p-6 overflow-hidden">
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className="px-4 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                                    冷蔵
                                </span>
                                <span className="px-4 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium">
                                    冷凍
                                </span>
                                <span className="px-4 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium">
                                    常温
                                </span>
                            </div>

                            <h3 className="text-lg font-bold mb-8">
                                冷蔵庫の中身{" "}
                                <span className="text-sm text-gray-400 font-normal">
                                    （6 アイテム）
                                </span>
                            </h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                {ingredients.map((ingredient, index) => (
                                    <div
                                        key={index}
                                        className={`relative p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                                            selectedIngredient === index
                                                ? "bg-white/20 scale-105 shadow-lg"
                                                : "bg-white/10 hover:bg-white/15"
                                        }`}
                                        onClick={() =>
                                            setSelectedIngredient(
                                                selectedIngredient === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                    >
                                        <div
                                            className={`w-12 h-12 mx-auto mb-2 rounded-full ${
                                                ingredient.category === "野菜"
                                                    ? "bg-green-500/30"
                                                    : ingredient.category ===
                                                      "肉類"
                                                    ? "bg-red-500/30"
                                                    : ingredient.category ===
                                                      "乳製品"
                                                    ? "bg-blue-500/30"
                                                    : "bg-amber-500/30"
                                            } flex items-center justify-center`}
                                        >
                                            <span className="text-xl">
                                                {ingredient.category === "野菜"
                                                    ? "🥬"
                                                    : ingredient.category ===
                                                      "肉類"
                                                    ? "🥩"
                                                    : ingredient.category ===
                                                      "乳製品"
                                                    ? "🥛"
                                                    : "🥚"}
                                            </span>
                                        </div>
                                        <p className="text-center text-sm font-medium">
                                            {ingredient.name}
                                        </p>
                                        {ingredient.status === "warning" && (
                                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                        )}

                                        {selectedIngredient === index && (
                                            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-800/90 backdrop-blur-sm rounded-lg z-10 shadow-xl">
                                                <p className="text-xs mb-1">
                                                    <span className="text-gray-400">
                                                        カテゴリ:
                                                    </span>{" "}
                                                    {ingredient.category}
                                                </p>
                                                <p className="text-xs mb-1">
                                                    <span className="text-gray-400">
                                                        保存場所:
                                                    </span>{" "}
                                                    {ingredient.location}
                                                </p>
                                                <p className="text-xs">
                                                    <span className="text-gray-400">
                                                        賞味期限:
                                                    </span>{" "}
                                                    <span
                                                        className={
                                                            ingredient.status ===
                                                            "warning"
                                                                ? "text-red-400 font-bold"
                                                                : ""
                                                        }
                                                    >
                                                        {ingredient.expiry}
                                                    </span>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

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

            <section className="py-20 px-6 relative overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6">
                        パーソナライズされたレシピ
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        冷蔵庫の中身と栄養バランスに基づいて、あなたにぴったりのレシピを提案します
                    </p>

                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {recipes.map((recipe, index) => (
                                <div
                                    key={index}
                                    className="relative bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                                    onMouseEnter={() => setRecipeHover(index)}
                                    onMouseLeave={() => setRecipeHover(null)}
                                >
                                    <div
                                        className={`h-48 ${recipe.image} relative`}
                                    >
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-xs font-medium">
                                            {recipe.time}
                                        </div>
                                        <div className="absolute bottom-4 left-4">
                                            <h3 className="text-xl font-bold">
                                                {recipe.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {recipe.ingredients.map(
                                                (ing, i) => (
                                                    <span
                                                        key={i}
                                                        className={`px-2 py-1 rounded-full text-xs ${
                                                            ingredients.some(
                                                                (item) =>
                                                                    item.name ===
                                                                    ing
                                                            )
                                                                ? "bg-green-500/20 text-green-300"
                                                                : "bg-gray-600/40 text-gray-300"
                                                        }`}
                                                    >
                                                        {ing}
                                                    </span>
                                                )
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-gray-400">
                                                栄養スコア
                                            </div>
                                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                                                    style={{
                                                        width: `${
                                                            (recipe.nutrition
                                                                .protein +
                                                                recipe.nutrition
                                                                    .carbs +
                                                                recipe.nutrition
                                                                    .fat +
                                                                recipe.nutrition
                                                                    .fiber) /
                                                            4
                                                        }%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {recipeHover === index && (
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-sm flex flex-col justify-center items-center p-6 transition-opacity duration-200">
                                            <h4 className="text-xl font-bold mb-6 text-center">
                                                {recipe.name}
                                            </h4>

                                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                                                <div className="text-center">
                                                    <div className="w-12 h-12 mx-auto rounded-full border-4 border-green-500 flex items-center justify-center">
                                                        <span className="text-sm">
                                                            {
                                                                recipe.nutrition
                                                                    .protein
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-300">
                                                        タンパク質
                                                    </p>
                                                </div>

                                                <div className="text-center">
                                                    <div className="w-12 h-12 mx-auto rounded-full border-4 border-blue-500 flex items-center justify-center">
                                                        <span className="text-sm">
                                                            {
                                                                recipe.nutrition
                                                                    .carbs
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-300">
                                                        炭水化物
                                                    </p>
                                                </div>

                                                <div className="text-center">
                                                    <div className="w-12 h-12 mx-auto rounded-full border-4 border-yellow-500 flex items-center justify-center">
                                                        <span className="text-sm">
                                                            {
                                                                recipe.nutrition
                                                                    .fat
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-300">
                                                        脂質
                                                    </p>
                                                </div>

                                                <div className="text-center">
                                                    <div className="w-12 h-12 mx-auto rounded-full border-4 border-purple-500 flex items-center justify-center">
                                                        <span className="text-sm">
                                                            {
                                                                recipe.nutrition
                                                                    .fiber
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                    <p className="text-xs mt-1 text-gray-300">
                                                        食物繊維
                                                    </p>
                                                </div>
                                            </div>

                                            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-medium">
                                                レシピを見る
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                                            在庫活用レシピ
                                        </h3>
                                        <p className="text-sm text-gray-300">
                                            冷蔵庫にある食材を最大限に活用するレシピを提案し、食品ロスを削減します
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-base font-medium transition-all">
                                もっとレシピを見る →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 relative bg-gradient-to-b from-[#0e1b30] to-[#0f172a]">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500 opacity-10 blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">
                        健康的な食生活を始めましょう
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
                        栄養バランスの改善、食品管理の効率化、そして美味しいレシピの発見。
                        すべてが一つのアプリで可能に。
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
