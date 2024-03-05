import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";

const TopBar = () => {

    const {login, logout, user_info} = useContext(UserContext)

    return (
        <div className="fixed top-0 left-0 right-0 p-1 border-b bg-white z-[1000]">
            <div className="flex justify-end items-center space-x-2">
                {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" || user_info.username === "" ?
                    <div></div>
                    :
                    <div>{user_info.nickname}님 환영합니다</div>
                }
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger>계정</MenubarTrigger>
                        <MenubarContent>
                            {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" ?
                                <MenubarItem onClick={login}>로그인</MenubarItem>
                                :
                                <MenubarItem onClick={logout}>로그아웃</MenubarItem>
                            }
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    )
}

export default TopBar;