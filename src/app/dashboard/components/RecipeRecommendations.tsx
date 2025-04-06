"use client";

export interface RecipeIngredient {
    name: string;
    isExpiring: boolean;
}

export interface Recipe {
    id: string;
    name: string;
    time: string;
    difficulty: string;
    ingredients: RecipeIngredient[];
    image: string;
}

interface RecipeRecommendationsProps {
    recipes?: Recipe[];
}

export default function RecipeRecommendations({ recipes = [] }: RecipeRecommendationsProps) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">
                    期限の近い食材を使ったレシピ提案
                </h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    もっと見る
                </button>
            </div>

            {recipes.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🍲</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2">レシピがありません</h3>
                    <p className="text-gray-400 mb-4">賞味期限が近い食材がないか、レシピの提案に必要な食材が足りません</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/10 transition-all transform hover:-translate-y-1 hover:shadow-lg flex flex-col"
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
                                        <span className="px-2 py-0.5 bg-black/30 backdrop-blur-sm rounded-full">
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

                                <button className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors mt-auto">
                                    レシピを見る
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
