import {Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger} from "@/components/ui/menubar.tsx";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";

const TopBar = () => {

    const {login, logout, user_info} = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <div
            className={`flex fixed justify-between top-0 left-0 right-0 py-3 z-[1000] bg-white bg-opacity-70 dark:bg-[#1E1E1E] dark:bg-opacity-70 backdrop-blur 
                ${location.pathname === "/w" ? 'px-5' : 'px-5 sm:px-[50px] md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]'}`}>

            <div className="flex items-center space-x-2">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    MEMOCODE
                </div>

                <div onClick={() => {
                    navigate("/questions")
                }}>Q&A
                </div>

                <ThemeToggle/>
            </div>

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
                                    <Avatar className="hover:animate-headShake w-7 h-7 rounded">
                                        <AvatarImage src="https://github.com/shadcn.png"/>
                                        <AvatarFallback>
                                            <Skeleton className="h-7 w-7 rounded"/>
                                        </AvatarFallback>
                                    </Avatar>
                                </MenubarTrigger>
                                <MenubarContent
                                    className="fixed -left-11 top-2 min-w-[7rem] z-[1000] dark:bg-neutral-700">
                                    <MenubarItem className="dark:hover:bg-black" onClick={logout}>로그아웃</MenubarItem>
                                    <MenubarItem
                                        className="dark:hover:bg-black"
                                        onClick={() => {
                                            navigate('/w')
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