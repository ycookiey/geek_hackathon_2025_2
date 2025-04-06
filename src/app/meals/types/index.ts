import { MealType } from "../utils/mealTypeUtils";

export interface MealRecord {
  id: string;
  type: MealType;
  name: string;
  time: string;
  calories: number;
}

export interface DayInfo {
  date: Date;
  meals: MealRecord[];
  currentMonth: boolean;
}
