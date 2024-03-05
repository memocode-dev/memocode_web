import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

const TopBar = () => {

    const {login, logout, user_info} = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <div
            className="flex fixed justify-between top-0 left-0 right-0 py-3 mx-[40px] md:mx-[50px] xl:mx-[100px] 2xl:mx-[150px] z-[1000] bg-white bg-opacity-80 backdrop-blur">
            <div className="flex items-center">MEMOCODE</div>

            <div className="flex items-center space-x-2">
                {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" || user_info.username === "" ?
                    <div></div>
                    :
                    <div className="text-sm">{user_info.nickname}</div>
                }
                <Menubar className="border-none bg-transparent">
                    <MenubarMenu>
                        {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" ?
                            <MenubarTrigger
                                className="cursor-pointer p-0 bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                                <div className="rounded-sm px-3 py-2 font-medium outline-none hover:bg-accent"
                                     onClick={login}>로그인
                                </div>
                            </MenubarTrigger>
                            :
                            <>
                                <MenubarTrigger
                                    className="cursor-pointer p-0 bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                                    <Avatar className="hover:animate-headShake w-8 h-8">
                                        <AvatarImage src="https://github.com/shadcn.png"/>
                                        <AvatarFallback>
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                        </AvatarFallback>
                                    </Avatar>
                                </MenubarTrigger>
                                <MenubarContent className="fixed -left-11 top-2 min-w-[7rem] z-[1000]">
                                    <MenubarItem onClick={logout}>로그아웃</MenubarItem>
                                    <MenubarItem
                                        onClick={() => {
                                            navigate('/#')
                                        }}>
                                        메모 만들기
                                    </MenubarItem>
                                </MenubarContent>
                            </>
                        }
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    )
}

export default TopBar;