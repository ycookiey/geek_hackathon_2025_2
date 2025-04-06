// src/app/meals/page.tsx (抜粋)

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import CalendarHeader from "./components/Calendar/CalendarHeader";
import Calendar from "./components/Calendar/Calendar";
import AddMealModal from "./components/AddMealModal/AddMealModal";
import { MealType, MealDay } from "./types";
import { getDaysInMonth, getFirstDayOfMonth } from "./utils";

export default function MealsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [expandedDate, setExpandedDate] = useState<Date | null>(null);
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [mealType, setMealType] = useState<MealType>("breakfast");

    const generateCalendarData = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

        const days: MealDay[] = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
            const day = prevMonthDays - firstDayOfMonth + i + 1;
            days.push({
                date: new Date(currentYear, currentMonth - 1, day),
                meals: [],
                currentMonth: false,
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                meals: [],
                currentMonth: true,
            });
        }

        const totalDaysAdded = firstDayOfMonth + daysInMonth;
        const neededRows = Math.ceil(totalDaysAdded / 7);
        const totalCells = neededRows * 7;

        const remainingDays = totalCells - days.length;
        for (let i = 1; i <= remainingDays; i++) {
            days.push({
                date: new Date(currentYear, currentMonth + 1, i),
                meals: [],
                currentMonth: false,
            });
        }

        const weeks: MealDay[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks;
    };

    const changeMonth = (delta: number) => {
        setExpandedDate(null);

        let newMonth = currentMonth + delta;
        let newYear = currentYear;

        if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        }

        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const goToToday = () => {
        const now = new Date();
        setCurrentMonth(now.getMonth());
        setCurrentYear(now.getFullYear());
        setExpandedDate(now);
    };

    const showAddMealModal = (date: Date, type: MealType) => {
        setSelectedDate(date);
        setMealType(type);
        setShowAddMeal(true);
    };

    const calendarData = generateCalendarData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="meals" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CalendarHeader
                    currentYear={currentYear}
                    currentMonth={currentMonth}
                    changeMonth={changeMonth}
                    goToToday={goToToday}
                />

                <Calendar
                    calendarData={calendarData}
                    expandedDate={expandedDate}
                    setExpandedDate={setExpandedDate}
                    showAddMealModal={showAddMealModal}
                />

                <AnimatePresence>
                    {showAddMeal && (
                        <AddMealModal
                            isOpen={showAddMeal}
                            onClose={() => setShowAddMeal(false)}
                            selectedDate={selectedDate}
                            mealType={mealType}
                            setMealType={setMealType}
                        />
                    )}
                </AnimatePresence>

                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        const today = new Date();
                        showAddMealModal(today, "breakfast");
                    }}
                    className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 flex items-center justify-center shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                </motion.button>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </div>
    );
}
