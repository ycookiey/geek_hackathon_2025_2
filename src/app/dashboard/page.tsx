"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import QuickActions from "./components/QuickActions";
import ExpiringItems from "./components/ExpiringItems";
import NutrientSummary from "./components/NutrientSummary";
import MealPlanner from "./components/MealPlanner";
import RecipeRecommendations from "./components/RecipeRecommendations";
import LoadingState from "../inventory/components/LoadingState";
import ErrorState from "../inventory/components/ErrorState";
import {
    DashboardProvider,
    useDashboard,
} from "@/state/dashboard/dashboardContext";
import { WidgetProvider } from "@/components/widgets/WidgetManager";

function DashboardContent() {
    const {
        nutrients,
        expiringItems,
        recipes,
        todayMealPlan,
        tomorrowMealPlan,
        isLoading,
        error,
        mealTab,
        setMealTab,
        refreshDashboard,
    } = useDashboard();

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={refreshDashboard} />;
    }

    const activeMealPlan =
        mealTab === "today" ? todayMealPlan : tomorrowMealPlan;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="dashboard" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 flex flex-col">
                        <QuickActions />
                        <ExpiringItems items={expiringItems} />
                    </div>

                    <div className="lg:col-span-1">
                        <NutrientSummary
                            nutrients={nutrients?.nutrients || []}
                            overallPercentage={
                                nutrients?.overallPercentage || 0
                            }
                        />
                    </div>
                </div>

                <MealPlanner
                    mealTab={mealTab}
                    setMealTab={setMealTab}
                    meals={activeMealPlan || undefined}
                />

                <RecipeRecommendations recipes={recipes} />
            </main>
        </div>
    );
}

export default function Dashboard() {
    return (
        <WidgetProvider>
            <DashboardProvider>
                <DashboardContent />
            </DashboardProvider>
        </WidgetProvider>
    );
}
