"use client";

export interface ExpiringItem {
    id: string;
    name: string;
    category: string;
    expiryDate: string;
    daysLeft: number;
    location: string;
}

interface ExpiringItemsProps {
    items?: ExpiringItem[];
}

export default function ExpiringItems({ items = [] }: ExpiringItemsProps) {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 flex-grow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                    賞味期限が近い食材
                </h3>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    すべて見る
                </button>
            </div>

            {items.length === 0 ? (
                <div className="h-40 flex items-center justify-center">
                    <p className="text-gray-400">表示する食材がありません</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className={`rounded-lg p-4 flex items-center gap-4 ${
                                item.daysLeft <= 1
                                    ? "bg-red-500/20 border border-red-500/30"
                                    : item.daysLeft <= 3
                                    ? "bg-amber-500/20 border border-amber-500/30"
                                    : "bg-white/10 border border-white/10"
                            }`}
                        >
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    item.category === "野菜"
                                        ? "bg-green-500/30"
                                        : item.category === "肉類"
                                        ? "bg-red-500/30"
                                        : item.category === "乳製品"
                                        ? "bg-blue-500/30"
                                        : "bg-amber-500/30"
                                }`}
                            >
                                <span className="text-xl">
                                    {item.category === "野菜"
                                        ? "🥬"
                                        : item.category === "肉類"
                                        ? "🥩"
                                        : item.category === "乳製品"
                                        ? "🥛"
                                        : "🥚"}
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
                                        あと{item.daysLeft}日
                                    </span>
                                    <span className="text-gray-400">
                                        •
                                    </span>
                                    <span className="text-gray-300">
                                        {item.location}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
