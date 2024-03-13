import {AiFillLike, AiOutlineComment} from "react-icons/ai";
import {IoGlasses} from "react-icons/io5";
import {useNavigate} from "react-router-dom";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

// test interface
interface TestDataItem {
    id: number;
    title: string;
    content: string;
    author: string;
    like: number;
    view: number;
    comment: number;
    imgUrl: string;
    createAt: string,
}

const Posts = () => {

    // test data
    const testData: TestDataItem[] = new Array(13).fill(null).map((_, index) => ({
        id: index + 1,
        title: "title",
        content: "content",
        author: "작성자",
        like: Math.floor(Math.random() * 501), // 0에서 500 사이의 랜덤 숫자
        view: Math.floor(Math.random() * 501),
        comment: Math.floor(Math.random() * 501),
        imgUrl: "https://images.squarespace-cdn.com/content/v1/5c77350965a707ed1710a1bc/1592330659753-70M66LGEPXFTQ8S716MX/Generative+Art+by+Mark+Stock+-+Gyre+35700.jpg",
        createAt: "2024.03.05",
    }));

    const navigate = useNavigate()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {testData.map((item, index) => (
                <div key={index}
                     className="flex flex-col flex-1 rounded-b-lg bg-[#F1F2F4] hover:cursor-pointer transform transition duration-300 hover:-translate-y-2 hover:shadow-lg"
                     onClick={() => {
                         navigate(`/${item.id}`, {state: {item}})
                     }}
                >
                    <img src={item.imgUrl} className="rounded-t-lg w-[100%] h-[60%]" alt="thumbNail"/>

                    <div className="flex-1 flex flex-col py-2 px-3">
                        <div>
                            <div className="text-lg">{item.title}</div>
                            <div className="text-sm">{item.content}...</div>
                        </div>

                        <div className="flex items-center mt-4 text-xs">
                            <div className="flex items-center space-x-1.5">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src="https://github.com/shadcn.png"/>
                                    <AvatarFallback>
                                        <Skeleton className="h-12 w-12 rounded-full"/>
                                    </AvatarFallback>
                                </Avatar>

                                <div>{item.author}</div>

                                <div className="text-gray-500">3일 전</div>
                            </div>
                        </div>

                        <div className="flex justify-between text-xs mt-3">
                            <div className="flex space-x-2">
                                <div className="flex items-center space-x-1">
                                    <AiFillLike className="w-4 h-4"/>
                                    <div>{item.like}</div>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <IoGlasses className="w-6 h-6"/>
                                    <div>{item.view}</div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1">
                                <AiOutlineComment className="w-5 h-5"/>
                                <div>{item.comment}</div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Posts