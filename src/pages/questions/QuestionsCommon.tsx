import QuestionsSideBar from "@/components/questions/QuestionsSideBar.tsx";
import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {Outlet} from "react-router-dom";

const QuestionsCommon = () => {
    return (
        <div
            className="flex flex-1 flex-col mt-14 bg-background overflow-y-auto mx-5 sm:mx-[50px] md:ml-[200px] lg:mx-[220px] xl:mx-[280px] 2xl:mx-[420px]">

            {/* 사이드 바 */}
            <QuestionsSideBar/>

            {/* Q&A 모아보기 */}
            <Outlet/>

            {/* 위로 이동 버튼 */}
            <UpToDownButton direction="up"/>

        </div>
    )
}

export default QuestionsCommon