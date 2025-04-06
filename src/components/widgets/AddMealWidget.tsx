"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MealType } from "@/app/meals/utils/mealTypeUtils";
import { createMealRecord } from "@/services/mealService";

// 既存のユーティリティ関数を再利用
import { getMealTypeInfo } from "@/app/meals/utils/mealTypeUtils";

export interface MealItem {
    id: number;
    name: string;
    category: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface AddMealWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialDate?: Date;
    initialMealType?: MealType;
}

export default function AddMealWidget({
    isOpen,
    onClose,
    onSuccess,
    initialDate = new Date(),
    initialMealType = "breakfast",
}: AddMealWidgetProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
    const [mealType, setMealType] = useState<MealType>(initialMealType);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCustomAmount, setIsCustomAmount] = useState(false);
    const [selectedItems, setSelectedItems] = useState<MealItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // サンプル食事データ
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

    const toggleItemSelection = (item: MealItem) => {
        if (selectedItems.some((selected) => selected.id === item.id)) {
            setSelectedItems(
                selectedItems.filter((selected) => selected.id !== item.id)
            );
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            setError("少なくとも1つの食事アイテムを選択してください");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            // 日付をISO形式に変換
            const formattedDate = selectedDate.toISOString().split("T")[0];

            // 食事記録APIに送信するデータを作成
            const mealData = {
                recordDate: formattedDate,
                mealType: getMealTypeLabel(mealType),
                items: selectedItems.map((item) => ({
                    name: item.name,
                    quantity: 1,
                    unit: "人前",
                })),
                notes: "",
            };

            // APIを呼び出して食事記録を作成
            await createMealRecord(mealData);

            // 成功時のコールバックを呼び出し
            if (onSuccess) {
                onSuccess();
            }

            // フォームをリセットして閉じる
            resetForm();
            onClose();
        } catch (err) {
            console.error("Failed to add meal record:", err);
            setError("食事の記録に失敗しました。もう一度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setSelectedItems([]);
        setSearchQuery("");
        setIsCustomAmount(false);
        setError(null);
    };

    // mealTypeに対応する日本語名を取得
    const getMealTypeLabel = (type: MealType): string => {
        switch (type) {
            case "breakfast":
                return "朝食";
            case "lunch":
                return "昼食";
            case "dinner":
                return "夕食";
            case "snack":
                return "間食";
            default:
                return "食事";
        }
    };

    // 日付を変更する関数
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if (!isNaN(newDate.getTime())) {
            setSelectedDate(newDate);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 text-white"
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
                                    食事記録を追加
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
                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="mb-6">
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-300">
                                            日付
                                        </label>
                                        <input
                                            type="date"
                                            value={
                                                selectedDate
                                                    .toISOString()
                                                    .split("T")[0]
                                            }
                                            onChange={handleDateChange}
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-300">
                                            時間帯
                                        </label>
                                        <select
                                            value={mealType}
                                            onChange={(e) =>
                                                setMealType(
                                                    e.target.value as MealType
                                                )
                                            }
                                            className="w-full p-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white"
                                        >
                                            <option value="breakfast">
                                                朝食
                                            </option>
                                            <option value="lunch">昼食</option>
                                            <option value="dinner">夕食</option>
                                            <option value="snack">間食</option>
                                        </select>
                                    </div>
                                </div>

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
                                ? `${typeInfo.color} text-gray-100`
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
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-white placeholder-gray-400"
                                    />
                                </div>
                            </div>

                            {selectedItems.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2 text-gray-300">
                                        選択中の食事
                                    </h4>
                                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                                        {selectedItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                    <span>{item.name}</span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleItemSelection(
                                                            item
                                                        )
                                                    }
                                                    className="p-1 rounded-full hover:bg-white/10"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-4 h-4 text-gray-400 hover:text-white"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18 18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

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
                                    ).map((meal) => {
                                        const isSelected = selectedItems.some(
                                            (item) => item.id === meal.id
                                        );
                                        return (
                                            <motion.div
                                                key={meal.id}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`${
                                                    isSelected
                                                        ? "bg-blue-900/20 border-blue-500/40 border"
                                                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                                                } rounded-xl p-4 cursor-pointer transition-all`}
                                                onClick={() =>
                                                    toggleItemSelection(meal)
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
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-white/10 flex justify-between items-center">
                            <div className="text-sm">
                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isCustomAmount}
                                        onChange={() =>
                                            setIsCustomAmount(!isCustomAmount)
                                        }
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
                                    disabled={isSubmitting}
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting ||
                                        selectedItems.length === 0
                                    }
                                    className={`px-4 py-2 ${
                                        selectedItems.length === 0
                                            ? "bg-gray-500/20 text-gray-400 cursor-not-allowed"
                                            : "bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300"
                                    } rounded-lg text-sm font-medium transition-colors`}
                                >
                                    {isSubmitting ? "記録中..." : "記録する"}
                                </button>
                            </div>
                        </div>

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
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
