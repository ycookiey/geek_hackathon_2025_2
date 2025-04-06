"use client";

export interface MealItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    image: string;
}

export interface MealPlan {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
}

interface MealPlannerProps {
    mealTab: string;
    setMealTab: (tab: string) => void;
    meals?: MealPlan;
}

export default function MealPlanner({ 
    mealTab, 
    setMealTab,
    meals = { breakfast: [], lunch: [], dinner: [] }
}: MealPlannerProps) {
    return (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">本日の食事予定</h3>
                <div className="flex bg-gray-800 rounded-full p-1">
                    <button
                        className={`text-sm px-4 py-1.5 rounded-full ${
                            mealTab === "today"
                                ? "bg-blue-500 text-white"
                                : "text-gray-300"
                        }`}
                        onClick={() => setMealTab("today")}
                    >
                        今日
                    </button>
                    <button
                        className={`text-sm px-4 py-1.5 rounded-full ${
                            mealTab === "tomorrow"
                                ? "bg-blue-500 text-white"
                                : "text-gray-300"
                        }`}
                        onClick={() => setMealTab("tomorrow")}
                    >
                        明日
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 px-6 py-3 border-b border-white/10">
                        <h4 className="font-medium">朝食</h4>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <div className="flex-grow min-h-32">
                            {meals.breakfast.length > 0 ? (
                                meals.breakfast.map((meal) => (
                                    <div
                                        key={meal.id}
                                        className="flex items-center gap-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${meal.image} flex-shrink-0`}
                                        ></div>
                                        <div className="flex-grow">
                                            <h5 className="font-medium">
                                                {meal.name}
                                            </h5>
                                            <div className="flex gap-3 text-xs text-gray-300">
                                                <span>
                                                    {meal.calories} kcal
                                                </span>
                                                <span>
                                                    タンパク質{" "}
                                                    {meal.protein}g
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-32 flex items-center justify-center">
                                    <p className="text-gray-400">食事が登録されていません</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                            + 追加
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 px-6 py-3 border-b border-white/10">
                        <h4 className="font-medium">昼食</h4>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <div className="flex-grow min-h-32">
                            {meals.lunch.length > 0 ? (
                                meals.lunch.map((meal) => (
                                    <div
                                        key={meal.id}
                                        className="flex items-center gap-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${meal.image} flex-shrink-0`}
                                        ></div>
                                        <div className="flex-grow">
                                            <h5 className="font-medium">
                                                {meal.name}
                                            </h5>
                                            <div className="flex gap-3 text-xs text-gray-300">
                                                <span>
                                                    {meal.calories} kcal
                                                </span>
                                                <span>
                                                    タンパク質{" "}
                                                    {meal.protein}g
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-32 flex items-center justify-center">
                                    <p className="text-gray-400">食事が登録されていません</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                            + 追加
                        </button>
                    </div>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-3 border-b border-white/10">
                        <h4 className="font-medium">夕食</h4>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                        <div className="flex-grow min-h-32">
                            {meals.dinner.length > 0 ? (
                                meals.dinner.map((meal) => (
                                    <div
                                        key={meal.id}
                                        className="flex items-center gap-3 mb-3 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                    >
                                        <div
                                            className={`w-10 h-10 rounded-full bg-gradient-to-r ${meal.image} flex-shrink-0`}
                                        ></div>
                                        <div className="flex-grow">
                                            <h5 className="font-medium">
                                                {meal.name}
                                            </h5>
                                            <div className="flex gap-3 text-xs text-gray-300">
                                                <span>
                                                    {meal.calories} kcal
                                                </span>
                                                <span>
                                                    タンパク質{" "}
                                                    {meal.protein}g
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-32 flex items-center justify-center">
                                    <p className="text-gray-400">食事が登録されていません</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-2 py-2 rounded-lg border border-dashed border-white/20 text-sm text-gray-300 hover:bg-white/5 transition-colors">
                            + 追加
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
