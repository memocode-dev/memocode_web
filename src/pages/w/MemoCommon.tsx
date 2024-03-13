import MemoLayout from "@/components/memos/layout/MemoLayout.tsx";
import {Outlet} from "react-router-dom";

const MemoCommon = () => {
    return (
        <MemoLayout>
            <Outlet/>
        </MemoLayout>
    );
}

export default MemoCommon;