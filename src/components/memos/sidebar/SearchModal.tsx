import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
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
                <div className="bg-transparent hover:bg-gray-200 rounded-sm py-1 px-2">
                    <div className="text-sm cursor-pointer tracking-wider">검색</div>
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[825px] h-[600px] z-50">
                <div className="flex flex-1 flex-col py-4">
                    <Input
                        id="name"
                        placeholder="검색어를 입력하세요"
                        className="text-lg py-6 placeholder:text-gray-300 focus-visible:ring-indigo-500"
                        onChange={searchInputHandler}
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