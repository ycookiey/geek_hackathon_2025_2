"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories } from "./CategorySidebar";
import { createInventoryItem } from "@/services/inventoryService";
import { useInventory } from "@/state/inventory/inventoryContext";

interface AddInventoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddInventoryItemModal({
    isOpen,
    onClose,
}: AddInventoryItemModalProps) {
    const { refreshInventory } = useInventory();
    const [name, setName] = useState("");
    const [category, setCategory] = useState("vegetables");
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState("個");
    const [storageLocation, setStorageLocation] = useState("refrigerator");
    const [memo, setMemo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCategoryName = (categoryId: string): string => {
        const categoryMapping: Record<string, string> = {
            vegetables: "野菜",
            fruits: "果物",
            meats: "肉類",
            seafood: "魚介類",
            dairy: "乳製品",
            grains: "穀物",
            spices: "調味料",
            others: "その他",
        };
        return categoryMapping[categoryId] || "その他";
    };

    const getStorageLocationName = (location: string): string => {
        const locationMapping: Record<string, string> = {
            refrigerator: "冷蔵庫",
            freezer: "冷凍庫",
            pantry: "常温",
        };
        return locationMapping[location] || "常温";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError("食材名を入力してください");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            await createInventoryItem({
                name,
                category: getCategoryName(category) as any,
                quantity,
                unit,
                storageLocation: getStorageLocationName(storageLocation),
                memo,
            });

            await refreshInventory();
            onClose();

            setName("");
            setCategory("vegetables");
            setQuantity(1);
            setUnit("個");
            setStorageLocation("refrigerator");
            setMemo("");
        } catch (err) {
            console.error("Failed to add inventory item:", err);
            setError("食材の追加に失敗しました。もう一度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">
                                    食材を追加
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                >
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
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            食材名
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="例: トマト、牛肉、牛乳など"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            カテゴリ
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setCategory(cat.id)
                                                    }
                                                    className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                                                        category === cat.id
                                                            ? `bg-gradient-to-r ${cat.color} bg-opacity-20`
                                                            : "bg-gray-800/50 hover:bg-gray-700/50"
                                                    }`}
                                                >
                                                    <span className="text-xl">
                                                        {cat.icon}
                                                    </span>
                                                    <span className="text-xs">
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                数量
                                            </label>
                                            <input
                                                type="number"
                                                min="0.1"
                                                step="0.1"
                                                value={quantity}
                                                onChange={(e) =>
                                                    setQuantity(
                                                        parseFloat(
                                                            e.target.value
                                                        )
                                                    )
                                                }
                                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                単位
                                            </label>
                                            <select
                                                value={unit}
                                                onChange={(e) =>
                                                    setUnit(e.target.value)
                                                }
                                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="個">個</option>
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                                <option value="ml">ml</option>
                                                <option value="L">L</option>
                                                <option value="パック">
                                                    パック
                                                </option>
                                                <option value="袋">袋</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            保存場所
                                        </label>
                                        <div className="flex bg-gray-800/50 rounded-lg p-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStorageLocation(
                                                        "refrigerator"
                                                    )
                                                }
                                                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                                    storageLocation ===
                                                    "refrigerator"
                                                        ? "bg-blue-500 text-white"
                                                        : "text-gray-300 hover:text-white"
                                                }`}
                                            >
                                                冷蔵
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStorageLocation(
                                                        "freezer"
                                                    )
                                                }
                                                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                                    storageLocation ===
                                                    "freezer"
                                                        ? "bg-cyan-500 text-white"
                                                        : "text-gray-300 hover:text-white"
                                                }`}
                                            >
                                                冷凍
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setStorageLocation("pantry")
                                                }
                                                className={`flex-1 px-4 py-2 text-sm rounded-md transition-colors ${
                                                    storageLocation === "pantry"
                                                        ? "bg-amber-500 text-white"
                                                        : "text-gray-300 hover:text-white"
                                                }`}
                                            >
                                                常温
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            メモ
                                        </label>
                                        <textarea
                                            value={memo}
                                            onChange={(e) =>
                                                setMemo(e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                                            placeholder="メモを入力（任意）"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-medium transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? "保存中..."
                                            : "保存する"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
