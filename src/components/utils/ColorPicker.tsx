import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";

interface ColorPickerProps {
    handleTheme: (color: string) => void;
}

const ColorPicker = ({handleTheme}: ColorPickerProps) => {
    const {theme} = useContext(ThemeContext)

    const primaryColors = [
        {colorHSL: "0 84% 67%", backgroundColor: "#f16363"},
        {colorHSL: "22 97% 69%", backgroundColor: "#fd9c63"},
        {colorHSL: "42 100% 71%", backgroundColor: "#ffd26b"},
        {colorHSL: "142 44% 55%", backgroundColor: "#59bf7f"},
        {colorHSL: "216 88% 65%", backgroundColor: "#5696f4"},
        {colorHSL: "234 89% 74%", backgroundColor: "#818cf8"},
        {colorHSL: "335 66% 63%", backgroundColor: "#df6094"},
        {colorHSL: "274 68% 65%", backgroundColor: "#af6be3"},
        {colorHSL: "173 53% 56%", backgroundColor: "#52cabc"},
    ];

    const [colors, setColors] = useState(primaryColors);

    useEffect(() => {
        const updatedColors = [...primaryColors];
        if (theme === "light") {
            updatedColors.push({colorHSL: "222.2 47.4% 11.2%", backgroundColor: "#2E3343"});
        } else {
            updatedColors.push({colorHSL: "0 0% 100%", backgroundColor: "#ffffff"});
        }
        setColors(updatedColors);
    }, [theme]);

    return (
        <div className="grid grid-cols-5 gap-3 justify-around">
            {colors.map((color, index) => (
                <div
                    key={index}
                    onClick={() => handleTheme(color.colorHSL)}
                    className="rounded w-[24px] h-[24px] cursor-pointer"
                    style={{backgroundColor: color.backgroundColor}}
                />
            ))}
        </div>
    )
}

export default ColorPicker;