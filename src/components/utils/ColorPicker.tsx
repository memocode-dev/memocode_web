import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";

interface ColorPickerProps {
    handleTheme: (color: string) => void;
}

const ColorPicker = ({handleTheme}: ColorPickerProps) => {
    const {theme} = useContext(ThemeContext)

    const primaryColors = [
        {colorHSL: "0 72% 51%", backgroundColor: "#DC2726"},
        {colorHSL: "25 95% 53%", backgroundColor: "#F97316"},
        {colorHSL: "48 96% 53%", backgroundColor: "#FACC15"},
        {colorHSL: "142 76% 36%", backgroundColor: "#16A34A"},
        {colorHSL: "221 100% 66%", backgroundColor: "#5187ff"},
        {colorHSL: "261 100% 71%", backgroundColor: "#9d69ff"},
        {colorHSL: "301 79% 63%", backgroundColor: "#EB58E8"},
        {colorHSL: "188 71% 49%", backgroundColor: "#25bdd6"},
        {colorHSL: "156 65% 54%", backgroundColor: "#3dd69a"},
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