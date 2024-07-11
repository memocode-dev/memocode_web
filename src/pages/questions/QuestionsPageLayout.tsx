import {Outlet} from "react-router-dom";
import QuestionsPageLayout__SideBar from "@/page_components/questions_page_layout/QuestionsPageLayout__SideBar.tsx";

const QuestionsPageLayout = () => {
    return (
        <div
            className="flex flex-1 flex-col mt-20 bg-background overflow-y-auto mx-3 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">
            {/* 사이드 바 */}
            <QuestionsPageLayout__SideBar/>

            <Outlet/>
        </div>
    )
}

export default QuestionsPageLayout