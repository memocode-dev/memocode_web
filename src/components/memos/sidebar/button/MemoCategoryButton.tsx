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
                <div className="flex space-x-1 items-center bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2">
                    <MdCategory className="w-[18px] h-[18px]"/>
                    <div className="text-sm cursor-pointer tracking-wider">카테고리 관리</div>
                </div>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col max-w-[250px] h-[500px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50 dark:bg-neutral-700">
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