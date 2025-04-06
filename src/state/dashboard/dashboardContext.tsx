"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";
import {
    getNutrientSummaryForDashboard,
    getExpiringItemsForDashboard,
    getRecipeRecommendationsForDashboard,
    getMealPlanForDashboard,
    getDashboardData
} from "@/services/dashboardService";
import { adaptDashboardDataForUi } from "./dashboardAdapter";
import {
    NutrientSummary,
    ExpiringItem,
    RecipeRecommendation,
    MealPlanDay
} from "@/types/dashboard";

interface DashboardContextType {
    // データ
    nutrients: NutrientSummary | null;
    expiringItems: ExpiringItem[];
    recipes: RecipeRecommendation[];
    todayMealPlan: MealPlanDay | null;
    tomorrowMealPlan: MealPlanDay | null;

    // UI状態
    isLoading: boolean;
    error: Error | null;
    mealTab: string;

    // アクション
    setMealTab: (tab: string) => void;
    refreshDashboard: () => Promise<void>;
    fetchNutrients: (date?: Date) => Promise<void>;
    fetchExpiringItems: () => Promise<void>;
    fetchRecipes: (useExpiringOnly?: boolean) => Promise<void>;
    fetchMealPlan: (date?: Date) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
};

interface DashboardProviderProps {
    children: ReactNode;
}

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
    // データ状態
    const [nutrients, setNutrients] = useState<NutrientSummary | null>(null);
    const [expiringItems, setExpiringItems] = useState<ExpiringItem[]>([]);
    const [recipes, setRecipes] = useState<RecipeRecommendation[]>([]);
    const [todayMealPlan, setTodayMealPlan] = useState<MealPlanDay | null>(null);
    const [tomorrowMealPlan, setTomorrowMealPlan] = useState<MealPlanDay | null>(null);

    // UI状態
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [mealTab, setMealTab] = useState<string>("today");

    // ダッシュボードデータを一括取得
    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getDashboardData();

            // 各状態を更新
            setNutrients(data.nutrients);
            setExpiringItems(data.expiringItems);
            setRecipes(data.recipeRecommendations);
            setTodayMealPlan(data.todayMealPlan);
            setTomorrowMealPlan(data.tomorrowMealPlan);

        } catch (err) {
            console.error("Failed to fetch dashboard data:", err);
            setError(err instanceof Error ? err : new Error("Failed to fetch dashboard data"));
        } finally {
            setIsLoading(false);
        }
    };

    // 各データを個別に取得するメソッド
    const fetchNutrients = async (date?: Date) => {
        try {
            const data = await getNutrientSummaryForDashboard(date);
            setNutrients(data);
            // return data; // ここでreturnするとPromise<void>に合わないためコメントアウト
        } catch (err) {
            console.error("Failed to fetch nutrients data:", err);
            throw err; // エラーは再スロー
        }
    };

    const fetchExpiringItems = async () => {
        try {
            const data = await getExpiringItemsForDashboard();
            setExpiringItems(data);
            // return data; // Promise<void>
        } catch (err) {
            console.error("Failed to fetch expiring items:", err);
            throw err;
        }
    };

    const fetchRecipes = async (useExpiringOnly?: boolean) => {
        try {
            const data = await getRecipeRecommendationsForDashboard(useExpiringOnly);
            setRecipes(data);
            // return data; // Promise<void>
        } catch (err) {
            console.error("Failed to fetch recipe recommendations:", err);
            throw err;
        }
    };

    const fetchMealPlan = async (date?: Date) => {
        try {
            const data = await getMealPlanForDashboard(date);

            // 日付によってどちらの状態を更新するか判断
            const today = new Date();
            const dateStr = date ? date.toISOString().split('T')[0] : today.toISOString().split('T')[0];
            const todayStr = today.toISOString().split('T')[0];

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];

            if (dateStr === todayStr) {
                setTodayMealPlan(data);
            } else if (dateStr === tomorrowStr) {
                setTomorrowMealPlan(data);
            }

            // return data; // Promise<void>
        } catch (err) {
            console.error("Failed to fetch meal plan:", err);
            throw err;
        }
    };

    // ダッシュボードデータをリフレッシュ
    const refreshDashboard = async () => {
        await fetchDashboardData();
    };

    // 初回ロード時にデータを取得
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const value = {
        // データ
        nutrients,
        expiringItems,
        recipes,
        todayMealPlan,
        tomorrowMealPlan,

        // UI状態
        isLoading,
        error,
        mealTab,

        // アクション
        setMealTab,
        refreshDashboard,
        fetchNutrients,
        fetchExpiringItems,
        fetchRecipes,
        fetchMealPlan
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};
