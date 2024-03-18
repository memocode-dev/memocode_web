import {useContext, useState} from "react";
import "animate.css";
import {LuMoonStar, LuSunDim} from "react-icons/lu";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const ThemeToggle = () => {

    // false : light, true : dark
    const {toggle, theme} = useContext(ThemeContext);
    const [hoverTheme, setHoverTheme] = useState<boolean>(false)

    const isDarkMode = theme === "dark";

    return (
        <div className="flex justify-center items-center">
            <div
                className={`w-16 h-9 flex items-center rounded px-[3px] cursor-pointer ${
                    isDarkMode ? 'justify-end bg-black' : 'justify-start bg-gray-200'
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
                                    toggle(() => "light")
                                    setHoverTheme(false)
                                }}
                            >
                                <LuSunDim className="text-gray-300 w-5 h-5"/>
                            </div>

                            <div className="relative">
                                <div
                                    className={`flex justify-center items-center w-7 h-7 bg-neutral-700 rounded transform transition duration-300 scale-left ${hoverTheme ? 'scale-x-125' : 'scale-x-100'}`}
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
                                    toggle(() => "dark")
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
export default ThemeToggle;
