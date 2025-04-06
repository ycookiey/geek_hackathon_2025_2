"use client";

import { motion } from "framer-motion";
import { ExpiringItem } from "@/types/dashboard";
import { getCategoryColor, getCategoryIcon, getExpirationColor } from "@/state/dashboard/dashboardAdapter";
import { useDashboard } from "@/state/dashboard/dashboardContext";

interface ExpiringItemsProps {
    items?: ExpiringItem[];
}

export default function ExpiringItems({ items = [] }: ExpiringItemsProps) {
    const { fetchExpiringItems } = useDashboard();

    const handleRefresh = async () => {
        try {
            await fetchExpiringItems();
        } catch (error) {
            console.error("Failed to refresh expiring items:", error);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex-grow"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    賞味期限が近い食材
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
                        すべて見る
                    </button>
                </div>
            </div>

            {items.length === 0 ? (
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
                            d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                    </svg>
                    <p className="text-gray-400">表示する食材がありません</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className={`rounded-lg p-4 flex items-center gap-4 ${getExpirationColor(item.daysLeft)}`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryColor(item.category)}`}
                            >
                                <span className="text-xl">
                                    {getCategoryIcon(item.category)}
                                </span>
                            </div>

                            <div className="flex-grow">
                                <h4 className="font-medium mb-1">
                                    {item.name}
                                </h4>
                                <div className="flex items-center gap-2 text-xs">
                                    <span
                                        className={`${
                                            item.daysLeft <= 1
                                                ? "text-red-300"
                                                : item.daysLeft <= 3
                                                ? "text-amber-300"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        {item.daysLeft === 0 
                                            ? "今日が期限！" 
                                            : `あと${item.daysLeft}日`}
                                    </span>
                                    <span className="text-gray-400">
                                        •
                                    </span>
                                    <span className="text-gray-300">
                                        {item.location}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}
