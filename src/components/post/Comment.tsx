import {Button} from "@/components/ui/button.tsx";

const Comment = () => {
    return (
        <div className="flex flex-1 bg-background">
            <div className="flex-1 p-5">
                <div className="mb-1 text-gray-700 dark:text-gray-300">댓글</div>
                <div className="flex flex-1 space-x-2">
                    <textarea
                        className="flex-1 resize-none border border-gray-200 bg-background outline-none rounded h-32 p-2"></textarea>
                    <Button
                        className="flex w-24 h-32 bg-primary hover:bg-primary-hover text-white rounded p-2 justify-center items-center">
                        <div>등록</div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Comment