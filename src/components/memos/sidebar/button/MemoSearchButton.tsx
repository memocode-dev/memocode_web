import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

const MemoSearchButton = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2">
                    <div className="text-sm cursor-pointer tracking-wider">검색</div>
                </div>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col max-w-[250px] h-[500px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50 dark:bg-neutral-700">
                <DialogHeader className="flex">
                    <DialogTitle>검색</DialogTitle>
                    <DialogDescription className="text-gray-500  dark:text-gray-300">
                        검색으로 빠르게 메모를 찾아보세요.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 flex-col mt-24 items-center text-lg">
                    <div>준비중인 서비스입니다.</div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MemoSearchButton