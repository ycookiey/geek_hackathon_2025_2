import { NutrientSummary } from "@/types/dashboard";
import { MealRecord } from "@/types/api";

/**
 * 栄養素のモックデータを生成
 * @param date 日付文字列
 * @param mealRecords 食事記録データ（実際のデータがある場合）
 * @returns 栄養素サマリーデータ
 */
export const getNutrientsMockData = (
  date?: string,
  mealRecords?: MealRecord[]
): NutrientSummary => {
  // 食事記録データがある場合は、それに基づいて栄養素データを生成
  // このサンプルではシンプルに固定モックデータを返す

  // 食事記録の数に応じて達成率を調整（シンプルな例）
  const mealCount = mealRecords?.length || 0;
  const achievementMultiplier = Math.min(1, mealCount * 0.3 + 0.2); // 食事数 * 0.3 + 0.2 を最大1まで

  return {
    date: date || new Date().toISOString().split('T')[0],
    overallPercentage: Math.floor(78 * achievementMultiplier), // 0〜78%
    nutrients: [
      {
        id: "calories",
        name: "カロリー",
        current: Math.floor(1800 * achievementMultiplier),
        target: 2200,
        unit: "kcal",
        percentage: Math.floor(82 * achievementMultiplier)
      },
      {
        id: "protein",
        name: "タンパク質",
        current: Math.floor(65 * achievementMultiplier),
        target: 80,
        unit: "g",
        percentage: Math.floor(81 * achievementMultiplier)
      },
      {
        id: "fat",
        name: "脂質",
        current: Math.floor(45 * achievementMultiplier),
        target: 73,
        unit: "g",
        percentage: Math.floor(62 * achievementMultiplier)
      },
      {
        id: "carbs",
        name: "炭水化物",
        current: Math.floor(220 * achievementMultiplier),
        target: 275,
        unit: "g",
        percentage: Math.floor(80 * achievementMultiplier)
      },
      {
        id: "fiber",
        name: "食物繊維",
        current: Math.floor(12 * achievementMultiplier),
        target: 20,
        unit: "g",
        percentage: Math.floor(60 * achievementMultiplier)
      }
    ]
  };
};
