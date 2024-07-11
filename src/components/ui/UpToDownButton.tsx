import React from "react";
import {LuArrowUpToLine} from "react-icons/lu";

type ScrollButtonProps = {
    direction: 'up' | 'down';
};
const UpToDownButton: React.FC<ScrollButtonProps> = ({direction}) => {

    const scrollTo = (direction: 'up' | 'down') => {
        if (direction === 'up') {
            window.scrollTo({top: 0, behavior: 'smooth'});
        } else {
            window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'});
        }
    };

    if (direction === "up") {
        return (
            <LuArrowUpToLine
                onClick={() => scrollTo(direction)}
                className="w-5 h-5"
            />
        )
    }
}

export default UpToDownButton