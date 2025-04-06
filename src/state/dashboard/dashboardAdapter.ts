import {
    NutrientSummary,
    ExpiringItem,
    RecipeRecommendation,
    MealPlanDay
} from "../../types/dashboard";
import { InventoryItem, MealRecord } from "../../types/api";

// 賞味期限の色を取得
export const getExpirationColor = (daysLeft: number): string => {
    if (daysLeft <= 1) {
        return "bg-red-500/20 border-red-500/30";
    } else if (daysLeft <= 3) {
        return "bg-amber-500/20 border-amber-500/30";
    } else {
        return "bg-white/10 border-white/10";
    }
};

// カテゴリに基づいたアイコン色を取得
export const getCategoryColor = (category: string): string => {
    switch (category) {
        case "野菜":
            return "bg-green-500/30";
        case "果物":
            return "bg-red-500/30";
        case "肉類":
            return "bg-rose-500/30";
        case "魚介類":
            return "bg-blue-500/30";
        case "乳製品":
            return "bg-cyan-500/30";
        case "穀物":
            return "bg-amber-500/30";
        case "調味料":
            return "bg-purple-500/30";
        default:
            return "bg-gray-500/30";
    }
};

// カテゴリに基づいたアイコンを取得
export const getCategoryIcon = (category: string): string => {
    switch (category) {
        case "野菜":
            return "🥬";
        case "果物":
            return "🍎";
        case "肉類":
            return "🥩";
        case "魚介類":
            return "🐟";
        case "乳製品":
            return "🥛";
        case "穀物":
            return "🌾";
        case "調味料":
            return "🧂";
        default:
            return "📦";
    }
};

// レシピ難易度に基づいた背景色を取得
export const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
        case "easy":
        case "簡単":
            return "bg-green-500/20 text-green-300";
        case "medium":
        case "普通":
            return "bg-amber-500/20 text-amber-300";
        case "hard":
        case "難しい":
            return "bg-red-500/20 text-red-300";
        default:
            return "bg-gray-500/20 text-gray-300";
    }
};

// 栄養素に基づいた色を取得
export const getNutrientColor = (nutrientName: string): string => {
    switch (nutrientName.toLowerCase()) {
        case "カロリー":
        case "calories":
            return "from-blue-500 to-cyan-400";
        case "タンパク質":
        case "protein":
            return "from-green-500 to-emerald-400";
        case "脂質":
        case "fat":
            return "from-yellow-500 to-amber-400";
        case "炭水化物":
        case "carbs":
            return "from-orange-500 to-amber-400";
        case "糖質":
        case "sugar":
            return "from-pink-500 to-rose-400";
        case "食物繊維":
        case "fiber":
            return "from-purple-500 to-indigo-400";
        default:
            return "from-gray-500 to-gray-400";
    }
};

// 在庫アイテムをダッシュボード用の期限切れアイテムに変換
export const mapInventoryToExpiringItems = (inventoryItems: InventoryItem[]): ExpiringItem[] => {
    const today = new Date();

    return inventoryItems
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
};

// 食事記録をミールプランに変換
export const mapMealRecordsToMealPlan = (
    mealRecords: MealRecord[],
    dateStr: string
): MealPlanDay => {
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
};

// ランダムなグラデーションを生成
export const getRandomGradient = (): string => {
    const gradients = [
        "from-blue-500 to-cyan-500",
        "from-purple-500 to-pink-500",
        "from-green-500 to-emerald-500",
        "from-amber-500 to-orange-500",
        "from-red-500 to-pink-500",
        "from-indigo-500 to-purple-500"
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
};
