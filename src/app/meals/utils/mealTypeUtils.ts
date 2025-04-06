export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface MealTypeInfo {
    label: string;
    color: string;
    lightColor: string;
    textColor: string;
    borderColor: string;
    accentColor: string;
}

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
