import {PiBooks} from "react-icons/pi";
import {useNavigate} from "react-router-dom";

const MemoSeriesButton = () => {

    const navigate = useNavigate()

    return (
        <>
            <div
                onClick={() => {
                    navigate("/w/series")
                }}
                className="flex items-center space-x-1.5 bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-1.5 cursor-pointer">
                <PiBooks className="w-[21px] h-[21px]"/>
                <div className="text-sm tracking-wider">시리즈 관리</div>
            </div>
        </>
    )
}

export default MemoSeriesButton;