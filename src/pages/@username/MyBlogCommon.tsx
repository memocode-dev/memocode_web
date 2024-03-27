import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {IoLogoGithub, IoMail} from "react-icons/io5";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";

const MyBlogCommon = () => {

    const {user_info} = useContext(UserContext)
    const navigate = useNavigate()

    return (
        <div
            className="flex flex-1 flex-col mt-20 bg-background overflow-y-auto mx-5 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">

            {/* 프로필 */}
            <div className="flex items-center bg-gray-100 dark:bg-neutral-700 space-x-5 p-5">
                <Avatar className="w-[200px] h-[200px] rounded">
                    <AvatarImage src="https://github.com/shadcn.png"/>
                    <AvatarFallback>
                        <Skeleton className="w-[200px] h-[200px] rounded"/>
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 flex flex-col space-y-2">
                    <div className="flex flex-col cursor-default">
                        <span className="text-2xl font-bold">{user_info.username}</span>
                        <span
                            className="text-lg font-semibold text-gray-700 dark:text-gray-400">Frontend_Developer</span>
                    </div>

                    <div className="flex items-center space-x-1">
                        <IoLogoGithub className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
                        <div
                            className="text-gray-500 dark:text-gray-300 border-b border-b-transparent hover:border-b-indigo-500 dark:hover:border-b-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer">
                            https://github.com/miruy
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <IoMail className="w-6 h-6 text-gray-600 dark:text-gray-400"/>
                        <div
                            className="text-gray-500 dark:text-gray-300 border-b border-b-transparent hover:border-b-indigo-500 dark:hover:border-b-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer">
                            dbflarla4966@naver.com
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 버튼 */}
            <Tabs defaultValue="about" className="my-2 w-full justify-center">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-neutral-700 rounded-none">
                    <TabsTrigger
                        value="about"
                        className="data-[state=active]:bg-background"
                        onClick={() => {
                            navigate(`/@${user_info.username}/about`)
                        }}>
                        소개
                    </TabsTrigger>
                    <TabsTrigger
                        value="posts"
                        className="data-[state=active]:bg-background"
                        onClick={() => {
                            navigate(`/@${user_info.username}/posts`)
                        }}>
                        글
                    </TabsTrigger>
                    <TabsTrigger
                        value="series"
                        className="data-[state=active]:bg-background"
                        onClick={() => {
                            navigate(`/@${user_info.username}/series`)
                        }}>
                        시리즈
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* 탭 내용 */}
            <Outlet/>

            {/* 위로 이동 버튼 */}
            <UpToDownButton direction="up"/>

        </div>
    );
}

export default MyBlogCommon