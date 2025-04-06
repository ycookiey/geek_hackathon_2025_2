"use client";

export default function QuickActions() {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">
                クイックアクション
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button className="flex flex-col items-center justify-center bg-blue-500/20 hover:bg-blue-500/30 transition-colors rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </div>
                    <span className="text-sm">食事を記録</span>
                </button>

                <button className="flex flex-col items-center justify-center bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm">食材を追加</span>
                </button>

                <button className="flex flex-col items-center justify-center bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm">献立を計画</span>
                </button>

                <button className="flex flex-col items-center justify-center bg-amber-500/20 hover:bg-amber-500/30 transition-colors rounded-lg p-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm">レシピ検索</span>
                </button>
            </div>
        </div>
    );
}
