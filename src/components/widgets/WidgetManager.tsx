"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";
import AddMealWidget from "./AddMealWidget";
import AddInventoryWidget from "./AddInventoryWidget";
import { MealType } from "@/app/meals/utils/mealTypeUtils";

type WidgetType = "addMeal" | "addInventory" | null;

interface WidgetOptions {
    date?: Date;
    mealType?: MealType;
    category?: string;
    onSuccess?: () => void;
    returnUrl?: string;
    prefilledData?: Record<string, any>;
}

interface WidgetContextType {
    openWidget: (type: WidgetType, options?: WidgetOptions) => void;
    closeWidget: () => void;
    activeWidget: WidgetType;
    isWidgetOpen: boolean;
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
    const router = useRouter();
    const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
    const [widgetOptions, setWidgetOptions] = useState<WidgetOptions>({});

    const openWidget = useCallback((type: WidgetType, options: WidgetOptions = {}) => {
        setActiveWidget(type);
        setWidgetOptions(options);
    }, []);

    const closeWidget = useCallback(() => {
        setActiveWidget(null);
        setWidgetOptions({});
    }, []);

    const handleSuccess = useCallback(() => {
        // 成功時のコールバックがあれば実行
        if (widgetOptions.onSuccess) {
            widgetOptions.onSuccess();
        }

        // 戻りURLがあれば遷移
        if (widgetOptions.returnUrl) {
            // Close widget first, then navigate after a small delay
            const urlToNavigate = widgetOptions.returnUrl;
            closeWidget();
            setTimeout(() => {
                router.push(urlToNavigate || '/');
            }, 100); // Delay allows widget closing animation to complete partially
        } else {
            closeWidget();
        }
    }, [widgetOptions, router, closeWidget]);


    // ウィジェットが開いているかどうか
    const isWidgetOpen = activeWidget !== null;

    return (
        <WidgetContext.Provider value={{
            openWidget,
            closeWidget,
            activeWidget,
            isWidgetOpen
        }}>
            {children}

            <AddMealWidget
                isOpen={activeWidget === "addMeal"}
                onClose={closeWidget}
                onSuccess={handleSuccess}
                initialDate={widgetOptions.date || new Date()}
                initialMealType={widgetOptions.mealType || "breakfast"}
            />

            <AddInventoryWidget
                isOpen={activeWidget === "addInventory"}
                onClose={closeWidget}
                onSuccess={handleSuccess}
            />
        </WidgetContext.Provider>
    );
};

/**
 * よく使用されるウィジェットを開くためのショートカット関数
 */
export const WidgetShortcuts = {
    // 食事記録を追加
    addMeal: (options: Omit<WidgetOptions, 'type'> = {}) => {
        // This needs to be called within a component that uses useWidgets hook
        // Example: const { openWidget } = useWidgets(); return () => openWidget("addMeal", options);
        // This structure is not directly usable outside a component context.
        // A better approach might be to provide the openWidget function directly or modify this structure.
        // For now, returning a function that requires useWidgets to be called in the component.
        return (openWidgetFunction: (type: WidgetType, options?: WidgetOptions) => void) => {
             openWidgetFunction("addMeal", options);
        };
    },

    // 食材を追加
    addInventory: (options: Omit<WidgetOptions, 'type'> = {}) => {
        return (openWidgetFunction: (type: WidgetType, options?: WidgetOptions) => void) => {
             openWidgetFunction("addInventory", options);
        };
    }
};
