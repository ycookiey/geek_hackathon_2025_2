"use client";

export interface Nutrient {
    name: string;
    current: number;
    target: number;
    unit: string;
    percentage: number;
}

interface NutrientSummaryProps {
    nutrients?: Nutrient[];
    overallPercentage?: number;
}

export default function NutrientSummary({ 
    nutrients = [],
    overallPercentage = 0
}: NutrientSummaryProps) {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    本日の栄養素
                </h3>
                <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                    {overallPercentage}% 達成
                </div>
            </div>

            {nutrients.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                    <p className="text-gray-400">栄養データがありません</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {nutrients.map((nutrient, index) => (
                        <div key={index} className="mb-4">
                            <div className="flex justify-between items-end mb-1">
                                <span className="text-sm text-gray-300">
                                    {nutrient.name}
                                </span>
                                <div className="flex items-baseline">
                                    <span className="text-2xl font-bold mr-1">
                                        {nutrient.current}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        / {nutrient.target}
                                        {nutrient.unit}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${
                                        nutrient.name === "カロリー"
                                            ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                            : nutrient.name === "タンパク質"
                                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                            : nutrient.name === "脂質"
                                            ? "bg-gradient-to-r from-yellow-500 to-amber-400"
                                            : nutrient.name === "炭水化物"
                                            ? "bg-gradient-to-r from-orange-500 to-amber-400"
                                            : nutrient.name === "糖質"
                                            ? "bg-gradient-to-r from-pink-500 to-rose-400"
                                            : nutrient.name === "食物繊維"
                                            ? "bg-gradient-to-r from-purple-500 to-indigo-400"
                                            : "bg-gradient-to-r from-red-500 to-orange-400"
                                    }`}
                                    style={{
                                        width: `${nutrient.percentage}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
