import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table.tsx";

const CategoryModal = () => {

    const [categoryName, setCategoryName] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("handleInputChange", event.target.value)
        setCategoryName(event.target.value);
    };

    const addMemoCategoryHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-[#2B2B37] rounded-sm py-1 px-2">
                    <div className="text-sm cursor-pointer tracking-wider">카테고리 관리</div>
                </div>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-w-[250px] h-[500px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50">
                <DialogHeader className="flex">
                    <DialogTitle>카테고리 관리</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        카테고리를 생성하여 메모를 관리할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={addMemoCategoryHandler} className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-x-2 py-5">
                    <Label htmlFor="name" className="mt-1">
                        이름
                    </Label>
                    <Input
                        id="name"
                        placeholder="카테고리 이름을 입력해주세요"
                        className="w-full max-w-xs placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={categoryName}
                        onChange={handleInputChange}
                    />
                    <Button className="w-full sm:w-auto bg-indigo-400 hover:bg-indigo-500" type="submit">추가</Button>
                </form>

                <div className="flex justify-center overflow-x-auto py-2 sm:px-10">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>이름</TableHead>
                                <TableHead>생성날짜</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">홍길동</TableCell>
                                <TableCell>2024.03.06</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CategoryModal