import { fetchApi } from "../lib/api";
import { FoodCategoryResponse } from "../types/api";

/**
 * 食品名からカテゴリを取得する
 * @param foodName 食品名
 * @returns カテゴリ情報を含むレスポンス
 */
export const getFoodCategory = async (
    foodName: string
): Promise<FoodCategoryResponse> => {
    return fetchApi<FoodCategoryResponse>("/food-category", "GET", undefined, {
        foodName,
    });
};
