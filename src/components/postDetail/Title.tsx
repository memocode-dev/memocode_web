import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

interface TitleProps {
    id: number;
    title: string;
    author: string;
    createAt: string;
}

const Title = ({item}: { item: TitleProps }) => {
    return (
        <div className="bg-white border-b border-b-gray-300 p-5">
            <div className="text-5xl font-bold leading-snug break-all truncate">
                {item.title}이 텍스트는 너무 길어서 요소의 너비를 초과합니다. 하지만 이 설정 덕분에 말줄임표로 처리됩니다.
            </div>

            <div className="flex justify-between items-center mt-10">
                <div className="flex items-center space-x-1.5">
                    <Avatar className="w-7 h-7">
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>
                            <Skeleton className="h-12 w-12 rounded-full"/>
                        </AvatarFallback>
                    </Avatar>
                    <div className="tracking-wider">{item.author}</div>
                </div>

                <div>
                    <div className="text-gray-500 tracking-wider">{item.createAt}</div>
                </div>
            </div>
        </div>
    )
}

export default Title
