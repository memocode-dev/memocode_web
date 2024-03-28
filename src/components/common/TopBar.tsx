import {useContext, useState} from "react";
import UserContext from "@/context/UserContext.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu.tsx";
import {toast} from "react-toastify";
import {FaRegQuestionCircle} from "react-icons/fa";
import {CiMemoPad} from "react-icons/ci";
import {SiBloglovin} from "react-icons/si";
import {
    Sheet, SheetClose,
    SheetContent,
    SheetHeader,
    SheetTrigger
} from "@/components/ui/sheet.tsx";
import {RiMenuFoldFill, RiMenuUnfoldFill} from "react-icons/ri";
import {TbLogin2, TbLogout2} from "react-icons/tb";

const TopBar = () => {

    const {login, logout, user_info, authority} = useContext(UserContext)
    const navigate = useNavigate()
    const location = useLocation()
    const [hover, setHover] = useState(false)

    return (
        <div
            className={`flex fixed justify-between top-0 left-0 right-0 py-3 z-[1000] bg-white bg-opacity-70 dark:bg-[#1E1E1E] dark:bg-opacity-70 backdrop-blur 
                ${location.pathname === "/w" ? 'px-5' : 'px-5 sm:px-[50px] md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]'}`}>

            <div className="flex items-center space-x-3">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    MEMOCODE
                </div>

                {/* 테마 */}
                <ThemeToggle/>
            </div>

            {/* hidden md:flex */}
            <div className="hidden md:flex items-center space-x-2">

                {/* Q&A */}
                <Button
                    onClick={() => {
                        navigate("/questions")
                    }}
                    className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300 space-x-1">
                    <FaRegQuestionCircle className="w-[20px] h-[20px]"/>
                    <span>질문&답변</span>
                </Button>

                {/* 메모 */}
                <Button
                    onClick={() => {
                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                            toast.warn("로그인 후 이용 가능합니다.");
                            return;
                        }

                        navigate('/w');
                    }}
                    className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300 space-x-0.5">
                    <CiMemoPad className="w-[23px] h-[23px]"/>
                    <span>메모만들기</span>
                </Button>

                {/* 내 블로그 */}
                <Button
                    onClick={() => {
                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                            toast.warn("로그인 후 이용 가능합니다.");
                            return;
                        }

                        if (user_info) {
                            navigate(`/@${user_info.username}/about`)
                        }
                    }}
                    className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300 space-x-1.5">
                    <SiBloglovin className="w-[18px] h-[18px]"/>
                    <span>내 블로그</span>
                </Button>

                {authority === "NOT_LOGIN" || authority === "ANONYMOUS" ?
                    <Button
                        onClick={login}
                        className="rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300">
                        로그인
                    </Button>
                    :
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem className="flex items-center">
                                <NavigationMenuTrigger
                                    className="hidden"
                                    onMouseOver={() => {
                                        setHover(true)
                                    }}
                                    onMouseOut={() => {
                                        setHover(false)
                                    }}>
                                    <div className="text-sm mr-1">{user_info && user_info.username}</div>
                                    <Avatar className={`${hover ? `animate-headShake` : ``} w-6 h-6 rounded`}>
                                        <AvatarImage src="https://github.com/shadcn.png"/>
                                        <AvatarFallback>
                                            <Skeleton className="h-6 w-6 rounded"/>
                                        </AvatarFallback>
                                    </Avatar>
                                </NavigationMenuTrigger>

                                <NavigationMenuContent className="p-1 bg-white dark:bg-neutral-700">
                                    <NavigationMenuLink
                                        className="flex bg-white dark:bg-neutral-700 rounded cursor-pointer">
                                        <div
                                            onClick={logout}
                                            className="flex-1 whitespace-nowrap py-1 px-2 hover:bg-gray-100 dark:hover:bg-black rounded text-sm">
                                            로그아웃
                                        </div>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                }
            </div>

            {/* flex md:hidden */}
            <div className="flex flex-1 md:hidden justify-end">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            className="h-fit p-1.5 bg-transparent rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                            <RiMenuFoldFill className="w-6 h-6 text-foreground"/>
                        </Button>
                    </SheetTrigger>

                    <SheetContent className="z-[1000] px-4 pt-14 border-l-background">
                        <div className="fixed right-5 top-3">
                            <SheetClose>
                                <Button
                                    className="h-fit p-1.5 bg-transparent rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                                    <RiMenuUnfoldFill className="w-6 h-6 text-foreground"/>
                                </Button>
                            </SheetClose>
                        </div>

                        {authority === "USER" &&
                            <SheetHeader
                                className="flex-1 flex flex-row space-y-0 space-x-1.5 px-2 mb-3 items-center cursor-default">
                                <Avatar className={`${hover ? `animate-headShake` : ``} w-6 h-6 rounded`}>
                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                    <AvatarFallback>
                                        <Skeleton className="h-6 w-6 rounded"/>
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-sm">{user_info && user_info.username}</div>
                            </SheetHeader>
                        }

                        <div className="flex flex-col">
                            {/* Q&A */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        navigate("/questions")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <FaRegQuestionCircle className="w-[19px] h-[19px]"/>
                                    <span>질문&답변</span>
                                </Button>
                            </SheetClose>

                            {/* 메모 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                                            toast.warn("로그인 후 이용 가능합니다.");
                                            return;
                                        }

                                        navigate('/w');
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-1.5">
                                    <CiMemoPad className="w-[23px] h-[23px]"/>
                                    <span>메모만들기</span>
                                </Button>
                            </SheetClose>

                            {/* 내 블로그 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        if (authority === "NOT_LOGIN" || authority === "ANONYMOUS") {
                                            toast.warn("로그인 후 이용 가능합니다.");
                                            return;
                                        }

                                        if (user_info) {
                                            navigate(`/@${user_info.username}/about`)
                                        }
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-3 text-gray-800 dark:text-gray-300 space-x-1.5">
                                    <SiBloglovin className="w-[18px] h-[18px]"/>
                                    <span>내 블로그</span>
                                </Button>
                            </SheetClose>

                            {authority === "NOT_LOGIN" || authority === "ANONYMOUS" ?
                                <SheetClose>
                                    <Button
                                        onClick={login}
                                        className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                        <TbLogin2 className="w-[23px] h-[23px]"/>
                                        <span>로그인</span>
                                    </Button>
                                </SheetClose>
                                :
                                <SheetClose>
                                    <Button
                                        onClick={logout}
                                        className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                        <TbLogout2 className="w-[23px] h-[23px]"/>
                                        <span>로그아웃</span>
                                    </Button>
                                </SheetClose>
                            }
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}

export default TopBar;