"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MealType, getMealTypeInfo } from "../utils/mealTypeUtils";

export interface MealItem {
    id: number;
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface AddMealModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: Date | null;
    mealType: MealType;
    setMealType: (type: MealType) => void;
    onAddMeal?: (mealId: number, date: Date, type: MealType) => void;
}

export default function AddMealModal({
    isOpen,
    onClose,
    selectedDate,
    mealType,
    setMealType,
    onAddMeal,
}: AddMealModalProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const sampleMeals: MealItem[] = [
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
    ];

    const filteredMeals = sampleMeals.filter(
        (meal) =>
            meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            meal.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddMeal = (mealId: number) => {
        if (selectedDate && onAddMeal) {
            onAddMeal(mealId, selectedDate, mealType);
        }
        onClose();
    };

    if (!selectedDate) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={onClose}
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
                                            getMealTypeInfo(mealType).color
                                        }`}
                                    ></span>
                                    {selectedDate.getFullYear()}年
                                    {selectedDate.getMonth() + 1}月
                                    {selectedDate.getDate()}日の
                                    {getMealTypeInfo(mealType).label}
                                    を追加
                                </h3>
                                <button
                                    onClick={onClose}
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
                                        const typeInfo = getMealTypeInfo(type);
                                        return (
                                            <button
                                                key={type}
                                                onClick={() =>
                                                    setMealType(type)
                                                }
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1
                            ${
                                mealType === type
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
                                            setSearchQuery(e.target.value)
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
                                                    "{searchQuery}
                                                    "に一致する料理が見つかりません
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
                                            onClick={() =>
                                                handleAddMeal(meal.id)
                                            }
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
                                    onClick={onClose}
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
    );
}
