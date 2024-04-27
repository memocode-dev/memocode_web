import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {Outlet, useLocation, useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import Avatar from "react-avatar";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {IoLogoGithub, IoMail} from "react-icons/io5";
import {Label} from "@/components/ui/label.tsx";
import {FaLink} from "react-icons/fa6";
import {RiAddLine} from "react-icons/ri";
import {FaUserEdit} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

interface updateProfileType {
    shortIntroduction: string,
    git: string,
    email: string,
    link_1: string,
    link_2: string
}

const MyBlogPageLayout = () => {

    const {username} = useParams()
    const formattedUsername = username?.replace(/^@/, "") // @ 제거

    const {user_info, isLogined} = useKeycloak();
    const navigate = useNavigate()
    const {pathname} = useLocation()
    const tabPath = pathname.split('/').filter(Boolean)[1]

    const [handleProfile, setHandleProfile] = useState(false)
    const [handleAddLink, sethandleAddLink] = useState(0)
    const updateProfile = useForm({
        defaultValues: {
            shortIntroduction: "",
            git: "",
            email: "",
            link_1: "",
            link_2: ""
        }
    });

    if (!/^@[a-z\d]+$/.test(username as string)) {
        throw new Error();
    }

    const handleUpdateProfile = (data: updateProfileType) => {
        console.log(data)
    }

    const cancelUpdateProfile = () => {
        updateProfile.reset(
            {
                shortIntroduction: "",
                git: "",
                email: "",
                link_1: "",
                link_2: ""
            }
        )
        sethandleAddLink(0)
        setHandleProfile(false)
    }

    const MyBlogPageLayout__ProfileEditButton = (
        <Tooltip delayDuration={100}>
            <TooltipTrigger className="absolute -right-1 top-0" asChild>
                <Button type="button" className="bg-transparent hover:bg-transparent">
                    <FaUserEdit
                        onClick={() => {
                            setHandleProfile(true)
                        }}
                        className="w-5 h-5 text-indigo-400 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-500 cursor-pointer"/>

                </Button>
            </TooltipTrigger>
            <TooltipContent
                side="bottom"
                className="bg-black bg-opacity-70 text-gray-200 py-1 px-2 rounded-none shadow-none border-0 text-xs">
                <p>프로필 편집</p>
            </TooltipContent>
        </Tooltip>
    )

    const MyBlogPageLayout__ProfileEditForm__ShortIntroduction = (
        <>
            <Label className="text-md" htmlFor="shortIntroduction">한 줄 소개</Label>
            <textarea
                {...updateProfile.register("shortIntroduction")}
                id="shortIntroduction"
                rows={2}
                className="w-[100%] px-2 text-md placeholder:text-gray-400 resize-none
                                           border dark:bg-neutral-700 dark:border-neutral-600 rounded outline-none py-0.5
                                           focus-visible:ring-0 focus-visible:ring-offset-0"/>
        </>
    )

    const MyBlogPageLayout__ProfileEditForm__git = (
        <>
            <IoLogoGithub className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
            <Input
                {...updateProfile.register("git")}
                type="text"
                placeholder="깃허브 정보를 등록해보세요"
                className="w-[100%] h-[30px] px-2 text-sm placeholder:text-gray-400
                                    dark:bg-neutral-700 dark:border-neutral-600 rounded
                                    focus-visible:ring-0 focus-visible:ring-offset-0"/>
        </>
    )

    const MyBlogPageLayout__ProfileEditForm__email = (
        <>
            <IoMail className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
            <Input
                {...updateProfile.register("email")}
                type="text"
                placeholder="이메일 정보를 등록해보세요"
                className="w-[100%] h-[30px] px-2 text-sm placeholder:text-gray-400
                                    dark:bg-neutral-700 dark:border-neutral-600 rounded
                                    focus-visible:ring-0 focus-visible:ring-offset-0"/>
        </>
    )

    const MyBlogPageLayout__ProfileEditForm__AddLink_0 = (
        <>
            <FaLink className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0"/>
            <Button
                type="button"
                onClick={() => {
                    sethandleAddLink(handleAddLink + 1)
                }}
                className="w-fit h-fit bg-transparent hover:bg-white dark:hover:bg-neutral-800 p-0.5 rounded
                                           text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
                <RiAddLine className="w-5 h-5"/>
            </Button>
        </>
    )

    const MyBlogPageLayout__ProfileEditForm__AddLink_1Or2 = (
        <>
            <div className="flex flex-1 items-center space-x-2">
                <FaLink
                    className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mr-0.5"/>
                <Input
                    {...updateProfile.register("link_1")}
                    type="text"
                    placeholder="소셜 정보를 등록해보세요"
                    className="w-[100%] h-[30px] px-2 text-sm placeholder:text-gray-400
                                                    dark:bg-neutral-700 dark:border-neutral-600 rounded
                                                    focus-visible:ring-0 focus-visible:ring-offset-0"/>
            </div>

            <Button
                type="button"
                onClick={() => {
                    sethandleAddLink(handleAddLink + 1)
                }}
                className={`${handleAddLink === 2 ? `hidden` : `flex`} w-fit h-fit bg-transparent hover:bg-white dark:hover:bg-neutral-800 p-0.5 rounded
                                                   text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white`}
            >
                <RiAddLine className="w-5 h-5"/>
            </Button>
        </>
    )

    const MyBlogPageLayout__ProfileEditForm__AddLink_2 = (
        <>
            <FaLink
                className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0 mr-0.5"/>
            <Input
                {...updateProfile.register("link_2")}
                type="text"
                placeholder="소셜 정보를 등록해보세요"
                className="w-[100%] h-[30px] px-2 text-sm placeholder:text-gray-400
                                    dark:bg-neutral-700 dark:border-neutral-600 rounded
                                    focus-visible:ring-0 focus-visible:ring-offset-0"/>
        </>
    )

    const MyBlogPageLayout__ProfileEditForm = (
        <form
            className="bg-transparent flex-1 space-y-2 pt-3"
            onSubmit={updateProfile.handleSubmit(handleUpdateProfile)}
        >
            {/* 한 줄 소개 */}
            <div className="grid w-full items-center gap-0.5">
                {MyBlogPageLayout__ProfileEditForm__ShortIntroduction}
            </div>

            <div
                className="flex flex-1 flex-col md:flex-row space-x-0 space-y-2 md:space-y-0 md:space-x-2">
                {/* 깃 */}
                <div className="flex flex-1 items-center space-x-2">
                    {MyBlogPageLayout__ProfileEditForm__git}
                </div>

                {/* 이메일 */}
                <div className="flex flex-1 items-center space-x-2">
                    {MyBlogPageLayout__ProfileEditForm__email}
                </div>
            </div>

            {/* 추가링크가 0개일 경우 */}
            {handleAddLink === 0 &&
                <div className="flex items-center space-x-2.5">
                    {MyBlogPageLayout__ProfileEditForm__AddLink_0}
                </div>
            }

            <div
                className="flex flex-1 flex-col space-y-2">

                {/* 추가링크가 1개 또는 2개일 경우 */}
                {handleAddLink > 0 && handleAddLink <= 2 &&
                    <div className="flex-1 flex space-x-2 items-center">
                        {MyBlogPageLayout__ProfileEditForm__AddLink_1Or2}
                    </div>
                }

                {/* 추가링크가 2개일 경우 */}
                {handleAddLink === 2 &&
                    <div className="flex flex-1 items-center space-x-2">
                        {MyBlogPageLayout__ProfileEditForm__AddLink_2}
                    </div>
                }
            </div>

            <div className="flex space-x-2">
                <Button
                    type="submit"
                    className="w-[100%] h-auto bg-primary hover:bg-primary-hover rounded focus-visible:ring-0">
                    <div className="text-primary-foreground text-xs">등록</div>
                </Button>

                <Button
                    onClick={cancelUpdateProfile}
                    className="w-[100%] h-auto text-xs rounded text-gray-700 dark:text-gray-400
                                        bg-gray-200 hover:bg-gray-50 dark:bg-neutral-600 dark:hover:bg-neutral-800">
                    취소
                </Button>
            </div>
        </form>
    )

    const MyBlogPageLayout__MyIntroductionTabButton = (
        <TabsTrigger
            value="about"
            className="data-[state=active]:bg-background"
            onClick={() => {
                navigate(`/@${formattedUsername}/about`)
            }}>
            소개
        </TabsTrigger>
    )

    const MyBlogPageLayout__MyMemoTabButton = (
        <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-background"
            onClick={() => {
                navigate(`/@${formattedUsername}/memos`)
            }}>
            글
        </TabsTrigger>
    )

    const MyBlogPageLayout__MySeriesTabButton = (
        <TabsTrigger
            value="series"
            className="data-[state=active]:bg-background"
            onClick={() => {
                navigate(`/@${formattedUsername}/series`)
            }}>
            시리즈
        </TabsTrigger>
    )

    return (
        <div
            className="flex flex-1 flex-col mt-20 bg-background overflow-y-auto overflow-x-hidden mx-3 sm:mx-[50px] lg:mx-[120px] xl:mx-[280px] 2xl:mx-[420px]">

            <div className="flex flex-col relative bg-gray-100 dark:bg-neutral-700 p-10">
                <div className="profile_css">
                    <div className="avatar-size">
                        <Avatar
                            name={formattedUsername}
                            size="100%"
                            round="5px"/>
                    </div>

                    {/* 프로필 편집 버튼 */}
                    {user_info.username === formattedUsername && !handleProfile &&
                        <TooltipProvider>
                            {MyBlogPageLayout__ProfileEditButton}
                        </TooltipProvider>
                    }

                    {/* 프로필 편집 폼 */}
                    <div className="flex flex-col flex-1 profile_edit">
                        <span
                            className="text-center sm:text-start text-3xl font-bold cursor-default">{formattedUsername}</span>

                        {/* 프로필 값이 없다면 */}
                        {Object.values(updateProfile.getValues()).every(value => value === "") &&
                            <>
                                {isLogined && !handleProfile &&
                                    <div className="text-sm text-gray-400">
                                        우측 상단 프로필 편집을 눌러 {user_info?.username}님의 소셜 정보를 등록해보세요!
                                    </div>
                                }
                            </>
                        }

                        {handleProfile &&
                            <>{MyBlogPageLayout__ProfileEditForm}</>
                        }

                    </div>
                </div>
            </div>

            {/* 탭 버튼 */}
            <Tabs defaultValue={tabPath} className="my-2 w-full justify-center">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-neutral-700 rounded-none">
                    {/* 내 소개 탭 버튼 */}
                    {MyBlogPageLayout__MyIntroductionTabButton}

                    {/* 내 글 탭 버튼 */}
                    {MyBlogPageLayout__MyMemoTabButton}

                    {/* 내 시리즈 탭 버튼 */}
                    {MyBlogPageLayout__MySeriesTabButton}
                </TabsList>
            </Tabs>

            {/* 탭 내용 */}
            <Outlet/>

            {/* 위로 이동 버튼 */}
            <UpToDownButton direction="up"/>

        </div>
    );
}

export default MyBlogPageLayout