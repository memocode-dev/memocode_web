import '@/css/index.css'
import {Button} from "@/components/ui/button.tsx";
import {IoMdRefresh, IoMdReturnLeft, IoMdReturnRight} from "react-icons/io";

const BottomBar = () => {

    const goBack = () => {
        window.history.back();
    };

    const goForward = () => {
        window.history.forward();
    };

    const reload = () => {
        window.location.reload();
    };

    return (
        <div
            className="flex flex-1 md:hidden fixed bottom-0 left-0 right-0 p-1 border-t bg-white bg-opacity-70 dark:bg-[#1E1E1E] dark:bg-opacity-70 backdrop-blur z-[10] h-14">
            <div className="flex flex-1 justify-around items-center">
                <Button variant="ghost"
                        className="w-fit h-fit px-2 hover:bg-secondary dark:hover:bg-neutral-700" onClick={goBack}>
                    <IoMdReturnLeft className="w-7 h-7"/>
                </Button>
                <Button variant="ghost" className="w-fit h-fit px-2 hover:bg-secondary dark:hover:bg-neutral-700"
                        onClick={reload}>
                    <IoMdRefresh className="w-7 h-7"/>
                </Button>
                <Button variant="ghost"
                        className="w-fit h-fit px-2 hover:bg-secondary dark:hover:bg-neutral-700" onClick={goForward}>
                    <IoMdReturnRight className="w-7 h-7"/>
                </Button>
            </div>
        </div>
    )
}

export default BottomBar;