import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent} from "@/components/ui/dialog.tsx";
import {TbCircleDotted} from "react-icons/tb";

const LoadingPage = () => {
    return (
        <Dialog defaultOpen={true}>
            <DialogContent className="bg-transparent shadow-none border-0 outline-0">
                <TbCircleDotted className="w-[70px] h-[70px] animate-spin text-white"/>
            </DialogContent>
        </Dialog>
    )
}

export default LoadingPage;