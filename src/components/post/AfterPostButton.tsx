import {useState} from "react";
import {MdPlayArrow} from "react-icons/md";

const AfterPostButton = () => {

    const [hover, setHover] = useState<boolean>(false)

    const handleClickAfterPost = () => {
        console.log("after")
    }

    return (
        <div className="flex flex-1 px-5 items-center justify-end overflow-x-hidden">
            <div
                className="flex flex-1 items-center space-x-2 cursor-pointer hover:animate-headShake hover:text-indigo-500"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={handleClickAfterPost}
            >
                <div
                    className={`flex flex-1 flex-col items-center text-gray-800 dark:text-gray-300 text-sm font-semibold 
                    ${hover && `transform transition duration-700`}
                    `}>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs sm:text-sm">다음 포스트</span>
                        <MdPlayArrow className="flex sm:hidden w-4 h-4"/>
                    </div>
                    <div className="text-md sm:text-lg line-clamp-1 sm:line-clamp-2">다음 포스트 제목다음 포스트 제목</div>
                </div>
                <MdPlayArrow className="hidden sm:flex w-6 h-6"/>
            </div>
        </div>
    )
}

export default AfterPostButton