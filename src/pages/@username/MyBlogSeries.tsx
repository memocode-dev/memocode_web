import {faker} from "@faker-js/faker";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import userContext from "@/context/UserContext.tsx";

const MyBlogSeries = () => {

    const {user_info} = useContext(userContext)
    const navigate = useNavigate()

    // 가짜 데이터 생성
    const daysPast = Math.floor(Math.random() * 730);
    const updatedAt = new Date();
    updatedAt.setDate(updatedAt.getDate() - daysPast);

    const generateData = (numItems: number) => Array.from({length: numItems}, () => ({
        title: faker.lorem.sentence(),
        summary: faker.lorem.paragraph(),
        img: faker.image.imageUrl(),
        // img:"",
        totalPost: faker.datatype.number({min: 1, max: 100}),
        updatedAt: updatedAt
    }));

    const fakeDatas = generateData(10);

    return (
        <div
            className="flex flex-1 justify-center border border-gray-200 dark:border-neutral-700 bg-transparent rounded-none p-5 my-5">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8 bg-transparent">

                {fakeDatas.map((fakeData, index) => {
                    return (
                        <div
                            key={index}
                            onClick={() => {
                                navigate(`/@${user_info?.username}/series/${fakeData.title}`)
                            }}
                            className="flex-1 flex flex-col scale-100 cursor-pointer">
                            {fakeData.img &&
                                <img
                                    className="w-full h-[70%]"
                                    src={fakeData.img}
                                    alt="seriesThumbNail"
                                />
                            }
                            <div className="flex-1 flex flex-col justify-between p-1">
                                <div>
                                    <div className="text-lg sm:text-2xl line-clamp-1">{fakeData.title}</div>
                                    <div className="text-sm sm:text-md line-clamp-2">{fakeData.summary}</div>
                                </div>

                                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                                    <div>{fakeData.totalPost}개의 포스트</div>
                                    <div
                                        className="space-x-1 text-gray-500 dark:text-gray-400">
                                        <span>{fakeData.updatedAt.getFullYear()}년</span>
                                        <span>{(fakeData.updatedAt.getMonth() + 1).toString().padStart(2).trim()}월</span>
                                        <span>{fakeData.updatedAt.getDate().toString().padStart(2).trim()}일 업데이트</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

            </div>
        </div>
    )
}

export default MyBlogSeries