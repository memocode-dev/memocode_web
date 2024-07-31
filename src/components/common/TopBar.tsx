'use client'

import Avatar from 'react-avatar';
import ThemeToggle from "@/components/theme/ThemeToggle";
import {Bounce, toast,} from "react-toastify";
import {RiMenuFoldFill, RiMenuUnfoldFill} from "react-icons/ri";
import {TbWriting} from "react-icons/tb";
import {MdOutlineQuestionAnswer, MdOutlineRoofing} from "react-icons/md";
import {useTheme} from "@/context/ThemeContext";
import {useKeycloak} from "@/context/KeycloakContext";
import {LiaBrushSolid, LiaDoorOpenSolid} from "react-icons/lia";
import ColorPicker from "@/components/utils/ColorPicker";
import {Button} from "@/components/ui/button"
import {BsQuestionSquare} from "react-icons/bs";
import {Sheet, SheetClose, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {usePathname, useRouter} from "next/navigation";
import {GiHand} from "react-icons/gi";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {LuLampDesk} from "react-icons/lu";

const TopBar = () => {

    const {login: keycloakLogin, user_info: keycloakUserInfo, isLogined, logout: keycloakLogout} = useKeycloak()
    const router = useRouter()
    const pathname = usePathname()
    const {theme, primaryColor, fontColor, handlePrimaryColor, handleFontColor} = useTheme()

    const handleTheme = (primaryColor: string, fontColor: string) => {
        handlePrimaryColor(() => primaryColor)
        handleFontColor(() => fontColor)
    }

    const TopBar__DisplayMoreMd = (
        <>
            {/* Q&A */}
            <Button
                onClick={() => {
                    typeof window !== 'undefined' && router.push("/questions")
                }}
                className="text-foreground space-x-1.5 rounded bg-transparent hover:bg-secondary dark:hover:bg-neutral-700 h-fit px-3 py-2">
                <BsQuestionSquare className="w-[18px] h-[18px]"/>
                <span className="text-[15px]">질문&답변</span>
            </Button>

            {/* 메모 */}
            <Button
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

                    typeof window !== 'undefined' && router.push('/w');
                }}
                className="text-foreground space-x-1 rounded bg-transparent hover:bg-secondary dark:hover:bg-neutral-700 h-fit px-3 py-2">
                <TbWriting className="w-[22px] h-[22px]"/>
                <span className="text-[15px]">메모만들기</span>
            </Button>

            {!isLogined ?
                <Button
                    onClick={keycloakLogin}
                    className="text-foreground space-x-1.5 rounded bg-transparent hover:bg-secondary dark:hover:bg-neutral-700 h-fit px-3 py-2">
                    <LiaDoorOpenSolid className="w-[24px] h-[24px]"/>
                    <span className="text-[15px]">로그인</span>
                </Button>
                :
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                <div className="flex space-x-1">
                                    <Avatar
                                        name={keycloakUserInfo.username}
                                        size="23"
                                        round="3px"/>
                                    <div className="text-[15px]">{keycloakUserInfo.username}</div>
                                </div>
                            </NavigationMenuTrigger>

                            <NavigationMenuContent className="">
                                <div className="grid grid-rows-2 gap-1 p-1 w-32">
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
                                        className="flex w-full py-0.5 px-2 space-x-1.5 items-center text-foreground hover:bg-secondary dark:hover:bg-secondary-hover cursor-pointer rounded">
                                        <LuLampDesk className="w-[20px] h-[20px]"/>
                                        <div className="text-[15px]">내 블로그</div>
                                    </div>

                                    <div
                                        onClick={keycloakLogout}
                                        className="flex w-full py-0.5 px-1 space-x-1.5 items-center text-foreground hover:bg-secondary dark:hover:bg-secondary-hover cursor-pointer rounded">
                                        <LiaDoorOpenSolid className="w-[24px] h-[24px]"/>
                                        <div className="text-[15px]">로그아웃</div>
                                    </div>
                                </div>
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
                    className="h-fit p-1.5 bg-transparent rounded hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50">
                    <RiMenuFoldFill className="w-6 h-6 text-foreground"/>
                </Button>
            </SheetTrigger>

            <SheetContent className="z-[1000] px-4 pt-14 border-l-background">
                <SheetClose className="fixed top-3">
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={() => {
                                        typeof window !== 'undefined' && router.push("/")
                                    }}
                                    className="h-fit p-1.5 bg-transparent rounded hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50">
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
                        className="h-fit p-1.5 bg-transparent rounded hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50">
                        <RiMenuUnfoldFill className="w-6 h-6 text-foreground"/>
                    </Button>
                </SheetClose>

                <div className="flex flex-col mt-3">
                    {/* 내 블로그 */}
                    <SheetClose>
                        <Button
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
                            className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-1.5">
                            <LuLampDesk className="w-[20px] h-[20px]"/>
                            <span>내 블로그</span>
                        </Button>
                    </SheetClose>

                    {/* 질문 & 답변 */}
                    {pathname !== "/questions" &&
                        <SheetClose>
                            <Button
                                onClick={() => {
                                    typeof window !== 'undefined' && router.push("/questions")
                                }}
                                className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                <BsQuestionSquare className="w-[17px] h-[17px]"/>
                                <span>질문&답변</span>
                            </Button>
                        </SheetClose>
                    }

                    {/* 질문 사이드바 */}
                    {pathname === "/questions" &&
                        <>
                            {/* Q&A 모아보기 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        typeof window !== 'undefined' && router.push("/questions")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <MdOutlineQuestionAnswer className="w-[18px] h-[18px]"/>
                                    <span>Q&A 둘러보기</span>
                                </Button>
                            </SheetClose>

                            {/* 질문 하러가기 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        typeof window !== 'undefined' && router.push("/questions/ask")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <GiHand className="w-[18px] h-[18px]"/>
                                    <span>질문하기</span>
                                </Button>
                            </SheetClose>
                        </>
                    }

                    {/* 메모 */}
                    {pathname !== "/questions" &&
                        <SheetClose>
                            <Button
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

                                    typeof window !== 'undefined' && router.push('/w');
                                }}
                                className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-1.5">
                                <TbWriting className="w-[22px] h-[22px]"/>
                                <span>메모만들기</span>
                            </Button>
                        </SheetClose>
                    }

                    {!isLogined ?
                        <SheetClose>
                            <Button
                                onClick={keycloakLogin}
                                className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                <LiaDoorOpenSolid className="w-[25px] h-[25px]"/>
                                <span>로그인</span>
                            </Button>
                        </SheetClose>
                        :
                        <SheetClose>
                            <Button
                                onClick={keycloakLogout}
                                className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-1 text-gray-800 dark:text-gray-300 space-x-1.5">
                                <LiaDoorOpenSolid className="w-[25px] h-[25px]"/>
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
            className={`flex fixed justify-between top-0 left-0 right-0 z-10 bg-background/5 backdrop-blur py-4
                ${pathname === "/w" ? 'px-5' : 'px-3 md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]'}`}>
            <div className="flex items-center space-x-2">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        typeof window !== 'undefined' && router.push('/')
                    }}
                >
                    <div
                        className="logo-font text-2xl text-primary pt-1">MEMOCODE
                    </div>
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost"
                                className="hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit w-fit px-2">
                            <LiaBrushSolid className="w-[23.5px] h-[23.5px]"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit space-y-4 cursor-default">
                        <div>
                            <span className="text-[15px] font-medium leading-none">테마</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                원하는 테마를 선택하세요.
                            </p>
                            <div className="flex py-2">
                                <ThemeToggle/>
                            </div>
                        </div>

                        <div>
                            <span className="text-[15px] font-medium leading-none">색</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                원하는 색을 선택하세요.
                            </p>
                            <div className="py-2">
                                <div className="flex justify-around">
                                    <ColorPicker handleTheme={handleTheme}/>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
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