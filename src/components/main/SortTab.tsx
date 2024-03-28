import {BsClockHistory} from "react-icons/bs";
import {MdHotelClass} from "react-icons/md";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

const SortTab = () => {
    return (
        <div className="flex justify-end py-5">
            <div
                className="flex items-center space-x-1 rounded-sm p-2 font-medium outline-none hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div><MdHotelClass className="w-6 h-6"/></div>
                        </TooltipTrigger>
                        <TooltipContent
                            className="flex sm:hidden bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                            <p>가장 인기 있는 포스트</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="hidden sm:flex">가장 인기 있는 포스트</div>
            </div>
            <div
                className="flex items-center space-x-1.5 rounded-sm py-2 px-2.5 font-medium outline-none hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div><BsClockHistory className="w-5 h-5"/></div>
                        </TooltipTrigger>
                        <TooltipContent
                            className="flex sm:hidden bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                            <p>방금 올라온 포스트</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="hidden sm:flex">방금 올라온 포스트</div>
            </div>
        </div>
    )
}

export default SortTab