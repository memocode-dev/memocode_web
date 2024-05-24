import Avatar from "react-avatar";
import timeSince from "@/components/utils/timeSince.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {SearchMemoMemoResult} from "@/openapi/model";
import {useNavigate} from "react-router-dom";
import {
    useFindAllMemoComment
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";

const MainPage__Memo = ({memo}: { memo: SearchMemoMemoResult }) => {

    const navigate = useNavigate();

    // const thumbnail = "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg"
    const thumbnail = ""

    // 댓글 수 조회
    const {
        data: comments
    } = useFindAllMemoComment(
        memo.id!, {
            query: {
                queryKey: ['MainPage__Memo', memo.id],
            }
        });

    return (
        <div key={memo.id}
             className={`flex flex-col scale-100 ${thumbnail ? '' : 'h-[310px]'} rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg`}
             onClick={() => {
                 navigate(`/@${memo?.user?.username}/${memo.id}`)
             }}
        >
            {thumbnail &&
                <img
                    src={thumbnail}
                    className="rounded-lg w-full h-[50%]" alt="thumbNail"/>}

            <div
                className={`flex-1 flex flex-col justify-between py-2 px-3`}>
                <div>
                    <div
                        className="text-lg font-semibold tracking-tight line-clamp-2">{memo.title}</div>
                    <div
                        className="text-md mt-2 tracking-tight line-clamp-2 text-gray-600 dark:text-gray-400">
                        {memo.summary}
                    </div>
                </div>

                <div className="mt-3">
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

                    <div className="flex justify-between text-xs mt-1">
                        <div className="flex space-x-2">
                            <div className="flex items-center space-x-1">
                                <AiFillLike className="w-4 h-4"/>
                                <div>미</div>
                            </div>

                            <div className="flex items-center space-x-1">
                                <IoGlasses className="w-6 h-6"/>
                                <div>구</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            <AiOutlineComment className="w-5 h-5"/>
                            <div>{comments?.length}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage__Memo;