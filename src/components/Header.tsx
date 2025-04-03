"use client";

import Link from "next/link";
import React from "react";

export type HeaderProps = {
    activeItem?:
        | "dashboard"
        | "refrigerator"
        | "meals"
        | "recipes"
        | "analysis";
    userName?: string;
    userInitials?: string;
};

const Header: React.FC<HeaderProps> = ({
    activeItem = "dashboard",
    userName = "山田太郎",
    userInitials = "YT",
}) => {
    return (
        <header className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/">
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                MealCopilot
                            </h1>
                        </Link>
                    </div>

                    <nav className="hidden md:block">
                        <ul className="flex space-x-8">
                            <li
                                className={
                                    activeItem === "dashboard" ? "relative" : ""
                                }
                            >
                                <Link
                                    href="/dashboard"
                                    className={
                                        activeItem === "dashboard"
                                            ? "text-white font-medium"
                                            : "text-gray-300 hover:text-white transition-colors"
                                    }
                                >
                                    ダッシュボード
                                    {activeItem === "dashboard" && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                                    )}
                                </Link>
                            </li>
                            <li
                                className={
                                    activeItem === "refrigerator"
                                        ? "relative"
                                        : ""
                                }
                            >
                                <Link
                                    href="/refrigerator"
                                    className={
                                        activeItem === "refrigerator"
                                            ? "text-white font-medium"
                                            : "text-gray-300 hover:text-white transition-colors"
                                    }
                                >
                                    冷蔵庫
                                    {activeItem === "refrigerator" && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                                    )}
                                </Link>
                            </li>
                            <li
                                className={
                                    activeItem === "meals" ? "relative" : ""
                                }
                            >
                                <Link
                                    href="/meals"
                                    className={
                                        activeItem === "meals"
                                            ? "text-white font-medium"
                                            : "text-gray-300 hover:text-white transition-colors"
                                    }
                                >
                                    食事記録
                                    {activeItem === "meals" && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                                    )}
                                </Link>
                            </li>
                            <li
                                className={
                                    activeItem === "recipes" ? "relative" : ""
                                }
                            >
                                <Link
                                    href="/recipes"
                                    className={
                                        activeItem === "recipes"
                                            ? "text-white font-medium"
                                            : "text-gray-300 hover:text-white transition-colors"
                                    }
                                >
                                    レシピ
                                    {activeItem === "recipes" && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                                    )}
                                </Link>
                            </li>
                            <li
                                className={
                                    activeItem === "analysis" ? "relative" : ""
                                }
                            >
                                <Link
                                    href="/analysis"
                                    className={
                                        activeItem === "analysis"
                                            ? "text-white font-medium"
                                            : "text-gray-300 hover:text-white transition-colors"
                                    }
                                >
                                    分析
                                    {activeItem === "analysis" && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500"></span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button className="p-1 rounded-full text-gray-300 hover:text-white">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                                />
                            </svg>
                        </button>
                        <div className="relative">
                            <button className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                                    <span className="font-medium text-sm">
                                        {userInitials}
                                    </span>
                                </div>
                                <span className="hidden md:block text-sm">
                                    {userName}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
