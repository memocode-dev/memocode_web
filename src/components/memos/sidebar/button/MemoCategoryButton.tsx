import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";

const MemoCategoryButton = () => {

    // const [categoryName, setCategoryName] = useState("");
    //
    // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log("handleInputChange", event.target.value)
    //     setCategoryName(event.target.value);
    // };
    //
    // const addMemoCategoryHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    // }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-sm py-1 px-2">
                    <div className="text-sm cursor-pointer tracking-wider">카테고리 관리</div>
                </div>
            </DialogTrigger>
            <DialogContent
                className="flex flex-col max-w-[250px] h-[500px] sm:max-w-[620px] lg:max-w-[825px] rounded-lg z-50 dark:bg-neutral-700">
                <DialogHeader className="flex">
                    <DialogTitle>카테고리 관리</DialogTitle>
                    <DialogDescription className="text-gray-500  dark:text-gray-300">
                        카테고리를 생성하여 메모를 관리할 수 있습니다.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 flex-col justify-center items-center text-xl">
                    <div>준비중인 서비스입니다.</div>
                </div>

                {/*<form onSubmit={addMemoCategoryHandler} className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-x-2 py-5">*/}
                {/*    <Label htmlFor="name" className="mt-2">*/}
                {/*        이름*/}
                {/*    </Label>*/}
                {/*    <Input*/}
                {/*        id="name"*/}
                {/*        placeholder="카테고리 이름을 입력해주세요"*/}
                {/*        className="w-full max-w-xs placeholder:text-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-black border-0"*/}
                {/*        value={categoryName}*/}
                {/*        onChange={handleInputChange}*/}
                {/*    />*/}
                {/*    <Button className="w-full sm:w-auto bg-indigo-400 hover:bg-indigo-500" type="submit">추가</Button>*/}
                {/*</form>*/}

                {/*<div className="flex justify-center overflow-x-auto py-2 sm:px-10">*/}
                {/*    <Table>*/}
                {/*        <TableHeader>*/}
                {/*            <TableRow>*/}
                {/*                <TableHead>이름</TableHead>*/}
                {/*                <TableHead>생성날짜</TableHead>*/}
                {/*            </TableRow>*/}
                {/*        </TableHeader>*/}
                {/*        <TableBody>*/}
                {/*            <TableRow>*/}
                {/*                <TableCell className="font-medium">홍길동</TableCell>*/}
                {/*                <TableCell>2024.03.06</TableCell>*/}
                {/*            </TableRow>*/}
                {/*        </TableBody>*/}
                {/*    </Table>*/}
                {/*</div>*/}
            </DialogContent>
        </Dialog>
    )
}

export default MemoCategoryButton