'use client';

import {LuArrowLeft, LuArrowRight, LuRotateCw} from "react-icons/lu";
import {Button} from "@/components/ui/button";
import UpToDownButton from "@/components/ui/UpToDownButton";

const BottomBar = () => {

    const goBack = () => {
        typeof window !== 'undefined' && window.history.back();
    };

    const goForward = () => {
        typeof window !== 'undefined' && window.history.forward();
    };

    const reload = () => {
        typeof window !== 'undefined' && window.location.reload();
    };

    return (
        <div
            className="flex flex-1 md:hidden fixed bottom-0 left-0 right-0 p-1 border-t bg-background/25 backdrop-blur z-10 h-14">
            <div className="flex flex-1 justify-around items-center">
                <Button variant="ghost"
                        className="w-fit h-fit px-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50" onClick={goBack}>
                    <LuArrowLeft className="w-5 h-5"/>
                </Button>
                <Button variant="ghost" className="w-fit h-fit px-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50"
                        onClick={reload}>
                    <LuRotateCw className="w-5 h-5"/>
                </Button>
                <Button variant="ghost"
                        className="w-fit h-fit px-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50" onClick={goForward}>
                    <LuArrowRight className="w-5 h-5"/>
                </Button>

                {/* 위로 이동 버튼 */}
                <Button variant="ghost"
                        className="w-fit h-fit px-2 hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50">
                    <UpToDownButton direction="up"/>
                </Button>
            </div>
        </div>
    )
}

export default BottomBar;