import { getInventoryItems } from "./inventoryService";
import { getMealRecordsForDate, getMealRecordsForDateRange } from "./mealService";
import { getPurchaseRecords } from "./purchaseService";
import { NutrientSummary, ExpiringItem, RecipeRecommendation, MealPlanDay } from "../types/dashboard";
import { InventoryItem, MealRecord } from "../types/api";
import { formatDateToIso } from "@/lib/api";
import { getRecipeMockData } from "@/mocks/recipeMockData";
import { getNutrientsMockData } from "@/mocks/nutrientsMockData";

/**
 * ダッシュボード用に賞味期限が近い食材を取得・整形する
 * @returns 賞味期限の近い食材リスト
 */
export const getExpiringItemsForDashboard = async (): Promise<ExpiringItem[]> => {
    try {
        // 在庫アイテムを取得
        const inventoryItems = await getInventoryItems();

        // 期限切れが近い順にソート (ここでは仮に期限日を計算)
        const today = new Date();

        const expiringItems: ExpiringItem[] = inventoryItems
            .map(item => {
                // モック用に期限を計算 (実際のAPIでは不要かもしれません)
                const createdDate = new Date(item.createdAt);
                const expiryDate = new Date(createdDate);
                expiryDate.setDate(createdDate.getDate() + 10); // 仮に10日後を期限に設定

                const daysLeft = Math.max(0, Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

                return {
                    id: item.itemId,
                    name: item.name,
                    category: item.category,
                    expiryDate: expiryDate.toISOString().split('T')[0],
                    daysLeft: daysLeft,
                    location: item.storageLocation || "冷蔵"
                };
            })
            .filter(item => item.daysLeft <= 7) // 7日以内の期限切れのみ表示
            .sort((a, b) => a.daysLeft - b.daysLeft);

        return expiringItems.slice(0, 6); // 最大6件まで返す
    } catch (error) {
        console.error("Failed to get expiring items:", error);
        return [];
    }
};

/**
 * 栄養素サマリーを取得 (現状はAPIがないのでモックデータを返す)
 * @param date 対象日
 * @returns 栄養素サマリー情報
 */
export const getNutrientSummaryForDashboard = async (
    date?: Date
): Promise<NutrientSummary> => {
    try {
        const targetDate = date || new Date();
        const dateStr = formatDateToIso(targetDate);

        // 指定日の食事記録を取得
        const mealRecords = await getMealRecordsForDate(targetDate);

        // 実際の実装では食事記録から栄養素を計算する
        // 現状はモックデータを返す
        return getNutrientsMockData(dateStr, mealRecords);
    } catch (error) {
        console.error("Failed to get nutrient summary:", error);
        // エラー時はデフォルトのモックデータを返す
        return getNutrientsMockData();
    }
};

/**
 * レシピ推奨を取得 (現状はAPIがないのでモックデータを返す)
 * @param useExpiringOnly 期限切れが近い食材のみを使用するか
 * @returns おすすめレシピリスト
 */
export const getRecipeRecommendationsForDashboard = async (
    useExpiringOnly: boolean = true
): Promise<RecipeRecommendation[]> => {
    try {
        // 在庫アイテムを取得
        const inventoryItems = await getInventoryItems();

        // 期限切れが近いアイテムを抽出
        const today = new Date();
        const expiringItemNames = inventoryItems
            .map(item => {
                const createdDate = new Date(item.createdAt);
                const expiryDate = new Date(createdDate);
                expiryDate.setDate(createdDate.getDate() + 10);

                const daysLeft = Math.max(0, Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

                return {
                    name: item.name,
                    daysLeft: daysLeft,
                    isExpiring: daysLeft <= 3
                };
            })
            .filter(item => !useExpiringOnly || item.isExpiring)
            .map(item => item.name);

        // モックデータを返す (実際のAPIが実装されるまでの暫定対応)
        return getRecipeMockData(expiringItemNames);
    } catch (error) {
        console.error("Failed to get recipe recommendations:", error);
        return [];
    }
};

/**
 * 特定日の食事予定を取得 (現状はAPIがないのでモックデータを返す)
 * @param date 対象日
 * @returns 食事予定情報
 */
export const getMealPlanForDashboard = async (
    date?: Date
): Promise<MealPlanDay> => {
    try {
        const targetDate = date || new Date();
        const dateStr = formatDateToIso(targetDate);

        // 指定日の食事記録を取得して食事予定として使用
        const mealRecords = await getMealRecordsForDate(targetDate);

        // 食事記録をダッシュボード表示用に変換
        const meals: MealPlanDay = {
            date: dateStr,
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        };

        // 食事タイプごとに振り分け
        mealRecords.forEach(record => {
            const mealItems = record.items.map(item => ({
                id: `${record.recordId}-${item.name}`,
                name: item.name,
                calories: Math.floor(Math.random() * 300) + 100, // 仮の値
                protein: Math.floor(Math.random() * 20) + 5, // 仮の値
                carbs: Math.floor(Math.random() * 30) + 10, // 仮の値
                fat: Math.floor(Math.random() * 15) + 3, // 仮の値
                image: getRandomGradient() // 仮のグラデーション画像
            }));

            // mealTypeに応じて振り分け
            switch (record.mealType.toLowerCase()) {
                case "breakfast":
                case "朝食":
                    meals.breakfast.push(...mealItems);
                    break;
                case "lunch":
                case "昼食":
                    meals.lunch.push(...mealItems);
                    break;
                case "dinner":
                case "夕食":
                    meals.dinner.push(...mealItems);
                    break;
                default:
                    meals.snack.push(...mealItems);
                    break;
            }
        });

        return meals;
    } catch (error) {
        console.error("Failed to get meal plan:", error);
        return {
            date: dateStr,
            breakfast: [],
            lunch: [],
            dinner: [],
            snack: []
        };
    }
};

/**
 * ダッシュボード全体のデータを一括取得
 * @returns ダッシュボードに必要なすべてのデータ
 */
export const getDashboardData = async (): Promise<{
    nutrients: NutrientSummary;
    expiringItems: ExpiringItem[];
    recipeRecommendations: RecipeRecommendation[];
    todayMealPlan: MealPlanDay;
    tomorrowMealPlan: MealPlanDay;
}> => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // 並行してAPIリクエストを実行
    const [nutrients, expiringItems, recipeRecommendations, todayMealPlan, tomorrowMealPlan] =
        await Promise.all([
            getNutrientSummaryForDashboard(today),
            getExpiringItemsForDashboard(),
            getRecipeRecommendationsForDashboard(),
            getMealPlanForDashboard(today),
            getMealPlanForDashboard(tomorrow)
        ]);

    return {
        nutrients,
        expiringItems,
        recipeRecommendations,
        todayMealPlan,
        tomorrowMealPlan
    };
};

// ヘルパー関数: ランダムなグラデーションを生成
function getRandomGradient(): string {
    const gradients = [
        "from-blue-500 to-cyan-500",
        "from-purple-500 to-pink-500",
        "from-green-500 to-emerald-500",
        "from-amber-500 to-orange-500",
        "from-red-500 to-pink-500",
        "from-indigo-500 to-purple-500"
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
}
