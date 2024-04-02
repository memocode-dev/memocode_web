import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {Outlet, useNavigate, useParams} from "react-router-dom";
import {IoLogoGithub, IoMail} from "react-icons/io5";
import {useContext} from "react";
import UserContext from "@/context/UserContext.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import Avatar from "react-avatar";

const MyBlogCommon = () => {
    const {username} = useParams();
    const {user_info} = useContext(UserContext)
    const navigate = useNavigate();

    if (!/^@[a-z\d]+$/.test(username as string)) {
        throw new Error();
    }

    return (
        <div
            className="flex flex-1 flex-col mt-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] lg:mx-[120px] xl:mx-[280px] 2xl:mx-[420px]">

            {/* sm 이하 프로필 */}
            <div className="flex flex-col sm:hidden bg-gray-100 dark:bg-neutral-700 p-5 space-y-2">
                <div className="flex space-x-3">
                    <Avatar
                        name={user_info?.username}
                        size="50"
                        round="5px"/>

                    <div className="flex flex-col cursor-default">
                        <span className="text-lg font-bold">{user_info && user_info.username}</span>
                        <span
                            className="text-sm font-semibold text-gray-700 dark:text-gray-400">Frontend_Developer</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <div className="flex items-center space-x-1">
                        <IoLogoGithub className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                        <div
                            className="text-xs text-gray-500 dark:text-gray-300 border-b border-b-transparent hover:border-b-indigo-500 dark:hover:border-b-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer">
                            https://github.com/miruy
                        </div>
                    </div>

                    <div className="flex items-center space-x-1">
                        <IoMail className="w-5 h-5 text-gray-600 dark:text-gray-400"/>
                        <div
                            className="text-xs text-gray-500 dark:text-gray-300 border-b border-b-transparent hover:border-b-indigo-500 dark:hover:border-b-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-400 cursor-pointer">
                            dbflarla4966@naver.com
                        </div>
                    </div>
                </div>
            </div>

            {/* sm 이상 프로필 */}
            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-neutral-700 space-x-5 p-5">
                <Avatar
                    name={user_info?.username}
                    size="180"
                    round="5px"/>

                <div className="flex-1 flex flex-col space-y-1">
                    <div className="flex flex-col cursor-default">
                        <span className="text-2xl font-bold">{user_info && user_info.username}</span>
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
                            if (user_info) {
                                navigate(`/@${user_info.username}/about`)
                            }
                        }}>
                        소개
                    </TabsTrigger>
                    <TabsTrigger
                        value="posts"
                        className="data-[state=active]:bg-background"
                        onClick={() => {
                            if (user_info) {
                                navigate(`/@${user_info.username}/posts`)
                            }
                        }}>
                        글
                    </TabsTrigger>
                    <TabsTrigger
                        value="series"
                        className="data-[state=active]:bg-background"
                        onClick={() => {
                            if (user_info) {
                                navigate(`/@${user_info.username}/series`)
                            }
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