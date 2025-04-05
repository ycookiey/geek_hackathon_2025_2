export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  time: string;
  calories: number;
}

export interface MealDay {
  date: Date;
  meals: Meal[];
  currentMonth: boolean;
}

export interface MealTypeInfo {
  label: string;
  color: string;
  lightColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
}

export interface MealItem {
  id: number;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
