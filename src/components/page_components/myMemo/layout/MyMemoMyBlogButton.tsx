'use client';

import {Bounce, toast} from "react-toastify";
import {LuLampDesk} from "react-icons/lu";
import {useKeycloak} from "@/context/KeycloakContext";
import {useRouter} from "next/navigation";
import {useTheme} from "@/context/ThemeContext";

const MyMemoMyBlogButton = () => {

    const {login: keycloakLogin, user_info: keycloakUserInfo, isLogined, logout: keycloakLogout} = useKeycloak()
    const router = useRouter()
    const {theme, primaryColor, fontColor, handlePrimaryColor, handleFontColor} = useTheme()

    return (
        <div
            onClick={() => {
                if (!isLogined) {
                    toast.warn("로그인 후 이용 가능합니다.", {
                        position: "bottom-right",
                        theme: theme,
                        transition: Bounce,
                        className: "text-sm"
                    });
                    return;
                }

                router.push(`/@${keycloakUserInfo.username}`)
            }}
            className="flex w-full py-1 px-2 space-x-1.5 items-center text-foreground hover:bg-secondary dark:hover:bg-neutral-700 cursor-pointer rounded">
            <LuLampDesk className="w-[20px] h-[20px]"/>
            <div className="text-[15px]">내 블로그</div>
        </div>
    )
}

export default MyMemoMyBlogButton;