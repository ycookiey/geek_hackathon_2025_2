import { RecipeRecommendation } from "@/types/dashboard";

/**
 * レシピ推奨のモックデータを生成
 * @param availableIngredients 使用可能な食材リスト
 * @returns レシピ推奨データ
 */
export const getRecipeMockData = (
  availableIngredients: string[] = []
): RecipeRecommendation[] => {
  // 食材がない場合は空配列を返す
  if (availableIngredients.length === 0) {
    return [];
  }

  // モックレシピデータ
  const allRecipes: RecipeRecommendation[] = [
    {
      id: "recipe-1",
      name: "トマトとモッツァレラのサラダ",
      time: "15分",
      difficulty: "簡単",
      calories: 230,
      protein: 12,
      carbs: 15,
      fat: 17,
      ingredients: [
        { id: "ing-1", name: "トマト", isExpiring: false },
        { id: "ing-2", name: "モッツァレラ", isExpiring: false },
        { id: "ing-3", name: "バジル", isExpiring: false },
        { id: "ing-4", name: "オリーブオイル", isExpiring: false }
      ],
      image: "from-green-400 to-emerald-500"
    },
    {
      id: "recipe-2",
      name: "ビーフストロガノフ",
      time: "30分",
      difficulty: "普通",
      calories: 450,
      protein: 28,
      carbs: 35,
      fat: 22,
      ingredients: [
        { id: "ing-5", name: "牛肉", isExpiring: false },
        { id: "ing-6", name: "玉ねぎ", isExpiring: false },
        { id: "ing-7", name: "マッシュルーム", isExpiring: false },
        { id: "ing-8", name: "サワークリーム", isExpiring: false }
      ],
      image: "from-red-400 to-orange-500"
    },
    {
      id: "recipe-3",
      name: "キッシュロレーヌ",
      time: "45分",
      difficulty: "普通",
      calories: 380,
      protein: 18,
      carbs: 28,
      fat: 25,
      ingredients: [
        { id: "ing-9", name: "卵", isExpiring: false },
        { id: "ing-10", name: "牛乳", isExpiring: false },
        { id: "ing-11", name: "ベーコン", isExpiring: false },
        { id: "ing-12", name: "玉ねぎ", isExpiring: false }
      ],
      image: "from-yellow-400 to-amber-500"
    },
    {
      id: "recipe-4",
      name: "鶏肉の照り焼き",
      time: "25分",
      difficulty: "簡単",
      calories: 320,
      protein: 35,
      carbs: 12,
      fat: 14,
      ingredients: [
        { id: "ing-13", name: "鶏もも肉", isExpiring: false },
        { id: "ing-14", name: "醤油", isExpiring: false },
        { id: "ing-15", name: "みりん", isExpiring: false },
        { id: "ing-16", name: "砂糖", isExpiring: false }
      ],
      image: "from-amber-400 to-yellow-500"
    },
    {
      id: "recipe-5",
      name: "ほうれん草とベーコンのパスタ",
      time: "20分",
      difficulty: "簡単",
      calories: 410,
      protein: 16,
      carbs: 48,
      fat: 19,
      ingredients: [
        { id: "ing-17", name: "パスタ", isExpiring: false },
        { id: "ing-18", name: "ほうれん草", isExpiring: false },
        { id: "ing-19", name: "ベーコン", isExpiring: false },
        { id: "ing-20", name: "ニンニク", isExpiring: false },
        { id: "ing-21", name: "オリーブオイル", isExpiring: false }
      ],
      image: "from-green-500 to-teal-500"
    },
    {
      id: "recipe-6",
      name: "野菜たっぷり味噌汁",
      time: "15分",
      difficulty: "簡単",
      calories: 120,
      protein: 8,
      carbs: 15,
      fat: 4,
      ingredients: [
        { id: "ing-22", name: "豆腐", isExpiring: false },
        { id: "ing-23", name: "わかめ", isExpiring: false },
        { id: "ing-24", name: "大根", isExpiring: false },
        { id: "ing-25", name: "にんじん", isExpiring: false },
        { id: "ing-26", name: "味噌", isExpiring: false }
      ],
      image: "from-blue-400 to-indigo-500"
    }
  ];

  // 利用可能な食材を含むレシピをフィルタリング
  const availableRecipes = allRecipes.map(recipe => {
    // レシピの食材が利用可能かどうかをチェック
    const recipeIngredients = recipe.ingredients.map(ing => {
      const isAvailable = availableIngredients.some(
        availIng => availIng.toLowerCase() === ing.name.toLowerCase()
      );
      return {
        ...ing,
        isExpiring: isAvailable // 利用可能な食材は期限切れ間近と仮定
      };
    });

    // 少なくとも1つの食材が利用可能な場合にレシピを含める
    return {
      ...recipe,
      ingredients: recipeIngredients
    };
  }).filter(recipe =>
    recipe.ingredients.some(ing => ing.isExpiring)
  );

  // レシピをランダムに並び替え、最大3つまで返す
  return shuffleArray(availableRecipes).slice(0, 3);
};

// 配列をランダムにシャッフルするヘルパー関数
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
