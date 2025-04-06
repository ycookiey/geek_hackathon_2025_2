"use client";

import { motion } from "framer-motion";
import { RecipeRecommendation } from "@/types/dashboard";
import { useDashboard } from "@/state/dashboard/dashboardContext";
import { getDifficultyColor } from "@/state/dashboard/dashboardAdapter";

interface RecipeRecommendationsProps {
    recipes?: RecipeRecommendation[];
}

export default function RecipeRecommendations({ recipes = [] }: RecipeRecommendationsProps) {
    const { fetchRecipes } = useDashboard();
    
    const handleRefresh = async () => {
        try {
            await fetchRecipes(true, 3);
        } catch (error) {
            console.error("Failed to refresh recipes:", error);
        }
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                    期限の近い食材を使ったレシピ提案
                </h3>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleRefresh}
                        className="text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                        </svg>
                        更新
                    </button>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                        もっと見る
                    </button>
                </div>
            </div>

            {recipes.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center"
                >
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🍲</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">レシピがありません</h3>
                    <p className="text-gray-400 mb-4">賞味期限が近い食材がないか、レシピの提案に必要な食材が足りません</p>
                    <button 
                        onClick={handleRefresh}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-sm font-medium transition-colors"
                    >
                        手持ちの食材でレシピを探す
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recipes.map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all hover:shadow-lg flex flex-col border border-white/10"
                        >
                            <div
                                className={`h-36 bg-gradient-to-r ${recipe.image} relative`}
                            >
                                <div className="absolute inset-0 bg-black/20"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h4 className="text-lg font-bold">
                                        {recipe.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs">
                                        <span className="px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full">
                                            {recipe.time}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full ${getDifficultyColor(recipe.difficulty)}`}>
                                            難易度：{recipe.difficulty}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 flex-grow flex flex-col">
                                <div className="mb-3 flex-grow">
                                    <h5 className="text-sm text-gray-300 mb-2">
                                        使用する食材
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.ingredients
                                            .slice(0, 5)
                                            .map((ing, i) => (
                                                <span
                                                    key={i}
                                                    className={`px-2 py-1 rounded-full text-xs ${
                                                        ing.isExpiring
                                                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                                            : "bg-gray-700/50 text-gray-300"
                                                    }`}
                                                >
                                                    {ing.name}
                                                </span>
                                            ))}
                                        {recipe.ingredients.length > 5 && (
                                            <span className="px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-300">
                                                +
                                                {recipe.ingredients.length -
                                                    5}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                                    <div className="bg-white/10 rounded-lg p-1">
                                        <div className="text-blue-300 font-medium">
                                            {recipe.protein}g
                                        </div>
                                        <div className="text-gray-400">タンパク質</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-1">
                                        <div className="text-amber-300 font-medium">
                                            {recipe.carbs}g
                                        </div>
                                        <div className="text-gray-400">炭水化物</div>
                                    </div>
                                    <div className="bg-white/10 rounded-lg p-1">
                                        <div className="text-pink-300 font-medium">
                                            {recipe.fat}g
                                        </div>
                                        <div className="text-gray-400">脂質</div>
                                    </div>
                                </div>

                                <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors mt-auto">
                                    レシピを見る
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
