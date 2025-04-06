"use client";

import { motion } from "framer-motion";
import { Nutrient } from "@/types/dashboard";
import { getNutrientColor } from "@/state/dashboard/dashboardAdapter";

interface NutrientSummaryProps {
    nutrients?: Nutrient[];
    overallPercentage?: number;
}

export default function NutrientSummary({ 
    nutrients = [],
    overallPercentage = 0
}: NutrientSummaryProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 h-full"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    本日の栄養素
                </h3>
                <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                    {overallPercentage}% 達成
                </div>
            </div>

            {nutrients.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10 text-gray-500 mb-4"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
                        />
                    </svg>
                    <p className="text-gray-400">栄養データがありません</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {nutrients.map((nutrient, index) => (
                        <motion.div 
                            key={nutrient.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="mb-4"
                        >
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
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${nutrient.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${getNutrientColor(nutrient.name)}`}
                                ></motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
