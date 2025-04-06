"use client";

import { motion } from "framer-motion";
import React from "react";

export interface LoadingStateProps {
    message?: string;
    description?: string;
    size?: "small" | "medium" | "large";
    fullHeight?: boolean;
    type?: "spin" | "pulse" | "dots";
    className?: string;
}

export default function LoadingState({
    message = "データを読み込み中...",
    description = "しばらくお待ちください",
    size = "medium",
    fullHeight = true,
    type = "dots",
    className = "",
}: LoadingStateProps) {
    const sizeClasses = {
        small: "w-8 h-8",
        medium: "w-12 h-12",
        large: "w-16 h-16",
    };

    const renderLoadingIndicator = () => {
        switch (type) {
            case "dots":
                return (
                    <div className="flex space-x-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.8, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    duration: 0.5,
                                    delay: i * 0.15,
                                }}
                                className={`rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md ${
                                    size === "small"
                                        ? "w-2 h-2"
                                        : size === "medium"
                                        ? "w-3 h-3"
                                        : "w-4 h-4"
                                }`}
                            />
                        ))}
                    </div>
                );

            case "pulse":
                return (
                    <div className="relative">
                        <motion.div
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0.2, 0.5],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut",
                            }}
                            className={`absolute inset-0 rounded-full bg-blue-500/30 blur-md ${sizeClasses[size]}`}
                        />
                        <div
                            className={`rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 relative ${sizeClasses[size]} flex items-center justify-center`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-1/2 h-1/2 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                            </svg>
                        </div>
                    </div>
                );

            case "spin":
            default:
                return (
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                            }}
                            className={sizeClasses[size]}
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-500 opacity-20 blur-md" />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className={`${sizeClasses[size]} text-blue-500`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                            </svg>
                        </motion.div>
                    </div>
                );
        }
    };

    return (
        <div
            className={`flex flex-col items-center justify-center ${
                fullHeight ? "h-[60vh]" : "py-12"
            } ${className}`}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                {renderLoadingIndicator()}
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
                {message}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-gray-400"
            >
                {description}
            </motion.p>
        </div>
    );
}
