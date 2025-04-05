"use client";

import { motion } from "framer-motion";

interface ErrorStateProps {
  error: Error;
  onRetry: () => Promise<void>;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 backdrop-blur-sm rounded-xl p-8 max-w-md text-center"
      >
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">エラーが発生しました</h2>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full text-sm font-medium text-white transition-transform hover:scale-105"
        >
          再試行する
        </button>
      </motion.div>
    </div>
  );
}
