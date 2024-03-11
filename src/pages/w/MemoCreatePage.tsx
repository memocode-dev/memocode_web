import {Button} from "@/components/ui/button.tsx";

const MemoCreatePage = () => {
    return (
        <div className="flex-1 flex justify-center items-center">

            <Button
                className="px-10 py-7 bg-gray-100 hover:bg-gray-100 hover:scale-110 transform transition duration-700 rounded-lg shadow"
                onClick={() => {
                    console.log("새메모시작")
                }}
            >
                <div className="text-black font-light">새 메모 시작하기</div>
            </Button>
        </div>
    )
}

export default MemoCreatePage;