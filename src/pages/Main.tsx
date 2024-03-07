import Posts from "@/components/main/Posts.tsx";
import SortTab from "@/components/main/SortTab.tsx";

const Main = () => {
    return (
        <div
            className="flex flex-1 bg-white overflow-y-auto mx-5 sm:mx-[50px] md:mx-[50px] lg:mx-[100px] xl:mx-[150px] 2xl:mx-[200px]">
            <div className="flex-1 pb-10">
                <SortTab/>
                <Posts/>
            </div>
        </div>
    )
}

export default Main