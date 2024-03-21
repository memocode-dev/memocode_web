import {BsFillArrowUpSquareFill} from "react-icons/bs";
import React from "react";

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
            <BsFillArrowUpSquareFill
                onClick={() => scrollTo(direction)}
                className="fixed bottom-4 right-4 w-7 h-7 bg-transparent text-indigo-500 dark:text-gray-200 hover:scale-110 duration-100 cursor-pointer"
            />
        )
    }
}

export default UpToDownButton