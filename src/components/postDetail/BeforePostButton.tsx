import {PiArrowFatLinesLeftFill} from "react-icons/pi";
import {useState} from "react";

const BeforePostButton = () => {

    const [hover, setHover] = useState<boolean>(false)

    const handleClickBeforePost = () => {
        console.log("before")
    }

    return (
        <div className="flex flex-1 p-10 items-center">
            <div
                className="flex items-center space-x-2 cursor-pointer hover:animate-headShake hover:text-indigo-600"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={handleClickBeforePost}
            >
                <PiArrowFatLinesLeftFill className="w-6 h-6"/>
                <div className="text-gray-800 text-xl font-semibold">이전 포스트</div>
            </div>

            <div
                className={`absolute -left-[300px] p-3 xl:p-10 rounded transform transition duration-700 shadow-lg bg-gray-50
                        ${hover ? "-left-[200px] translate-x-0 lg:translate-x-[210px] xl:translate-x-[250px] 2xl:translate-x-[400px]"
                    :
                    "-left-[200px] translate-x-0"}`}
            >
                <span className="text-gray-800 font-semibold">이전 포스트 제목</span>
            </div>
        </div>
    )
}

export default BeforePostButton