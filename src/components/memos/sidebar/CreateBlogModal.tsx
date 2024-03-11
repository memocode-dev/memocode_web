import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";

const CreateBlogModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex flex-1 hover:text-white hover:bg-indigo-400">블로그 활성화</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] z-50">
                <DialogHeader className="flex justify-center">
                    <DialogTitle>블로그 활성화</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        블로그를 활성화하면 내 메모들이 다른 사람들에게 보여집니다.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col py-4 space-y-3">
                    <div className="flex space-x-2 items-center">
                        <Label htmlFor="name" className="text-right">
                            활동명
                        </Label>
                        <Input
                            id="name"
                            placeholder="활동명을 입력해주세요"
                            className="flex-1 placeholder:text-gray-300 focus-visible:ring-indigo-500"
                        />
                    </div>

                    <div className="text-center text-xs text-red-500">추후 변경이 불가능합니다. 신중하게 작성해주세요.</div>
                </div>
                <DialogFooter>
                    <Button className="bg-indigo-400 hover:bg-indigo-500" type="submit">활성화</Button>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            취소
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateBlogModal