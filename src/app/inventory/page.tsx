"use client";

import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

// TODO: 食材追加ボタンの設置

export default function Refrigerator() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [sortBy, setSortBy] = useState("expiryDate");
    const [animateItems, setAnimateItems] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsInitialLoad(false);
        setAnimateItems(true);

        const timer = setTimeout(() => {
            setAnimateItems(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    const categories = [
        {
            id: "vegetables",
            name: "野菜",
            icon: "🥬",
            color: "from-green-400 to-emerald-500",
        },
        {
            id: "fruits",
            name: "果物",
            icon: "🍎",
            color: "from-red-400 to-rose-500",
        },
        {
            id: "meats",
            name: "肉類",
            icon: "🥩",
            color: "from-red-500 to-pink-500",
        },
        {
            id: "seafood",
            name: "魚介類",
            icon: "🐟",
            color: "from-blue-400 to-cyan-500",
        },
        {
            id: "dairy",
            name: "乳製品",
            icon: "🥛",
            color: "from-blue-200 to-indigo-400",
        },
        {
            id: "grains",
            name: "穀物",
            icon: "🌾",
            color: "from-amber-400 to-yellow-500",
        },
        {
            id: "spices",
            name: "調味料",
            icon: "🧂",
            color: "from-orange-300 to-amber-400",
        },
        {
            id: "others",
            name: "その他",
            icon: "📦",
            color: "from-gray-400 to-gray-500",
        },
    ];

    type FoodItem = {
        id: string;
        name: string;
        category: string;
        quantity: number;
        unit: string;
        purchaseDate: string;
        expiryDate: string;
        daysUntilExpiry: number;
        storageLocation: "refrigerator" | "freezer" | "pantry";
        notes?: string;
    };

    const inventoryItems: FoodItem[] = [
        {
            id: "1",
            name: "トマト",
            category: "vegetables",
            quantity: 5,
            unit: "個",
            purchaseDate: "2025/03/30",
            expiryDate: "2025/04/10",
            daysUntilExpiry: 7,
            storageLocation: "refrigerator",
        },
        {
            id: "2",
            name: "牛肉 (肩ロース)",
            category: "meats",
            quantity: 300,
            unit: "g",
            purchaseDate: "2025/04/01",
            expiryDate: "2025/04/05",
            daysUntilExpiry: 2,
            storageLocation: "refrigerator",
        },
        {
            id: "3",
            name: "サーモン",
            category: "seafood",
            quantity: 2,
            unit: "切れ",
            purchaseDate: "2025/04/02",
            expiryDate: "2025/04/06",
            daysUntilExpiry: 3,
            storageLocation: "refrigerator",
        },
        {
            id: "4",
            name: "牛乳",
            category: "dairy",
            quantity: 1,
            unit: "L",
            purchaseDate: "2025/03/27",
            expiryDate: "2025/04/04",
            daysUntilExpiry: 1,
            storageLocation: "refrigerator",
        },
        {
            id: "5",
            name: "バナナ",
            category: "fruits",
            quantity: 3,
            unit: "本",
            purchaseDate: "2025/04/01",
            expiryDate: "2025/04/07",
            daysUntilExpiry: 4,
            storageLocation: "refrigerator",
        },
        {
            id: "6",
            name: "ほうれん草",
            category: "vegetables",
            quantity: 1,
            unit: "束",
            purchaseDate: "2025/04/01",
            expiryDate: "2025/04/04",
            daysUntilExpiry: 0,
            storageLocation: "refrigerator",
        },
        {
            id: "7",
            name: "鶏むね肉",
            category: "meats",
            quantity: 500,
            unit: "g",
            purchaseDate: "2025/03/25",
            expiryDate: "2025/04/05",
            daysUntilExpiry: 2,
            storageLocation: "freezer",
        },
        {
            id: "8",
            name: "ピザ (マルゲリータ)",
            category: "others",
            quantity: 1,
            unit: "枚",
            purchaseDate: "2025/03/10",
            expiryDate: "2025/05/10",
            daysUntilExpiry: 37,
            storageLocation: "freezer",
        },
        {
            id: "9",
            name: "エビ",
            category: "seafood",
            quantity: 200,
            unit: "g",
            purchaseDate: "2025/03/15",
            expiryDate: "2025/06/15",
            daysUntilExpiry: 73,
            storageLocation: "freezer",
        },
        {
            id: "10",
            name: "ブロッコリー",
            category: "vegetables",
            quantity: 2,
            unit: "個",
            purchaseDate: "2025/04/02",
            expiryDate: "2025/04/09",
            daysUntilExpiry: 6,
            storageLocation: "refrigerator",
        },
        {
            id: "11",
            name: "豆腐",
            category: "others",
            quantity: 1,
            unit: "丁",
            purchaseDate: "2025/04/01",
            expiryDate: "2025/04/07",
            daysUntilExpiry: 4,
            storageLocation: "refrigerator",
        },
        {
            id: "12",
            name: "米",
            category: "grains",
            quantity: 2,
            unit: "kg",
            purchaseDate: "2025/03/01",
            expiryDate: "2025/09/01",
            daysUntilExpiry: 151,
            storageLocation: "pantry",
        },
        {
            id: "13",
            name: "パスタ",
            category: "grains",
            quantity: 500,
            unit: "g",
            purchaseDate: "2025/02/15",
            expiryDate: "2025/08/15",
            daysUntilExpiry: 134,
            storageLocation: "pantry",
        },
        {
            id: "14",
            name: "にんじん",
            category: "vegetables",
            quantity: 3,
            unit: "本",
            purchaseDate: "2025/03/30",
            expiryDate: "2025/04/13",
            daysUntilExpiry: 10,
            storageLocation: "refrigerator",
        },
        {
            id: "15",
            name: "醤油",
            category: "spices",
            quantity: 1,
            unit: "本",
            purchaseDate: "2025/01/10",
            expiryDate: "2026/01/10",
            daysUntilExpiry: 282,
            storageLocation: "pantry",
        },
    ];

    const filteredItems = inventoryItems
        .filter(
            (item) => activeTab === "all" || item.storageLocation === activeTab
        )
        .filter(
            (item) =>
                searchQuery === "" ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter(
            (item) =>
                selectedCategory === null || item.category === selectedCategory
        )
        .sort((a, b) => {
            if (sortBy === "expiryDate") {
                return a.daysUntilExpiry - b.daysUntilExpiry;
            } else if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            } else if (sortBy === "purchaseDate") {
                return (
                    new Date(b.purchaseDate).getTime() -
                    new Date(a.purchaseDate).getTime()
                );
            }
            return 0;
        });

    const getCategoryInfo = (categoryId: string) => {
        return (
            categories.find((cat) => cat.id === categoryId) ||
            categories[categories.length - 1]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="inventory" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">カテゴリ</h3>
                                {selectedCategory && (
                                    <button
                                        onClick={() =>
                                            setSelectedCategory(null)
                                        }
                                        className="text-xs text-gray-300 hover:text-white transition-colors"
                                    >
                                        クリア
                                    </button>
                                )}
                            </div>

                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() =>
                                            setSelectedCategory(
                                                category.id === selectedCategory
                                                    ? null
                                                    : category.id
                                            )
                                        }
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                                            category.id === selectedCategory
                                                ? `bg-gradient-to-r ${category.color} bg-opacity-20`
                                                : "hover:bg-white/10"
                                        }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}
                                        >
                                            <span>{category.icon}</span>
                                        </div>
                                        <span className="flex-grow">
                                            {category.name}
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {
                                                inventoryItems.filter(
                                                    (item) =>
                                                        item.category ===
                                                        category.id
                                                ).length
                                            }
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-4"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex bg-gray-800/50 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveTab("all")}
                                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                            activeTab === "all"
                                                ? "bg-purple-500 text-white"
                                                : "text-gray-300 hover:text-white"
                                        }`}
                                    >
                                        全て
                                    </button>
                                    <button
                                        onClick={() =>
                                            setActiveTab("refrigerator")
                                        }
                                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                            activeTab === "refrigerator"
                                                ? "bg-blue-500 text-white"
                                                : "text-gray-300 hover:text-white"
                                        }`}
                                    >
                                        冷蔵
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("freezer")}
                                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                            activeTab === "freezer"
                                                ? "bg-cyan-500 text-white"
                                                : "text-gray-300 hover:text-white"
                                        }`}
                                    >
                                        冷凍
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("pantry")}
                                        className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                            activeTab === "pantry"
                                                ? "bg-amber-500 text-white"
                                                : "text-gray-300 hover:text-white"
                                        }`}
                                    >
                                        常温
                                    </button>
                                </div>

                                <div className="flex flex-1 gap-2">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="w-4 h-4 text-gray-400"
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
                                            placeholder="食材を検索..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="w-full py-2 pl-10 pr-4 bg-gray-800/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(e.target.value)
                                        }
                                        className="bg-gray-800/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="expiryDate">
                                            賞味期限順
                                        </option>
                                        <option value="name">名前順</option>
                                        <option value="purchaseDate">
                                            購入日順
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl p-6"
                        >
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-lg font-bold">
                                    {activeTab === "refrigerator" &&
                                        "冷蔵庫の中身"}
                                    {activeTab === "freezer" && "冷凍庫の中身"}
                                    {activeTab === "pantry" && "食品棚の中身"}
                                    {activeTab === "all" && "すべての食材"}
                                    <span className="ml-2 text-sm font-normal text-gray-400">
                                        ({filteredItems.length} アイテム)
                                    </span>
                                </h3>

                                <button
                                    onClick={() => setAnimateItems(true)}
                                    className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                                >
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
                            </div>

                            {filteredItems.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-12 h-12 mb-4 opacity-50"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 7.5V18A2.25 2.25 0 0 1 18.75 20.25H5.25A2.25 2.25 0 0 1 3 18V7.5m18 0A2.25 2.25 0 0 0 18.75 5.25H5.25A2.25 2.25 0 0 0 3 7.5m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 13.5V7.5"
                                        />
                                    </svg>
                                    <p>該当する食材がありません</p>
                                    <button className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-medium text-white transition-transform hover:scale-105">
                                        食材を追加する
                                    </button>
                                </div>
                            ) : (
                                <div
                                    ref={containerRef}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                >
                                    <AnimatePresence>
                                        {filteredItems.map((item, index) => {
                                            const categoryInfo =
                                                getCategoryInfo(item.category);
                                            return (
                                                <motion.div
                                                    key={item.id}
                                                    layout
                                                    initial={
                                                        isInitialLoad
                                                            ? {
                                                                  opacity: 0,
                                                                  scale: 0.8,
                                                              }
                                                            : false
                                                    }
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                        transition: {
                                                            duration: 0.4,
                                                            delay: animateItems
                                                                ? index * 0.05
                                                                : 0,
                                                        },
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`relative overflow-hidden rounded-xl cursor-pointer ${
                                                        item.daysUntilExpiry <=
                                                        1
                                                            ? "bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/30"
                                                            : item.daysUntilExpiry <=
                                                              3
                                                            ? "bg-gradient-to-br from-amber-900/20 to-amber-800/20 border border-amber-500/30"
                                                            : "bg-white/5 hover:bg-white/10"
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${categoryInfo.color}`}
                                                    ></div>

                                                    <div className="p-4 pl-6">
                                                        <div className="flex justify-between items-start mb-3">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${categoryInfo.color} flex items-center justify-center`}
                                                                >
                                                                    <span>
                                                                        {
                                                                            categoryInfo.icon
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </h4>
                                                                    <p className="text-xs text-gray-400">
                                                                        {
                                                                            categoryInfo.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex gap-1">
                                                                <button className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors">
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
                                                                            d="M12 4.5v15m7.5-7.5h-15"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <button className="p-1.5 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors">
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
                                                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                        />{" "}
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
                                                            <div>
                                                                <p className="text-xs text-gray-400">
                                                                    数量
                                                                </p>
                                                                <p className="font-medium">
                                                                    {
                                                                        item.quantity
                                                                    }{" "}
                                                                    {item.unit}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">
                                                                    保存場所
                                                                </p>
                                                                <p className="font-medium">
                                                                    {item.storageLocation ===
                                                                        "refrigerator" &&
                                                                        "冷蔵庫"}
                                                                    {item.storageLocation ===
                                                                        "freezer" &&
                                                                        "冷凍庫"}
                                                                    {item.storageLocation ===
                                                                        "pantry" &&
                                                                        "常温"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">
                                                                    購入日
                                                                </p>
                                                                <p className="font-medium">
                                                                    {
                                                                        item.purchaseDate
                                                                    }
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-gray-400">
                                                                    賞味期限
                                                                </p>
                                                                <p
                                                                    className={`font-medium ${
                                                                        item.daysUntilExpiry <=
                                                                        1
                                                                            ? "text-red-400"
                                                                            : item.daysUntilExpiry <=
                                                                              3
                                                                            ? "text-amber-400"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    {
                                                                        item.expiryDate
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {item.daysUntilExpiry <=
                                                            3 && (
                                                            <div className="mt-4 flex items-center gap-2">
                                                                <span
                                                                    className={`inline-flex h-2 w-2 rounded-full ${
                                                                        item.daysUntilExpiry <=
                                                                        1
                                                                            ? "bg-red-500 animate-pulse"
                                                                            : "bg-amber-500"
                                                                    }`}
                                                                ></span>
                                                                <span className="text-xs font-medium">
                                                                    {item.daysUntilExpiry ===
                                                                    0
                                                                        ? "今日が期限です！"
                                                                        : item.daysUntilExpiry ===
                                                                          1
                                                                        ? "明日が期限です"
                                                                        : `あと${item.daysUntilExpiry}日で期限切れ`}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </main>
        </div>
    );
}
