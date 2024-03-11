import {PiArrowFatLinesRightFill} from "react-icons/pi";
import {useState} from "react";

const AfterPost = () => {

    const [hover, setHover] = useState<boolean>(false)

    const handleClickAfterPost = () => {
        console.log("after")
    }

    return (
        <div className="flex flex-1 p-10 items-center justify-end overflow-x-hidden">
            <div
                className="flex items-center space-x-2 cursor-pointer hover:animate-headShake hover:text-indigo-600"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={handleClickAfterPost}
            >
                <div className="text-gray-800 text-xl font-semibold">다음 포스트</div>
                <PiArrowFatLinesRightFill className="w-6 h-6"/>
            </div>

            <div
                className={`absolute p-3 xl:p-10 rounded transform transition duration-700 shadow-lg bg-gray-50
                        ${hover ? "-right-10 translate-x-full lg:-translate-x-[50px] xl:-translate-x-[90px] 2xl:-translate-x-[240px]"
                    :
                    "-right-10 translate-x-[150px]"}`}
            >
                <span className="text-gray-800 font-semibold">다음 포스트 제목</span>
            </div>
        </div>
    )
}

export default AfterPost