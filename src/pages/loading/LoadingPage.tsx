import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent} from "@/components/ui/dialog.tsx";
import {RiLoader3Fill} from "react-icons/ri";

const LoadingPage = () => {
    return (
        <Dialog defaultOpen={true}>
            <DialogContent className="bg-transparent shadow-none border-0 outline-0">
                <RiLoader3Fill className="w-[45px] h-[45px] animate-spin text-foreground"/>
            </DialogContent>
        </Dialog>
    )
}

export default LoadingPage;