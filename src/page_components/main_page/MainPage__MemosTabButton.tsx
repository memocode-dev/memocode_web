import React from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const MainPage__MemosTabButton = ({icon, label}: {icon: React.ReactNode, label: string}) => {
    return (
        <div
            className="flex items-center space-x-1.5 rounded-sm py-2 px-2.5 font-medium outline-none hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div>{icon}</div>
                    </TooltipTrigger>
                    <TooltipContent
                        className="flex sm:hidden bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                        <p>{label}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <div className="hidden sm:flex">{label}</div>
        </div>
    );
}

export default MainPage__MemosTabButton;