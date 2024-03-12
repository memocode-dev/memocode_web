interface categoryListProps {
    isTab: string;
}

const CategoryList = ({isTab}: categoryListProps) => {
    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab2" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-white dark:bg-[#2B2B37] space-y-2 flex-1 py-1">

            </div>
        </div>
    )
}

export default CategoryList