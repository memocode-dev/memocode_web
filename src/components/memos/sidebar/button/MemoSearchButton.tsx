import {
    Dialog,
    DialogContent, DialogDescription, DialogHeader, DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

const MemoSearchButton = () => {
    // const [searchQuery, setSearchQuery] = useState("");
    //
    // const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log("searchInputHandler", event.target.value)
    //     setSearchQuery(event.target.value);
    // }

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

                {/*<div className="flex flex-1 flex-col py-4">*/}
                {/*<Input*/}
                {/*    id="name"*/}
                {/*    placeholder="검색어를 입력하세요"*/}
                {/*    className="text-lg py-6 placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-black border-0"*/}
                {/*    onChange={searchInputHandler}*/}
                {/*    value={searchQuery}*/}
                {/*/>*/}

                {/*<div className="mt-4">*/}
                {/*    <div className="mx-2 my-1 text-left pl-1 py-2">검색 결과 없음</div>*/}
                {/*</div>*/}
                <div className="flex flex-1 flex-col justify-center items-center text-xl">
                    <div>준비중인 서비스입니다.</div>
                </div>
                {/*</div>*/}
            </DialogContent>
        </Dialog>
    )
}

export default MemoSearchButton