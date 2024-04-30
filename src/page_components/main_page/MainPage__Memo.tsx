import DOMPurify from "dompurify";
import Avatar from "react-avatar";
import timeSince from "@/components/utils/timeSince.tsx";
import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {SearchMemoMemoResult} from "@/openapi/model";
import {useNavigate} from "react-router-dom";
import {useTheme} from "@/context/ThemeContext.tsx";
import {
    useFindAllMemoComment
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";

const MainPage__Memo = ({memo}: { memo: SearchMemoMemoResult }) => {

    const navigate = useNavigate();
    const {theme} = useTheme();

    // 댓글 수 조회
    const {
        data: comments
    } = useFindAllMemoComment(
        memo.id!, {
            query: {
                queryKey: ['MainPage__Memo', memo.id],
            }
        });

    const MainPage__Memo__Title = <div
        className="text-lg font-semibold tracking-tight line-clamp-2">{memo.title}</div>;

    return (
        <div key={memo.id}
             className="flex flex-col scale-100 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
             onClick={() => {
                 navigate(`/@${memo?.user?.username}/${memo.id}`)
             }}
        >
            <div
                className="flex-1 flex flex-col scale-100 min-h-[313px] justify-between py-2 px-3">
                <div>
                    {MainPage__Memo__Title}
                    <div
                        className="text-md mt-2 tracking-tight line-clamp-2 text-gray-600 dark:text-gray-400">
                        {memo.summary}
                    </div>
                    <div className="markdown-body tracking-wide line-clamp-6"
                         style={{
                             fontSize: 14,
                             marginTop: 4,
                             color: `${theme === "dark" ? "#9ca3af" : "#6b7280"}`
                         }}
                         dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(memo.content || "")}}></div>
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