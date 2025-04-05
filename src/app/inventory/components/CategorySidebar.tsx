"use client";

import { motion } from "framer-motion";

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
}

interface CategorySidebarProps {
    categories: Category[];
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    getCategoryItemCount: (categoryId: string) => number;
}

export const categories: Category[] = [
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

export default function CategorySidebar({
    categories,
    selectedCategory,
    setSelectedCategory,
    getCategoryItemCount,
}: CategorySidebarProps) {
    return (
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
                        onClick={() => setSelectedCategory(null)}
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
                        <span className="flex-grow">{category.name}</span>
                        <span className="text-sm text-gray-400">
                            {getCategoryItemCount(category.id)}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
