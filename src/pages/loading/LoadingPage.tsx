import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent} from "@/components/ui/dialog.tsx";
import {TbLoader3} from "react-icons/tb";

const LoadingPage = () => {
    return (
        <Dialog defaultOpen={true}>
            <DialogContent className="bg-transparent shadow-none border-0 outline-0">
                <TbLoader3 className="w-[80px] h-[80px] animate-spin text-white"/>
            </DialogContent>
        </Dialog>
    )
}

export default LoadingPage;