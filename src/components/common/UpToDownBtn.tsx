import {BsFillArrowDownSquareFill, BsFillArrowUpSquareFill} from "react-icons/bs";

type ScrollButtonProps = {
    direction: 'up' | 'down';
};
const UpToDownBtn: React.FC<ScrollButtonProps> = ({direction}) => {

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
                className="fixed bottom-5 right-5 w-10 h-10 bg-white text-indigo-500 hover:scale-110 duration-100 cursor-pointer"
            />
        )
    }

    if (direction === "down") {
        return (
            <BsFillArrowDownSquareFill
                onClick={() => scrollTo(direction)}
                className="fixed top-5 right-5 w-10 h-10 bg-white text-indigo-500 hover:scale-110 duration-100 cursor-pointer"
            />
        )
    }

}

export default UpToDownBtn