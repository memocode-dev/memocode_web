import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";

const SearchModal = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("searchInputHandler", event.target.value)
        setSearchQuery(event.target.value);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-[#2B2B37] rounded-sm py-1 px-2">
                    <div className="text-sm cursor-pointer tracking-wider">검색</div>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[250px] h-[400px] sm:h-[600px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50">
                <div className="flex flex-1 flex-col py-4">
                    <Input
                        id="name"
                        placeholder="검색어를 입력하세요"
                        className="text-lg py-6 placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onChange={searchInputHandler}
                        value={searchQuery}
                    />

                    <div className="mt-4">
                        <div className="mx-2 my-1 text-left pl-1 py-2">검색 결과 없음</div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SearchModal