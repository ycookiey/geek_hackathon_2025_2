"use client";

import { motion, AnimatePresence } from "framer-motion";
import CalendarCell from "./CalendarCell";
import DayDetail from "./DayDetail";
import { MealDay } from "../../types";
import { getDayColor, getDayName, isSameDate } from "../../utils";

interface CalendarProps {
  calendarData: MealDay[][];
  expandedDate: Date | null;
  setExpandedDate: (date: Date | null) => void;
  showAddMealModal: (date: Date, type: "breakfast" | "lunch" | "dinner" | "snack") => void;
}

export default function Calendar({
  calendarData,
  expandedDate,
  setExpandedDate,
  showAddMealModal,
}: CalendarProps) {
  return (
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
          <CalendarCell
            key={index}
            day={day}
            isExpanded={expandedDate !== null && isSameDate(day.date, expandedDate)}
            expandedDate={expandedDate}
            setExpandedDate={setExpandedDate}
            showAddMealModal={showAddMealModal}
          />
        ))}

        <AnimatePresence mode="wait">
          {expandedDate && calendarData.flat().map((day, index) => {
            if (expandedDate && isSameDate(day.date, expandedDate)) {
              return (
                <DayDetail
                  key={`detail-${index}`}
                  day={day}
                  onClose={() => setExpandedDate(null)}
                  showAddMealModal={showAddMealModal}
                />
              );
            }
            return null;
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
