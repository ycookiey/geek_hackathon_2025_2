import { MealType, MealTypeInfo } from "./types";

export const getMonthName = (month: number): string => {
  const monthNames = [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ];
  return monthNames[month];
};

export const getDayName = (day: number): string => {
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
  return dayNames[day];
};

export const getDayColor = (day: number): string => {
  if (day === 0) return "text-red-400";
  if (day === 6) return "text-blue-400";
  return "text-gray-200";
};

export const getMealTypeInfo = (type: string): MealTypeInfo => {
  switch (type) {
    case "breakfast":
      return {
        label: "朝食",
        color: "bg-rose-700",
        lightColor: "bg-rose-900/30",
        textColor: "text-gray-300",
        borderColor: "border-rose-800/40",
        accentColor: "rose",
      };
    case "lunch":
      return {
        label: "昼食",
        color: "bg-teal-700",
        lightColor: "bg-teal-900/30",
        textColor: "text-gray-300",
        borderColor: "border-teal-800/40",
        accentColor: "teal",
      };
    case "dinner":
      return {
        label: "夕食",
        color: "bg-indigo-700",
        lightColor: "bg-indigo-900/30",
        textColor: "text-gray-300",
        borderColor: "border-indigo-800/40",
        accentColor: "indigo",
      };
    case "snack":
      return {
        label: "間食",
        color: "bg-amber-700",
        lightColor: "bg-amber-900/30",
        textColor: "text-gray-300",
        borderColor: "border-amber-800/40",
        accentColor: "amber",
      };
    default:
      return {
        label: "食事",
        color: "bg-gray-700",
        lightColor: "bg-gray-900/30",
        textColor: "text-gray-300",
        borderColor: "border-gray-800/40",
        accentColor: "gray",
      };
  }
};

export const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isSameDate = (date1: Date, date2: Date) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};
