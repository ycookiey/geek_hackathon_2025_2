"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import AddMealWidget from "./AddMealWidget";
import AddInventoryWidget from "./AddInventoryWidget";

type WidgetType = "addMeal" | "addInventory" | null;

interface WidgetContextType {
    openWidget: (type: WidgetType, options?: any) => void;
    closeWidget: () => void;
}

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export const useWidgets = () => {
    const context = useContext(WidgetContext);
    if (!context) {
        throw new Error("useWidgets must be used within a WidgetProvider");
    }
    return context;
};

interface WidgetProviderProps {
    children: ReactNode;
}

export const WidgetProvider = ({ children }: WidgetProviderProps) => {
    const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
    const [widgetOptions, setWidgetOptions] = useState<any>({});

    const openWidget = (type: WidgetType, options = {}) => {
        setActiveWidget(type);
        setWidgetOptions(options);
    };

    const closeWidget = () => {
        setActiveWidget(null);
        setWidgetOptions({});
    };

    const handleSuccess = () => {
        if (widgetOptions.onSuccess) {
            widgetOptions.onSuccess();
        }
        closeWidget();
    };

    return (
        <WidgetContext.Provider value={{ openWidget, closeWidget }}>
            {children}

            <AddMealWidget
                isOpen={activeWidget === "addMeal"}
                onClose={closeWidget}
                onSuccess={handleSuccess}
                initialDate={widgetOptions.date}
                initialMealType={widgetOptions.mealType}
            />

            <AddInventoryWidget
                isOpen={activeWidget === "addInventory"}
                onClose={closeWidget}
                onSuccess={handleSuccess}
            />
        </WidgetContext.Provider>
    );
};
