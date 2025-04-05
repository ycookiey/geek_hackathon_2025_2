// src/app/meals/components/AddMealModal.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SampleMeal } from "../hooks/useMealsCalendar"; // 仮の型 (フックから or models から)

// Props の型定義
interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  initialMealType: "breakfast" | "lunch" | "dinner" | "snack";
  getMealTypeInfo: (type: string) => {
    label: string;
    color: string /* ...他 */;
  };
  // ★ 将来的には実際の食事/在庫データと追加関数を渡す
  sampleMeals: SampleMeal[]; // 現状はサンプルの食事リスト
  onAddMeal: (mealToAdd: SampleMeal /* ★ 実際の型に変更 */) => Promise<void>; // 現状はサンプルの追加関数
}

export default function AddMealModal({
  isOpen,
  onClose,
  selectedDate,
  initialMealType,
  getMealTypeInfo,
  sampleMeals,
  onAddMeal,
}: AddMealModalProps) {
  // モーダル内部の状態
  const [mealType, setMealType] = useState(initialMealType);
  const [searchQuery, setSearchQuery] = useState("");

  // isOpen が変わるたびに mealType を初期化
  useEffect(() => {
    if (isOpen) {
      setMealType(initialMealType);
      setSearchQuery(""); // モーダルが開いたら検索クエリもリセット
    }
  }, [isOpen, initialMealType]);

  // ★ 現状はサンプルデータでフィルタリング
  const filteredMeals = sampleMeals.filter(
    (meal) =>
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ★ TODO: この関数で実際に選択された在庫アイテム情報と数量をまとめて
  // onAddMeal(payload) を呼び出すように変更する必要がある
  const handleAddButtonClick = () => {
    console.log(
      "Add button clicked - needs implementation to gather selected items and call onAddMeal"
    );
    // 例: onAddMeal({ name: '選択されたアイテム', inventoryItemId: 'xyz', consumedQuantity: 1 });
    // 成功したら onClose();
  };

  if (!isOpen || !selectedDate) {
    return null; // isOpenがfalseかselectedDateがnullなら何も表示しない
  }

  return (
    // AnimatePresence は呼び出し元の page.tsx 側にあるので、ここでは不要
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose} // 背景クリックで閉じる
    >
      <motion.div
        key="add-meal-modal" // AnimatePresence 内で key を持つことが推奨される場合がある
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-xl border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()} // モーダル内部のクリックで閉じないようにする
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full ${
                  getMealTypeInfo(mealType).color
                }`}
              ></span>
              {selectedDate.getFullYear()}年 {selectedDate.getMonth() + 1}月{" "}
              {selectedDate.getDate()}日の {getMealTypeInfo(mealType).label}{" "}
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            {/* Meal Type Selection */}
            <div className="flex space-x-2 mb-4">
              {(["breakfast", "lunch", "dinner", "snack"] as const).map(
                (type) => {
                  const typeInfo = getMealTypeInfo(type);
                  return (
                    <button
                      key={type}
                      onClick={() => setMealType(type)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                        mealType === type
                          ? `${typeInfo.color} text-gray-900`
                          : "bg-white/10 hover:bg-white/15"
                      }`}
                    >
                      {typeInfo.label}
                    </button>
                  );
                }
              )}
            </div>
            {/* Search Input */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>
          {/* Meal List / Search Results */}
          <div className="max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ★★★ ここを在庫アイテムの検索・選択UIに置き換える ★★★ */}
              {filteredMeals.map((meal) => (
                <motion.div
                  key={meal.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  // ★ クリックで選択状態にするなどの処理が必要
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-4 cursor-pointer transition-all border border-white/10"
                >
                  {/* Meal Card Content */}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{meal.name}</h4>
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
                      <div className="text-gray-400">タンパク質</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-1">
                      <div className="text-amber-300 font-medium">
                        {meal.carbs}g
                      </div>
                      <div className="text-gray-400">炭水化物</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-1">
                      <div className="text-pink-300 font-medium">
                        {meal.fat}g
                      </div>
                      <div className="text-gray-400">脂質</div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {searchQuery.length > 0 && filteredMeals.length === 0 && (
                <div className="col-span-2 bg-white/5 rounded-xl p-6 text-center">
                  <div className="text-5xl mb-4">🍽️</div>
                  <p className="text-gray-400 mb-4">
                    "{searchQuery}" に一致する料理が見つかりません
                  </p>
                  {/* ★ カスタム料理登録のロジックも必要 */}
                  <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors">
                    新しい料理として登録
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/10 flex justify-between items-center">
          {/* ★ カスタム量指定のチェックボックスと入力欄の実装が必要 */}
          <div className="text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/30"
              />
              <span className="text-gray-300">カスタム量を指定</span>
            </label>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-sm font-medium transition-colors"
            >
              キャンセル
            </button>
            {/* ★ Add Button */}
            <button
              onClick={handleAddButtonClick}
              className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium text-blue-300 transition-colors"
            >
              追加
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
