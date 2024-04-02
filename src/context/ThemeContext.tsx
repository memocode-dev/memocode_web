import React, {ReactNode, useEffect, useState} from "react";

type ITheme = "dark" | "light";

interface IThemeContext {
    toggle: (fun: (prev: ITheme) => ITheme) => void;
    theme: ITheme;
}

export const ThemeContext = React.createContext<IThemeContext>({
    toggle: () => {},
    theme: "light",
});

export function ThemeProvider({children}: { children: ReactNode }) {
    const [theme, setTheme] = useState<ITheme>("light");

    const toggle = (fun: (prev: ITheme) => ITheme) => {
        setTheme(fun(theme));
        localStorage.setItem('theme', fun(theme));
    }

    const value = {
        toggle,
        theme,
    }

    useEffect(() => {
        const $html = document.querySelector("html");

        if ($html) {
            $html.className = theme;
        }
    }, [theme]);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ITheme | null;

        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
        }
    }, []);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}