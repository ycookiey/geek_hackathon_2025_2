export interface Nutrient {
    id: string;
    name: string;
    current: number;
    target: number;
    unit: string;
    percentage: number;
}

export interface NutrientSummary {
    date: string;
    overallPercentage: number;
    nutrients: Nutrient[];
}

export interface ExpiringItem {
    id: string;
    name: string;
    category: string;
    expiryDate: string;
    daysLeft: number;
    location: string;
    imageUrl?: string;
}

export interface MealItem {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    image: string;
}

export interface MealPlanDay {
    date: string;
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snack: MealItem[];
}

export interface RecipeIngredient {
    id: string;
    name: string;
    isExpiring: boolean;
    quantity?: string;
}

export interface RecipeRecommendation {
    id: string;
    name: string;
    time: string;
    difficulty: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    ingredients: RecipeIngredient[];
    image: string;
}
