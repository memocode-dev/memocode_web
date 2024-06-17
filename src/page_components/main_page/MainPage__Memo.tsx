import Avatar from "react-avatar";
import timeSince from "@/components/utils/timeSince.tsx";
import {SearchMemoMemoResult} from "@/openapi/model";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const MainPage__Memo = ({memo}: { memo: SearchMemoMemoResult }) => {

    const navigate = useNavigate();
    const {theme} = useContext(ThemeContext)
    const thumbnail_black = "../imgs/memocode_bg_transform_black.png"
    const thumbnail_white = "../imgs/memocode_bg_transform_white.png"

    return (
        <div key={memo.id}
             className={`flex flex-col rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg`}
             onClick={() => {
                 navigate(`/@${memo?.user?.username}/${memo.id}`)
             }}
             style={{aspectRatio: '8 / 9'}}
        >
            <div className="flex justify-center bg-neutral-200/50 dark:bg-neutral-700 p-5 w-full h-[45%] rounded-lg">
                <img
                    src={theme === "light" ? thumbnail_black : thumbnail_white}
                    className="rounded-lg" alt="thumbNail"/>
            </div>

            <div
                className={`flex-1 flex flex-col justify-between p-4`}>
                <div>
                    <div
                        className="text-lg font-semibold tracking-tight line-clamp-2">{memo.title}</div>
                    <div
                        className="text-md mt-2 tracking-tight line-clamp-2 text-gray-600 dark:text-gray-400">
                        {memo.summary}
                    </div>
                </div>

                {/*<div className="mt-3">*/}
                <div className="flex items-center text-xs">
                    <div className="flex items-center space-x-1.5">
                        <Avatar
                            name={memo.user?.username}
                            size="25"
                            round="5px"/>

                        <div>{memo.user?.username}</div>

                        <div
                            className="text-gray-500 dark:text-gray-400">{timeSince(new Date(memo.createdAt!))}</div>
                    </div>
                </div>

                {/*<div className="flex justify-between text-xs mt-1">*/}
                {/*    <div className="flex space-x-2">*/}
                {/*        <div className="flex items-center space-x-1">*/}
                {/*            <AiFillLike className="w-4 h-4"/>*/}
                {/*            <div>미</div>*/}
                {/*        </div>*/}

                {/*        <div className="flex items-center space-x-1">*/}
                {/*            <IoGlasses className="w-6 h-6"/>*/}
                {/*            <div>구</div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="flex items-center space-x-1">*/}
                {/*        <AiOutlineComment className="w-5 h-5"/>*/}
                {/*        <div>현</div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
}

export default MainPage__Memo;