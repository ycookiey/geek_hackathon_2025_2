"use client";

import { useState } from "react";
import Header from "@/components/Header";
import QuickActions from "./components/QuickActions";
import ExpiringItems from "./components/ExpiringItems";
import NutrientSummary from "./components/NutrientSummary";
import MealPlanner from "./components/MealPlanner";
import RecipeRecommendations from "./components/RecipeRecommendations";

export default function Dashboard() {
    const [mealTab, setMealTab] = useState("today");

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="dashboard" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 flex flex-col">
                        <QuickActions />
                        <ExpiringItems />
                    </div>

                    <div className="lg:col-span-1">
                        <NutrientSummary />
                    </div>
                </div>

                <MealPlanner
                    mealTab={mealTab}
                    setMealTab={setMealTab}
                />

                <RecipeRecommendations />
            </main>
        </div>
    );
}
