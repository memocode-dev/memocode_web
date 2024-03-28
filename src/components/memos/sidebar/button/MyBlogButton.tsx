import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {SiBloglovin} from "react-icons/si";

const MyBlogButton = () => {

    const navigate = useNavigate()
    const {user_info} = useContext(UserContext);

    return (
        <div
            onClick={() => {
                if (user_info) {
                    navigate(`/@${user_info.username}/about`);
                }
            }}
            className="flex space-x-1 items-center bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2">
            <SiBloglovin className="w-[16px] h-[16px] ml-0.5"/>
            <div className="text-sm cursor-pointer tracking-wider">내 블로그</div>
        </div>
    )
}

export default MyBlogButton;