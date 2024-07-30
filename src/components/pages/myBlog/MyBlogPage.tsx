'use client'

import {useParams, usePathname} from "next/navigation";
import Avatar from "react-avatar";
import {useContext, useState} from "react";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {FaA, FaQ} from "react-icons/fa6";
import MyBlogTabsContent from "@/components/page_components/myBlog/MyBlogTabsContent";
import {faker} from "@faker-js/faker";
import {IoMailOutline, IoLogoGithub, IoLinkOutline} from "react-icons/io5";
import {useKeycloak} from "@/context/KeycloakContext";
import {FaUserCog} from "react-icons/fa";
import {ModalContext, ModalTypes} from "@/context/ModalContext";
import MyBlogUpdateProfileModal from "@/components/page_components/myBlog/MyBlogUpdateProfileModal";
import MyBlogUpdateProfileAddFiledModal from "@/components/page_components/myBlog/MyBlogUpdateProfileAddFiledModal";

const MyBlogPage = () => {

    const {openModal} = useContext(ModalContext)
    const {isLogined, user_info} = useKeycloak()
    const pathname = usePathname()
    const parts = pathname.split('/'); // 현재 URL을 '/'로 분할
    const [activeTab, setActiveTab] = useState<string>(parts[parts.length - 1]);

    const {ascii_annotation_username} = useParams<{ ascii_annotation_username: string }>() // %40dbflarla4966
    const annotation_username = ascii_annotation_username.replace("%40", "@") // @dbflarla4966
    const username = ascii_annotation_username.replace("%40", "") // dbflarla4966

    const handleTab = (path: string) => {
        setActiveTab(path);

        // 현재 URL의 마지막 문자열이 @username이면
        if (parts[parts.length - 1] === annotation_username) {
            const newUrl = `${pathname}/${path}`; // 현재 URL 맨끝에 path 추가
            typeof window !== 'undefined' && window.history.pushState({}, '', newUrl);
        }

        // 현재 URL의 마지막 문자열이 @username이 아니라면
        else {
            parts[parts.length - 1] = path; // 현재 URL 맨끝 문자열을 path로 변경
            const newUrl = parts.join('/');
            typeof window !== 'undefined' && window.history.pushState({}, '', newUrl);
        }
    };

    const fakeData = {
        // introduce: "",
        // email: "",
        // thumbnail: ""
        introduce: faker.lorem.lines({min: 0, max: 2}),
        email: "dbflarla4966@naver.com",
        profile: faker.image.url()
    }


    const TabButtons = (
        <TabsList className="grid w-full grid-cols-4 bg-secondary rounded h-auto p-1.5 gap-1.5 my-5">
            {/* 내 소개 탭 버튼 */}
            <TabsTrigger
                value="about"
                className={`hover:bg-background rounded ${parts[parts.length - 1] === annotation_username ? `bg-background` : `bg-secondary`}`}
                onClick={() => handleTab("about")}
            >
                <div>소개</div>
            </TabsTrigger>

            {/* 내 메모 탭 버튼 */}
            <TabsTrigger
                value="memos"
                className="data-[state=active]:bg-background hover:bg-background rounded"
                onClick={() => handleTab("memos")}
            >
                <div>메모</div>
            </TabsTrigger>

            {/* 내 시리즈 탭 버튼 */}
            <TabsTrigger
                value="series"
                className="data-[state=active]:bg-background hover:bg-background rounded"
                onClick={() => handleTab("series")}
            >
                <div>시리즈</div>
            </TabsTrigger>

            {/* 질문&답변 탭 버튼 */}
            <TabsTrigger
                value="q&a"
                className="data-[state=active]:bg-background hover:bg-background rounded"
                onClick={() => handleTab("q&a")}
            >
                <div className="flex items-center">
                    <FaQ className="w-3.5 h-3.5 mr-0.5"/>
                    &
                    <FaA className="w-3.5 h-3.5 ml-0.5"/>
                </div>
            </TabsTrigger>
        </TabsList>
    )

    const UserProfile = (
        <>
            <div>
                <div className="userInfo_username_css">{username}</div>
                {fakeData.introduce &&
                    <div
                        className="userInfo_introduce_css text-gray-500 dark:text-gray-400">{fakeData.introduce}</div>
                }
                {!fakeData.introduce &&
                    <div className="text-gray-500 dark:text-gray-400">소개글을 작성해보세요!</div>
                }
            </div>

            <div className="text-gray-600 dark:text-gray-300">
                {fakeData.email &&
                    <div className="flex items-center space-x-1">
                        <IoMailOutline className="w-5 h-5 text-foreground"/>
                        <div
                            className="tracking-wide hover:text-primary hover:underline hover:underline-offset-2">{fakeData.email}</div>
                    </div>
                }
                {/*{fakeData.git &&*/}
                {/*    <div className="flex items-center space-x-1">*/}
                {/*        <IoLogoGithub className="w-5 h-5 text-foreground"/>*/}
                {/*        <div*/}
                {/*            className="tracking-wide hover:text-primary hover:underline hover:underline-offset-2">{fakeData.git}</div>*/}
                {/*    </div>*/}
                {/*}*/}
                {/*{fakeData.addedLink && fakeData.addedLink.map((link, index) => {*/}
                {/*    return (*/}
                {/*        <div key={index} className="flex items-center space-x-1">*/}
                {/*            <IoLinkOutline className="w-5 h-5 text-foreground"/>*/}
                {/*            <div*/}
                {/*                className="tracking-wide hover:text-primary hover:underline hover:underline-offset-2">{link}</div>*/}
                {/*        </div>*/}
                {/*    )*/}
                {/*})}*/}
            </div>
        </>
    )

    return (
        <>
            <div className="flex flex-col bg-secondary rounded p-6">
                <div className="profile_css">
                    <div className="avatar-size">
                        <Avatar
                            name={username}
                            size="100%"
                            round="5px"/>
                    </div>

                    <div className="userInfo_css relative">
                        {isLogined && user_info.username === username &&
                            <FaUserCog
                                onClick={() => {
                                    openModal({
                                        name: ModalTypes.MY_BLOG_UPDATE_PROFILE,
                                        data: fakeData
                                    })
                                }}
                                className="absolute top-0 right-0 w-6 h-6 text-gray-600 dark:text-gray-300 hover:text-primary"/>
                        }

                        <div className="space-y-3">
                            {/* 유저 프로필 */}
                            {UserProfile}
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue={activeTab} className="w-full justify-center">
                {/* 탭 버튼 */}
                {TabButtons}

                {/* 탭 내용 */}
                <MyBlogTabsContent lastPath={parts[parts.length - 1]} annotation_username={annotation_username}/>
            </Tabs>

            <MyBlogUpdateProfileModal/>
            <MyBlogUpdateProfileAddFiledModal/>
        </>
    )
}

export default MyBlogPage;