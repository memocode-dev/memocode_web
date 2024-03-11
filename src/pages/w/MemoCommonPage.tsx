import {Outlet} from "react-router-dom";
import MemoLayout from "../../components/memos/layout/MemoLayout";

const MemoCommonPage = () => {

    return (
        <>
            <MemoLayout>
                <Outlet/>
            </MemoLayout>
        </>
    );
}

export default MemoCommonPage;