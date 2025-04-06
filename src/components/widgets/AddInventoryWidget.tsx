"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createInventoryItem } from "@/services/inventoryService";
import { categories } from "@/app/inventory/components/CategorySidebar";
import { getFoodCategory } from "@/services/foodCategoryService";

interface AddInventoryWidgetProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddInventoryWidget({
    isOpen,
    onClose,
    onSuccess,
}: AddInventoryWidgetProps) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("vegetables");
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState("個");
    const [storageLocation, setStorageLocation] = useState("refrigerator");
    const [expiryDate, setExpiryDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7); // デフォルトで1週間後
        return date.toISOString().split("T")[0];
    });
    const [memo, setMemo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [autoComplete, setAutoComplete] = useState(false);

    // 食品名入力時の推薦カテゴリ
    const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);

    // フォームの値を検証
    const validateForm = (): string | null => {
        if (!name.trim()) {
            return "食材名を入力してください";
        }
        if (quantity <= 0) {
            return "数量は0より大きい値を入力してください";
        }
        return null;
    };

    // カテゴリIDを日本語に変換
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

    // 保存場所を日本語に変換
    const getStorageLocationName = (location: string): string => {
        const locationMapping: Record<string, string> = {
            refrigerator: "冷蔵庫",
            freezer: "冷凍庫",
            pantry: "常温",
        };
        return locationMapping[location] || "常温";
    };

    // カテゴリID取得
    const getCategoryIdFromName = (categoryName: string): string => {
        const categoryMapping: Record<string, string> = {
            "野菜": "vegetables",
            "果物": "fruits",
            "肉類": "meats",
            "魚介類": "seafood",
            "乳製品": "dairy",
            "穀物": "grains",
            "調味料": "spices",
            "その他": "others",
        };
        return categoryMapping[categoryName] || "others";
    };

    // 食品名からカテゴリを自動推定
    useEffect(() => {
        if (name.trim().length >= 2 && autoComplete) {
            const fetchCategory = async () => {
                try {
                    const result = await getFoodCategory(name);
                    if (result && result.category) {
                        const categoryId = getCategoryIdFromName(result.category);
                        setSuggestedCategory(categoryId);
                    }
                } catch (error) {
                    console.error("Failed to fetch food category:", error);
                    setSuggestedCategory(null);
                }
            };

            // Debounce to avoid too many requests
            const timer = setTimeout(() => {
                fetchCategory();
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setSuggestedCategory(null); // Clear suggestion if conditions not met
        }
    }, [name, autoComplete]);

    // 推奨カテゴリを適用
    const applyRecommendedCategory = () => {
        if (suggestedCategory) {
            setCategory(suggestedCategory);
            setSuggestedCategory(null);
        }
    };

    // フォーム送信
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // フォームの検証
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            setSuccess(null);

            // API呼び出しデータを準備
            const itemData = {
                name,
                category: getCategoryName(category),
                quantity,
                unit,
                storageLocation: getStorageLocationName(storageLocation),
                expiryDate,
                memo,
            };

            // 在庫アイテムを作成
            await createInventoryItem(itemData as any); // `as any` is used here, ensure types match CreateInventoryItemInput

            // 成功メッセージを表示
            setSuccess("食材が正常に追加されました！");

            // 少し間を空けてから閉じる
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess();
                }

                resetForm();
                onClose();
            }, 1500);

        } catch (err: any) {
            console.error("Failed to add inventory item:", err);
            setError(err.message || "食材の追加に失敗しました。もう一度お試しください。");
        } finally {
            setIsSubmitting(false);
        }
    };

    // フォームをリセット
    const resetForm = () => {
        setName("");
        setCategory("vegetables");
        setQuantity(1);
        setUnit("個");
        setStorageLocation("refrigerator");

        // 賞味期限を1週間後にリセット
        const date = new Date();
        date.setDate(date.getDate() + 7);
        setExpiryDate(date.toISOString().split("T")[0]);

        setMemo("");
        setError(null);
        setSuccess(null);
        setSuggestedCategory(null);
    };

    // モーダル表示時にリセット
    useEffect(() => {
        if (isOpen) {
            resetForm();
        }
    }, [isOpen]);

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
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">
                                    食材を追加
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-white/10 transition-colors"
                                    disabled={isSubmitting}
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
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                                        </svg>
                                        {error}
                                    </div>
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                        {success}
                                    </div>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label className="block text-sm font-medium text-gray-200">
                                                食材名
                                            </label>
                                            <label className="inline-flex items-center gap-1">
                                                <input
                                                    type="checkbox"
                                                    checked={autoComplete}
                                                    onChange={() => setAutoComplete(!autoComplete)}
                                                    className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/30 h-3 w-3"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="text-xs text-gray-400">自動推定</span>
                                            </label>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                                placeholder="例: トマト、牛肉、牛乳など"
                                                disabled={isSubmitting}
                                            />
                                            {suggestedCategory && (
                                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                                                    <button
                                                        type="button"
                                                        onClick={applyRecommendedCategory}
                                                        className="text-xs px-2 py-1 bg-blue-500/30 hover:bg-blue-500/40 rounded text-blue-200"
                                                        disabled={isSubmitting}
                                                    >
                                                        {getCategoryName(suggestedCategory)}に設定
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-200">
                                            カテゴリ
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-colors ${
                                                        category === cat.id
                                                            ? `bg-gradient-to-r ${cat.color} bg-opacity-30`
                                                            : "bg-gray-800/50 hover:bg-gray-700/50"
                                                    } ${suggestedCategory === cat.id ? "ring-2 ring-blue-500" : ""}`}
                                                    disabled={isSubmitting}
                                                >
                                                    <span className="text-xl">
                                                        {cat.icon}
                                                    </span>
                                                    <span className="text-xs text-gray-200">
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-200">
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
                                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-200">
                                                単位
                                            </label>
                                            <select
                                                value={unit}
                                                onChange={(e) =>
                                                    setUnit(e.target.value)
                                                }
                                                className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                                disabled={isSubmitting}
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
                                        <label className="block text-sm font-medium mb-1 text-gray-200">
                                            賞味期限
                                        </label>
                                        <input
                                            type="date"
                                            value={expiryDate}
                                            onChange={(e) =>
                                                setExpiryDate(e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-200">
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
                                                disabled={isSubmitting}
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
                                                disabled={isSubmitting}
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
                                                disabled={isSubmitting}
                                            >
                                                常温
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-200">
                                            メモ
                                        </label>
                                        <textarea
                                            value={memo}
                                            onChange={(e) =>
                                                setMemo(e.target.value)
                                            }
                                            className="w-full p-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] text-white placeholder-gray-400"
                                            placeholder="メモを入力（任意）"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-white"
                                        disabled={isSubmitting}
                                    >
                                        キャンセル
                                    </button>
                                    <button
                                        type="submit"
                                        className={`flex-1 px-4 py-2 ${
                                            isSubmitting
                                                ? "bg-blue-500/30 cursor-wait"
                                                : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                        } rounded-lg text-white font-medium transition-all ${
                                            isSubmitting ? "" : "hover:scale-105"
                                        } flex items-center justify-center gap-2`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && (
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {isSubmitting ? "保存中..." : "保存する"}
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
