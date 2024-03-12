import {useEffect, useLayoutEffect, useState} from "react";
import "animate.css";
import {LuMoonStar, LuSunDim} from "react-icons/lu";

const LOCAL_STORAGE_KEY = {
    THEME: "theme",
} as const;

const THEME = {
    LIGHT: "light",
    DARK: "dark",
} as const;

const HandleTheme = () => {

    // false : light, true : dark
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [hoverTheme, setHoverTheme] = useState<boolean>(false)

    useLayoutEffect(() => {
        const theme = localStorage.getItem(LOCAL_STORAGE_KEY.THEME);
        if (theme === THEME.DARK) {
            document.querySelector("html")?.classList.add(THEME.DARK);
        }
    }, []);

    useEffect(() => {

        const htmlEl = document.querySelector("html");
        if (!htmlEl) return;

        const cmEditorEl = document.getElementsByClassName("cm-editor");

        if (isDarkMode) {
            console.log("dark")
            htmlEl.classList.add("dark");
            localStorage.setItem(LOCAL_STORAGE_KEY.THEME, THEME.DARK);

            for (let i = 0; i < cmEditorEl.length; i++) {
                cmEditorEl[i].classList.add("cm-dark");
            }
        } else {
            console.log("light")
            htmlEl.classList.remove("dark");
            localStorage.removeItem(LOCAL_STORAGE_KEY.THEME);

            for (let i = 0; i < cmEditorEl.length; i++) {
                cmEditorEl[i].classList.remove("cm-dark");
            }
        }

    }, [isDarkMode]);

    return (
        <div className="flex justify-center items-center">
            <div
                className={`w-16 h-8 flex items-center rounded px-[1.5px] cursor-pointer ${
                    isDarkMode ? 'justify-end bg-[#2B2B37]' : 'justify-start bg-gray-200'
                }`}
            >
                <div
                    className="rounded flex justify-center items-center"
                >
                    {isDarkMode ? (
                        <>
                            <div
                                className="flex justify-start items-center w-7 h-7 bg-transparent rounded"
                                onMouseOver={() => {
                                    setHoverTheme(true)
                                }}
                                onMouseLeave={() => {
                                    setHoverTheme(false)
                                }}
                                onClick={() => {
                                    setIsDarkMode(false)
                                    setHoverTheme(false)
                                }}
                            >
                                <LuSunDim className="text-gray-300 w-5 h-5"/>
                            </div>

                            <div className="relative">
                                <div
                                    className={`flex justify-center items-center w-7 h-7 bg-[#1B1A22] rounded transform transition duration-300 scale-left ${hoverTheme ? 'scale-x-125' : 'scale-x-100'}`}
                                >
                                </div>
                                <LuMoonStar className="absolute top-1.5 left-1.5 text-gray-300 w-4 h-4"/>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="relative">
                                <div
                                    className={`flex justify-center items-center w-7 h-7 bg-white rounded transform transition duration-300 scale-right ${hoverTheme ? 'scale-x-125 ' : 'scale-x-100'}`}
                                >
                                </div>
                                <LuSunDim className="absolute top-1 left-1 text-gray-800 w-5 h-5"/>
                            </div>

                            <div
                                className="flex justify-end pr-1 items-center w-7 h-7 bg-transparent rounded"
                                onMouseOver={() => {
                                    setHoverTheme(true)

                                }}
                                onMouseLeave={() => {
                                    setHoverTheme(false)
                                }}
                                onClick={() => {
                                    setIsDarkMode(true)
                                    setHoverTheme(false)
                                }}
                            >
                                <LuMoonStar className="text-gray-800 w-4 h-4"/>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default HandleTheme;
