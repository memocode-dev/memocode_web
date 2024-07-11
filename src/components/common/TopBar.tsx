import {useContext} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Avatar from 'react-avatar';
import ThemeToggle from "@/components/theme/ThemeToggle.tsx";
import {Bounce, toast,} from "react-toastify";
import {FaDoorOpen} from "react-icons/fa";
import {Sheet, SheetClose, SheetContent, SheetTrigger} from "@/components/ui/sheet.tsx";
import {RiMenuFoldFill, RiMenuUnfoldFill} from "react-icons/ri";
import {TbWriting} from "react-icons/tb";
import {MdOutlineRoofing, MdQuestionAnswer} from "react-icons/md";
import {FaQ} from "react-icons/fa6";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import '@/css/index.css'
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {LiaBrushSolid} from "react-icons/lia";
import ColorPicker from "@/components/utils/ColorPicker.tsx";
import {Button} from "@/components/ui/button"
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {BsQuestionSquare} from "react-icons/bs";

const TopBar = () => {

    const {login: keycloakLogin, user_info: keycloakUserInfo, isLogined, logout: keycloakLogout} = useKeycloak()
    const navigate = useNavigate()
    const location = useLocation()
    const {theme} = useContext(ThemeContext)

    const handleTheme = (color: string, fontColor: string) => {
        document.documentElement.style.setProperty('--primary', color)
        document.documentElement.style.setProperty('--primary-foreground', fontColor)
        localStorage.setItem('themeColor', color)
        localStorage.setItem('fontColor', fontColor)
    }

    const TopBar__DisplayMoreMd = (
        <>
            {/* Q&A */}
            <Button
                onClick={() => {
                    navigate("/questions")
                }}
                className="text-foreground space-x-1.5 rounded bg-transparent hover:bg-secondary dark:hover:bg-neutral-700">
                <BsQuestionSquare className="w-[19px] h-[19px]"/>
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
                        });
                        return;
                    }

                    navigate('/w');
                }}
                className="text-foreground space-x-1 rounded bg-transparent hover:bg-secondary dark:hover:bg-neutral-700">
                <TbWriting className="w-[23.5px] h-[23px]"/>
                <span className="text-[15px]">메모만들기</span>
            </Button>

            {/*내 블로그*/}
            {/*<Button*/}
            {/*    onClick={() => {*/}
            {/*        if (!isLogined) {*/}
            {/*            toast.warn("로그인 후 이용 가능합니다.", {*/}
            {/*                position: "bottom-right",*/}
            {/*                theme: theme,*/}
            {/*                transition: Bounce,*/}
            {/*            });*/}
            {/*            return;*/}
            {/*        }*/}

            {/*        navigate(`/@${keycloakUserInfo.username}/about`)*/}
            {/*    }}*/}
            {/*    className="rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 px-2.5 h-fit text-gray-800 dark:text-gray-300 space-x-1.5">*/}
            {/*    <SiBloglovin className="w-[17px] h-[17px]"/>*/}
            {/*    <span>내 블로그</span>*/}
            {/*</Button>*/}

            {!isLogined ?
                <Button
                    onClick={keycloakLogin}
                    className="text-foreground space-x-1.5 rounded bg-transparent hover:bg-secondary dark:hover:bg-neutral-700">
                    <FaDoorOpen className="w-[21px] h-[21px]"/>
                    <span className="text-[15px]">로그인</span>
                </Button>
                :
                <HoverCard openDelay={50} closeDelay={50}>
                    <HoverCardTrigger asChild>
                        <Button variant={null} className="space-x-1">
                            <Avatar
                                name={keycloakUserInfo.username}
                                size="23"
                                round="3px"/>
                            <div className="text-[15px]">{keycloakUserInfo.username}</div>
                        </Button>
                    </HoverCardTrigger>
                    <HoverCardContent
                        sideOffset={2} align="end"
                        className="flex flex-1 w-fit h-[35px] p-1 cursor-pointer md:mr-[21px] rounded">
                        <div
                            onClick={keycloakLogout}
                            className="flex space-x-1.5 justify-center items-center text-foreground hover:bg-secondary w-[90px]">
                            <FaDoorOpen className="w-[21px] h-[21px]"/>
                            <div className="text-[15px]">로그아웃</div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
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

                <div className="flex flex-col">
                    {location.pathname !== "/questions" &&
                        <>
                            {/* 질문 & 답변 */}
                            <SheetClose>
                                <Button
                                    onClick={() => {
                                        navigate("/questions")
                                    }}
                                    className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
                                    <BsQuestionSquare className="w-[18px] h-[18px]"/>
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
                                    className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
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
                                    className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-2 text-gray-800 dark:text-gray-300 space-x-2">
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
                                    toast.warn("로그인 후 이용 가능합니다.", {
                                        position: "bottom-right",
                                        theme: theme,
                                        transition: Bounce,
                                    });
                                    return;
                                }

                                navigate('/w');
                            }}
                            className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-1.5">
                            <TbWriting className="w-[22px] h-[22px]"/>
                            <span>메모만들기</span>
                        </Button>
                    </SheetClose>

                    {/* 내 블로그 */}
                    {/*<SheetClose>*/}
                    {/*    <Button*/}
                    {/*        onClick={() => {*/}
                    {/*            if (!isLogined) {*/}
                    {/*                toast.warn("로그인 후 이용 가능합니다.", {*/}
                    {/*                    position: "bottom-right",*/}
                    {/*                    theme: theme,*/}
                    {/*                    transition: Bounce,*/}
                    {/*                });*/}
                    {/*                return;*/}
                    {/*            }*/}

                    {/*            navigate(`/@${keycloakUserInfo.username}/about`)*/}
                    {/*        }}*/}
                    {/*        className="w-full justify-start rounded bg-transparent hover:bg-gray-100 dark:hover:bg-neutral-700 h-fit px-3 text-gray-800 dark:text-gray-300 space-x-1.5">*/}
                    {/*        <SiBloglovin className="w-[17px] h-[17px]"/>*/}
                    {/*        <span>내 블로그</span>*/}
                    {/*    </Button>*/}
                    {/*</SheetClose>*/}

                    {!isLogined ?
                        <SheetClose>
                            <Button
                                onClick={keycloakLogin}
                                className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                <FaDoorOpen className="w-[21px] h-[21px]"/>
                                <span>로그인</span>
                            </Button>
                        </SheetClose>
                        :
                        <SheetClose>
                            <Button
                                onClick={keycloakLogout}
                                className="w-full justify-start rounded bg-transparent hover:bg-neutral-200/50 dark:hover:bg-neutral-600/50 h-fit px-1.5 text-gray-800 dark:text-gray-300 space-x-2">
                                <FaDoorOpen className="w-[21px] h-[21px]"/>
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
            className={`flex fixed justify-between top-0 left-0 right-0 z-20 bg-background/10 backdrop-blur py-4
                ${location.pathname === "/w" ? 'px-5' : 'px-3 md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]'}`}>
            <div className="flex items-center space-x-2">
                <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                        navigate('/')
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