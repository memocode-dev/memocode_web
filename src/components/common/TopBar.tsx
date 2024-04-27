import {useContext, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Avatar from 'react-avatar';
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
import {Sheet, SheetClose, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import {RiMenuFoldFill, RiMenuUnfoldFill} from "react-icons/ri";
import {TbLogin2, TbLogout2} from "react-icons/tb";
import {MdOutlineRoofing, MdQuestionAnswer} from "react-icons/md";
import {FaQ} from "react-icons/fa6";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

const TopBar = () => {

    const {login: keycloakLogin, user_info: keycloakUserInfo, isLogined, logout: keycloakLogout} = useKeycloak()
    const navigate = useNavigate()
    const location = useLocation()
    const [hover, setHover] = useState(false)
    const {theme} = useContext(ThemeContext)

    const TopBar__DisplayMoreMd = (
        <>
            {/* Q&A */}
            <Button
                onClick={() => {
                    navigate("/questions")
                }}
                className="rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2.5 h-fit text-gray-800 dark:text-gray-300 space-x-1">
                <FaRegQuestionCircle className="w-[19px] h-[19px]"/>
                <span>질문&답변</span>
            </Button>

            {/* 메모 */}
            <Button
                onClick={() => {
                    if (!isLogined) {
                        toast.warn("로그인 후 이용 가능합니다.");
                        return;
                    }

                    navigate('/w');
                }}
                className="rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 h-fit text-gray-800 dark:text-gray-300 space-x-0.5">
                <CiMemoPad className="w-[20px] h-[20px]"/>
                <span>메모만들기</span>
            </Button>

            {/* 내 블로그 */}
            <Button
                onClick={() => {
                    if (!isLogined) {
                        toast.warn("로그인 후 이용 가능합니다.");
                        return;
                    }

                    navigate(`/@${keycloakUserInfo.username}/about`)
                }}
                className="rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2.5 h-fit text-gray-800 dark:text-gray-300 space-x-1.5">
                <SiBloglovin className="w-[17px] h-[17px]"/>
                <span>내 블로그</span>
            </Button>

            {!isLogined ?
                <Button
                    onClick={keycloakLogin}
                    className="rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2 text-gray-800 dark:text-gray-300">
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
                                <div className="text-sm mr-1">{keycloakUserInfo.username}</div>

                                <Avatar
                                    name={keycloakUserInfo.username}
                                    size="25"
                                    round="5px"/>
                            </NavigationMenuTrigger>

                            <NavigationMenuContent className="p-1 bg-white dark:bg-neutral-700">
                                <NavigationMenuLink
                                    className="flex bg-white dark:bg-neutral-700 rounded cursor-pointer">
                                    <div
                                        onClick={keycloakLogout}
                                        className="flex-1 whitespace-nowrap py-1 px-2 hover:bg-gray-100 dark:hover:bg-black rounded text-sm">
                                        로그아웃
                                    </div>
                                </NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            }
        </>
    )

    const TopBar__DisplayBelowMd = (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    onClick={() => {
                        navigate("/")
                    }}
                    className="h-fit p-1.5 bg-transparent rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <RiMenuFoldFill className="w-6 h-6 text-foreground"/>
                </Button>
            </SheetTrigger>

            <SheetContent className="z-[1000] px-4 pt-14 border-l-background">
                <SheetClose className="fixed top-3">
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    className="h-fit p-1.5 bg-transparent rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                                    <MdOutlineRoofing className="w-6 h-6 text-foreground"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side={"right"}
                                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                                <p>홈</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </SheetClose>

                <SheetClose className="fixed top-3 right-5">
                    <Button
                        className="h-fit p-1.5 bg-transparent rounded hover:bg-gray-100 dark:hover:bg-neutral-700">
                        <RiMenuUnfoldFill className="w-6 h-6 text-foreground"/>
                    </Button>
                </SheetClose>

                {isLogined &&
                    <div
                        className="flex space-y-0 space-x-1.5 px-2 mb-3 items-center cursor-default">
                        <Avatar
                            className={`${hover ? `animate-headShake` : ``} w-6 h-6 rounded`}
                            name={keycloakUserInfo.username}
                            size="25"
                            round="5px"/>

                        <div className="text-sm">{keycloakUserInfo.username}</div>
                    </div>
                }

                <div className="flex flex-col">

                    {location.pathname !== "/questions" &&
                        <>
                            {/* 질문 & 답변 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        navigate("/questions")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <FaRegQuestionCircle className="w-[18px] h-[18px]"/>
                                    <span>질문&답변</span>
                                </Button>
                            </SheetClose>
                        </>
                    }

                    {location.pathname === "/questions" &&
                        <>
                            {/* 질문 사이드바 추가 */}

                            {/* Q&A 모아보기 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        navigate("/questions")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <MdQuestionAnswer className="w-[18px] h-[18px]"/>
                                    <span>Q&A 모아보기</span>
                                </Button>
                            </SheetClose>

                            {/* 질문 하러가기 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        navigate("/questions/ask")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <FaQ className="w-[18px] h-[18px]"/>
                                    <span>질문 하러가기</span>
                                </Button>
                            </SheetClose>
                        </>
                    }


                    {/* 메모 */}
                    <SheetClose>
                        <Button
                            onClick={() => {
                                if (!isLogined) {
                                    toast.warn("로그인 후 이용 가능합니다.");
                                    return;
                                }

                                navigate('/w');
                            }}
                            className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-1.5">
                            <CiMemoPad className="w-[22px] h-[22px]"/>
                            <span>메모만들기</span>
                        </Button>
                    </SheetClose>

                    {/* 내 블로그 */}
                    <SheetClose>
                        <Button
                            onClick={() => {
                                if (!isLogined) {
                                    toast.warn("로그인 후 이용 가능합니다.");
                                    return;
                                }

                                navigate(`/@${keycloakUserInfo.username}/about`)
                            }}
                            className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-3 text-gray-800 dark:text-gray-300 space-x-1.5">
                            <SiBloglovin className="w-[17px] h-[17px]"/>
                            <span>내 블로그</span>
                        </Button>
                    </SheetClose>

                    {!isLogined ?
                        <SheetClose>
                            <Button
                                onClick={keycloakLogin}
                                className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                <TbLogin2 className="w-[22px] h-[22px]"/>
                                <span>로그인</span>
                            </Button>
                        </SheetClose>
                        :
                        <SheetClose>
                            <Button
                                onClick={keycloakLogout}
                                className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                <TbLogout2 className="w-[22px] h-[22px]"/>
                                <span>로그아웃</span>
                            </Button>
                        </SheetClose>
                    }
                </div>
            </SheetContent>
        </Sheet>
    )

    return (
        <div
            className={`flex fixed justify-between top-0 left-0 right-0 z-20 bg-white bg-opacity-70 dark:bg-[#1E1E1E] dark:bg-opacity-70 backdrop-blur py-2
                ${location.pathname === "/w" ? 'px-5' : 'px-3 md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]'}`}>
            <div className="flex items-center space-x-3">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate('/')
                    }}
                >
                    {theme === "light" ?
                        <img className="w-[60px] h-[60px]" src="../imgs/memocode_bg_transform_black.png"
                             alt="memocodeLogo"/>
                        :
                        <img className="w-[60px] h-[60px]" src="../imgs/memocode_bg_transform_white.png"
                             alt="memocodeLogo"/>
                    }
                </div>

                {/* 테마 */}
                <ThemeToggle/>
            </div>

            {/* hidden md:flex */}
            <div className="hidden md:flex items-center space-x-2">
                {TopBar__DisplayMoreMd}
            </div>

            {/* flex md:hidden */}
            <div className="flex flex-1 md:hidden justify-end">
                {TopBar__DisplayBelowMd}
            </div>
        </div>
    )
}

export default TopBar;