import {FiAward} from "react-icons/fi";
import {BsClockHistory} from "react-icons/bs";

const SortTab = () => {
    return (
        <div className="flex justify-end py-5">
            <div
                className="flex items-center space-x-1 rounded-sm p-2 font-medium outline-none hover:bg-accent dark:hover:bg-neutral-700 cursor-pointer">
                <FiAward className="w-5 h-5"/>
                <div className="hidden sm:flex">가장 인기 있는 포스트</div>
            </div>
            <div
                className="flex items-center space-x-1.5 rounded-sm p-2 font-medium outline-none hover:bg-accent dark:hover:bg-neutral-700 cursor-pointer">
                <BsClockHistory className="w-5 h-5"/>
                <div className="hidden sm:flex">방금 올라온 포스트</div>
            </div>
        </div>
    )
}

export default SortTab