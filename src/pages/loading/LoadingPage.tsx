import {Dialog} from "@radix-ui/react-dialog";
import {DialogContent} from "@/components/ui/dialog.tsx";
import {TbCircleDotted} from "react-icons/tb";
import {useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Bounce, toast} from "react-toastify";
import {ThemeContext} from "@/context/ThemeContext.tsx";

const LoadingPage = () => {

    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
            navigate("/");
            toast.error("페이지를 읽는데 실패하였습니다. 잠시후 다시 시도해주세요.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
            });
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-transparent shadow-none border-0 outline-0">
                <TbCircleDotted className="w-[70px] h-[70px] animate-spin-slow text-white"/>
            </DialogContent>
        </Dialog>
    )
}

export default LoadingPage;