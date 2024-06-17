import {Outlet, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {FaA, FaQ} from "react-icons/fa6";

const MyBlogQnAPage = () => {

    const [selectTab, setSelectTab] = useState<boolean>(false)
    const {username} = useParams()
    const formattedUsername = username?.replace(/^@/, "") // @ 제거
    const navigate = useNavigate()

    return (
        <div
            className="flex flex-col flex-1 justify-center border border-gray-200 dark:border-neutral-700 bg-transparent rounded-none p-5 my-5">

            <div className="flex h-fit bg-background text-[15px]">
                <div
                    onClick={() => {
                        setSelectTab(false)
                        navigate(`/@${formattedUsername}/q&a/questions`)
                    }}
                    className={`flex items-center transition-all duration-500 ease-in-out border-b-2 py-1 px-2 cursor-pointer ${!selectTab ? `border-b-indigo-500` : `border-b-gray-200 dark:border-b-neutral-600 text-gray-400`}`}>
                    <FaQ className="w-3.5 h-3.5 mr-1"/>
                    <span>질문</span>
                </div>
                <div
                    onClick={() => {
                        setSelectTab(true)
                        navigate(`/@${formattedUsername}/q&a/answers`)
                    }}
                    className={`flex items-center transition-all duration-500 ease-in-out border-b-2 py-1 px-2 cursor-pointer ${selectTab ? `border-b-indigo-500` : `border-b-gray-200 dark:border-b-neutral-600 text-gray-400`}`}>
                    <FaA className="w-3.5 h-3.5 mr-0.5"/>
                    <span>답변</span>
                </div>
                <div className="flex-1 border-b-2 border-b-gray-200 dark:border-b-neutral-600"></div>
            </div>

            <div className="flex-1">
                <Outlet/>
            </div>
        </div>
    )
}

export default MyBlogQnAPage