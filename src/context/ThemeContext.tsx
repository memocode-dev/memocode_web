'use client'

import React, {ReactNode, useContext, useEffect, useState} from "react";

interface IThemeContext {
    toggle: (fun: (prev: ITheme) => ITheme) => void;
    theme: ITheme;
    handlePrimaryColor: (fun: (prev: string) => string) => void;
    primaryColor: string;
    handleFontColor: (fun: (prev: string) => string) => void;
    fontColor: string;
}

type ITheme = "dark" | "light";

export const ThemeContext = React.createContext<IThemeContext>({
    toggle: () => {},
    theme: "light",
    handlePrimaryColor: () => {},
    primaryColor: "",
    handleFontColor: () => {},
    fontColor: ""
});

export function ThemeProvider({children}: { children: ReactNode }) {
    const [theme, setTheme] = useState<ITheme>("light");
    const [primaryColor, setPrimaryColor] = useState<string>("");
    const [fontColor, setFontColor] = useState<string>("");

    const toggle = (fun: (prev: ITheme) => ITheme) => {
        setTheme(fun(theme));
        localStorage.setItem('theme', fun(theme));
    }

    const handlePrimaryColor = (fun: (prev: string) => string) => {
        setPrimaryColor(fun(primaryColor));
        localStorage.setItem('primaryColor', fun(primaryColor));
    }

    const handleFontColor = (fun: (prev: string) => string) => {
        setFontColor(fun(fontColor));
        localStorage.setItem('fontColor', fun(fontColor));
    }

    const value = {
        toggle,
        theme,
        handlePrimaryColor,
        primaryColor,
        handleFontColor,
        fontColor
    }

    useEffect(() => {
        const $html = document.querySelector("html");
        const style = document.documentElement.style;

        if ($html) {
            $html.className = theme;
        }

        if (primaryColor || fontColor) {

            if (theme === "light" && primaryColor === "0 0% 100%") {
                setPrimaryColor("222.2 47.4% 11.2%");
                setFontColor("0 0% 100%");
            }

            if (theme === "light" && primaryColor === "173 53% 56%") {
                setFontColor("0 0% 100%");
            }

            if (theme === "dark" && primaryColor === "173 53% 56%") {
                setFontColor("222.2 47.4% 11.2%");
            }

            if (theme === "dark" && primaryColor === "222.2 47.4% 11.2%") {
                setPrimaryColor("0 0% 100%");
                setFontColor("222.2 47.4% 11.2%");
            }

            style.setProperty('--primary', primaryColor)
            style.setProperty('--primary-foreground', fontColor)

        }
    }, [theme, primaryColor, fontColor]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ITheme | null;
        const savedPrimaryColor = localStorage.getItem('primaryColor');
        const savedFontColor = localStorage.getItem('fontColor');

        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
        }

        if (savedPrimaryColor) {
            setPrimaryColor(savedPrimaryColor)
        }

        if (savedFontColor) {
            setFontColor(savedFontColor)
        }
    }, []);


    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): IThemeContext => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useKeycloak must be used within a KeycloakProvider');
    }
    return context;
};