"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import AddMealModal from "./components/AddMealModal";
import { MealType, getMealTypeInfo } from "./utils/mealTypeUtils";
import {
    isToday,
    isSameDate,
    getDaysInMonth,
    getFirstDayOfMonth,
    getMonthName,
    getDayName,
    getDayColor,
} from "./utils/dateUtils";
import { DayInfo, MealRecord } from "./types";

export default function MealsPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [expandedDate, setExpandedDate] = useState<Date | null>(null);
    const [showAddMeal, setShowAddMeal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [mealType, setMealType] = useState<MealType>("breakfast");
    const [meals, setMeals] = useState<MealRecord[]>([]);

    const generateCalendarData = () => {
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

        const days: DayInfo[] = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            const prevMonthDays = getDaysInMonth(currentYear, currentMonth - 1);
            const day = prevMonthDays - firstDayOfMonth + i + 1;
            days.push({
                date: new Date(currentYear, currentMonth - 1, day),
                meals: getMealsForDate(
                    new Date(currentYear, currentMonth - 1, day)
                ),
                currentMonth: false,
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentYear, currentMonth, i),
                meals: getMealsForDate(new Date(currentYear, currentMonth, i)),
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
                meals: getMealsForDate(
                    new Date(currentYear, currentMonth + 1, i)
                ),
                currentMonth: false,
            });
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        return weeks;
    };

    const getMealsForDate = (date: Date): MealRecord[] => {
        return meals.filter((meal) => {
            const mealDate = new Date(meal.id.split("-")[0]);
            return isSameDate(mealDate, date);
        });
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

    const handleAddMeal = (mealId: number, date: Date, type: MealType) => {
        const mealOptions = [
            { name: "全粒粉トースト", time: "7:30", calories: 180 },
            { name: "グラノーラ＆ヨーグルト", time: "8:00", calories: 320 },
            { name: "オートミール", time: "7:15", calories: 230 },
            { name: "サラダチキン", time: "12:00", calories: 180 },
            { name: "玄米ごはん", time: "13:00", calories: 220 },
        ];

        const newMeal: MealRecord = {
            id: `${date.toISOString()}-${type}-${Date.now()}`,
            type: type,
            ...mealOptions[mealId % mealOptions.length],
        };

        setMeals((prevMeals) => [...prevMeals, newMeal]);
    };

    const calendarData = generateCalendarData();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white font-[family-name:var(--font-geist-sans)]">
            <Header activeItem="meals" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 justify-end">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 19.5 8.25 12l7.5-7.5"
                                />
                            </svg>
                        </button>

                        <h2 className="text-xl font-semibold px-4">
                            {currentYear}年 {getMonthName(currentMonth)}
                        </h2>

                        <button
                            onClick={() => changeMonth(1)}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={goToToday}
                            className="ml-4 px-4 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 rounded-full text-sm font-medium transition-colors"
                        >
                            今日
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8"
                >
                    <div className="grid grid-cols-7 gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <div
                                key={`header-${day}`}
                                className="text-center py-2 font-medium"
                            >
                                <span className={`${getDayColor(day)}`}>
                                    {getDayName(day)}
                                </span>
                            </div>
                        ))}

                        {calendarData.flat().map((day, index) => (
                            <div key={index} className="relative h-36">
                                <motion.div
                                    layoutId={`cell-${day.date.toISOString()}`}
                                    className="relative h-full"
                                >
                                    {(!expandedDate ||
                                        !isSameDate(
                                            day.date,
                                            expandedDate
                                        )) && (
                                        <div
                                            className={`
                                                border border-white/5 rounded-lg p-2 h-full transition-all overflow-hidden flex flex-col
                                                ${
                                                    day.currentMonth
                                                        ? ""
                                                        : "opacity-40"
                                                }
                                                ${
                                                    isToday(day.date)
                                                        ? "ring-2 ring-blue-500/50"
                                                        : "hover:bg-white/10"
                                                }
                                                ${
                                                    expandedDate
                                                        ? "opacity-70"
                                                        : ""
                                                }
                                                cursor-pointer
                                            `}
                                            onClick={() =>
                                                setExpandedDate(day.date)
                                            }
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span
                                                    className={`text-lg font-medium 
                                                    ${
                                                        isToday(day.date)
                                                            ? "text-blue-400"
                                                            : ""
                                                    } 
                                                    ${getDayColor(
                                                        day.date.getDay()
                                                    )}
                                                `}
                                                >
                                                    {day.date.getDate()}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 overflow-hidden flex-grow">
                                                {day.meals.length > 0
                                                    ? day.meals
                                                          .slice(0, 3)
                                                          .map((meal) => {
                                                              const typeInfo =
                                                                  getMealTypeInfo(
                                                                      meal.type
                                                                  );
                                                              return (
                                                                  <div
                                                                      key={
                                                                          meal.id
                                                                      }
                                                                      className={`text-xs py-1 px-2 rounded-lg overflow-hidden whitespace-nowrap text-ellipsis 
                                                                ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
                                                                  >
                                                                      <span
                                                                          className={
                                                                              typeInfo.textColor
                                                                          }
                                                                      >
                                                                          {
                                                                              meal.name
                                                                          }
                                                                      </span>
                                                                  </div>
                                                              );
                                                          })
                                                    : day.currentMonth && (
                                                          <div className="h-16 flex items-center justify-center">
                                                              <button
                                                                  onClick={(
                                                                      e
                                                                  ) => {
                                                                      e.stopPropagation();
                                                                      showAddMealModal(
                                                                          day.date,
                                                                          "breakfast"
                                                                      );
                                                                  }}
                                                                  className="text-xs text-gray-400 hover:text-white transition-colors"
                                                              >
                                                                  + 記録を追加
                                                              </button>
                                                          </div>
                                                      )}

                                                {day.meals.length > 3 && (
                                                    <div className="text-xs text-gray-400 pl-2 pt-1">
                                                        + {day.meals.length - 3}{" "}
                                                        more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <AnimatePresence mode="wait">
                                        {expandedDate &&
                                            isSameDate(
                                                day.date,
                                                expandedDate
                                            ) && (
                                                <motion.div
                                                    initial={{
                                                        height: "9rem",
                                                        width: "100%",
                                                        opacity: 0.9,
                                                    }}
                                                    animate={{
                                                        height: "650px",
                                                        width: "300%",
                                                        opacity: 1,
                                                        transition: {
                                                            height: {
                                                                duration: 0.2,
                                                                ease: "easeOut",
                                                            },
                                                            width: {
                                                                duration: 0.2,
                                                                delay: 0.1,
                                                                ease: "easeOut",
                                                            },
                                                            opacity: {
                                                                duration: 0.2,
                                                            },
                                                        },
                                                    }}
                                                    exit={{
                                                        height: "9rem",
                                                        width: "100%",
                                                        transition: {
                                                            width: {
                                                                duration: 0.2,
                                                                ease: "easeOut",
                                                            },
                                                            height: {
                                                                duration: 0.2,
                                                                delay: 0.1,
                                                                ease: "easeOut",
                                                            },
                                                        },
                                                    }}
                                                    className="absolute top-0 left-0 z-20 bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl border border-white/10 shadow-xl overflow-hidden"
                                                >
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{
                                                            opacity: 1,
                                                            transition: {
                                                                delay: 0.3,
                                                                duration: 0.2,
                                                            },
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            transition: {
                                                                duration: 0.0,
                                                            },
                                                        }}
                                                        className="p-4 h-full overflow-y-auto overflow-x-hidden"
                                                    >
                                                        <div className="p-4 min-h-[400px] overflow-y-auto overflow-x-hidden">
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="text-xl font-bold">
                                                                    {day.date.getFullYear()}
                                                                    年
                                                                    {day.date.getMonth() +
                                                                        1}
                                                                    月
                                                                    {day.date.getDate()}
                                                                    日
                                                                    <span
                                                                        className={`ml-2 ${getDayColor(
                                                                            day.date.getDay()
                                                                        )}`}
                                                                    >
                                                                        (
                                                                        {getDayName(
                                                                            day.date.getDay()
                                                                        )}
                                                                        )
                                                                    </span>
                                                                    {isToday(
                                                                        day.date
                                                                    ) && (
                                                                        <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                                                                            TODAY
                                                                        </span>
                                                                    )}
                                                                </h3>

                                                                <button
                                                                    onClick={() =>
                                                                        setExpandedDate(
                                                                            null
                                                                        )
                                                                    }
                                                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth={
                                                                            1.5
                                                                        }
                                                                        stroke="currentColor"
                                                                        className="w-5 h-5"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M6 18 18 6M6 6l12 12"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>

                                                            <div className="space-y-6">
                                                                {[
                                                                    "breakfast",
                                                                    "lunch",
                                                                    "dinner",
                                                                    "snack",
                                                                ].map(
                                                                    (type) => {
                                                                        const typeInfo =
                                                                            getMealTypeInfo(
                                                                                type
                                                                            );
                                                                        const mealsOfType =
                                                                            day.meals.filter(
                                                                                (
                                                                                    m
                                                                                ) =>
                                                                                    m.type ===
                                                                                    type
                                                                            );

                                                                        return (
                                                                            <div
                                                                                key={
                                                                                    type
                                                                                }
                                                                                className="space-y-3"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <span
                                                                                        className={`w-3 h-3 rounded-full ${typeInfo.color}`}
                                                                                    ></span>
                                                                                    <h4 className="font-medium">
                                                                                        {
                                                                                            typeInfo.label
                                                                                        }
                                                                                    </h4>
                                                                                </div>

                                                                                {mealsOfType.length >
                                                                                0 ? (
                                                                                    <div className="space-y-2">
                                                                                        {mealsOfType.map(
                                                                                            (
                                                                                                meal
                                                                                            ) => (
                                                                                                <div
                                                                                                    key={
                                                                                                        meal.id
                                                                                                    }
                                                                                                    className={`p-3 rounded-lg ${typeInfo.lightColor} ${typeInfo.borderColor} border`}
                                                                                                >
                                                                                                    <div className="flex justify-between items-start">
                                                                                                        <div>
                                                                                                            <h5 className="font-medium">
                                                                                                                {
                                                                                                                    meal.name
                                                                                                                }
                                                                                                            </h5>
                                                                                                            <div className="text-sm text-gray-400 mt-1">
                                                                                                                {
                                                                                                                    meal.time
                                                                                                                }{" "}
                                                                                                                •{" "}
                                                                                                                {
                                                                                                                    meal.calories
                                                                                                                }{" "}
                                                                                                                kcal
                                                                                                            </div>
                                                                                                        </div>

                                                                                                        <div className="flex gap-1">
                                                                                                            <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                                                                                                                <svg
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    fill="none"
                                                                                                                    viewBox="0 0 24 24"
                                                                                                                    strokeWidth={
                                                                                                                        1.5
                                                                                                                    }
                                                                                                                    stroke="currentColor"
                                                                                                                    className="w-4 h-4"
                                                                                                                >
                                                                                                                    <path
                                                                                                                        strokeLinecap="round"
                                                                                                                        strokeLinejoin="round"
                                                                                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                                                                                    />
                                                                                                                </svg>
                                                                                                            </button>
                                                                                                            <button className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
                                                                                                                <svg
                                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                                    fill="none"
                                                                                                                    viewBox="0 0 24 24"
                                                                                                                    strokeWidth={
                                                                                                                        1.5
                                                                                                                    }
                                                                                                                    stroke="currentColor"
                                                                                                                    className="w-4 h-4"
                                                                                                                >
                                                                                                                    <path
                                                                                                                        strokeLinecap="round"
                                                                                                                        strokeLinejoin="round"
                                                                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                                                                    />
                                                                                                                </svg>
                                                                                                            </button>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    <div
                                                                                        className={`py-4 px-4 border ${typeInfo.borderColor} border-dashed rounded-lg text-center`}
                                                                                    >
                                                                                        <p className="text-gray-400 mb-2">
                                                                                            この日の
                                                                                            {
                                                                                                typeInfo.label
                                                                                            }
                                                                                            は記録されていません
                                                                                        </p>
                                                                                        <button
                                                                                            onClick={() =>
                                                                                                showAddMealModal(
                                                                                                    day.date,
                                                                                                    type as MealType
                                                                                                )
                                                                                            }
                                                                                            className={`px-4 py-2 ${typeInfo.lightColor} rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors`}
                                                                                        >
                                                                                            {
                                                                                                typeInfo.label
                                                                                            }
                                                                                            を追加
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <AddMealModal
                    isOpen={showAddMeal}
                    onClose={() => setShowAddMeal(false)}
                    selectedDate={selectedDate}
                    mealType={mealType}
                    setMealType={setMealType}
                    onAddMeal={handleAddMeal}
                />

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
