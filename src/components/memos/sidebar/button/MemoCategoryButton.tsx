import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {MdCategory} from "react-icons/md";

const MemoCategoryButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="flex space-x-2 items-center bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2 cursor-pointer">
                    <MdCategory className="w-[17px] h-[17px]"/>
                    <div className="text-sm tracking-wider">카테고리 관리</div>
                </div>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col max-w-[360px] sm:max-w-[600px] md:max-w-[750px] lg:max-w-[1000px] rounded-lg z-50 dark:bg-neutral-700 h-[90vh] overflow-y-auto outline-0">
                <DialogHeader className="flex">
                    <DialogTitle>카테고리 관리</DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-300">
                        카테고리를 생성하여 메모를 관리할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 flex-col mt-24 items-center text-lg">
                    <div>준비중인 서비스입니다.</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MemoCategoryButton