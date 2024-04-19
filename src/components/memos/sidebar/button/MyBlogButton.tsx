import {useNavigate} from "react-router-dom";
import {SiBloglovin} from "react-icons/si";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

const MyBlogButton = () => {

    const navigate = useNavigate()
    const {user_info} = useKeycloak()

    return (
        <div
            onClick={() => {
                navigate(`/@${user_info.username}/about`);
            }}
            className="flex space-x-2 items-center bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
            <SiBloglovin className="w-[15px] h-[15px] ml-0.5"/>
            <div className="text-sm tracking-wider">내 블로그</div>
        </div>
    )
}

export default MyBlogButton;