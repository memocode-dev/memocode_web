import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem, NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu.tsx";
import {toast} from "react-toastify";

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

                <ThemeToggle/>
            </div>

            <div className="flex items-center space-x-2">

                {/* Q&A */}
                <Button
                    onClick={() => {
                        navigate("/questions")
                    }}
                    className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300">
                    Q&A
                </Button>

                {/* 메모 */}
                <Button
                    onClick={() => {
                        if (user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS") {
                            toast.warn("로그인 후 이용 가능합니다.");
                            return;
                        }

                        navigate('/w');
                    }}
                    className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300">
                    메모
                </Button>

                {user_info.authority === "NOT_LOGIN" || user_info.authority === "ANONYMOUS" || user_info.username === "" ?
                    <Button
                        onClick={login}
                        className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300">
                        로그인
                    </Button>
                    :
                    <NavigationMenu className="">
                        <NavigationMenuList>
                            <NavigationMenuItem className="flex items-center">
                                <div className="text-sm hidden sm:flex">{user_info.nickname}</div>
                                <NavigationMenuTrigger className="hidden">
                                    <Avatar className="hover:animate-headShake w-6 h-6 rounded">
                                        <AvatarImage src="https://github.com/shadcn.png"/>
                                        <AvatarFallback>
                                            <Skeleton className="h-6 w-6 rounded"/>
                                        </AvatarFallback>
                                    </Avatar>
                                </NavigationMenuTrigger>


                                <NavigationMenuContent className="p-1 bg-white dark:bg-neutral-700">
                                    <NavigationMenuLink
                                        className="flex justify-center bg-white dark:bg-neutral-700 min-w-[5rem] rounded cursor-pointer">
                                        <div
                                            onClick={() => {
                                                navigate(`/@${user_info.username}/about`)
                                            }}
                                            className="flex-1 py-1 text-center hover:bg-gray-100 dark:hover:bg-black rounded text-sm">
                                            내 블로그
                                        </div>
                                    </NavigationMenuLink>

                                    <NavigationMenuLink
                                        className="flex justify-center bg-white dark:bg-neutral-700 min-w-[4.5rem] rounded cursor-pointer">
                                        <div
                                            onClick={logout}
                                            className="flex-1 py-1 text-center hover:bg-gray-100 dark:hover:bg-black rounded text-sm">
                                            로그아웃
                                        </div>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                }
            </div>
        </div>
    )
}

export default TopBar;