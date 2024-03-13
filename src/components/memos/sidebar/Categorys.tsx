interface categoryListProps {
    isTab: string;
}

const Categorys = ({isTab}: categoryListProps) => {
    return (
        <div className={`flex-1 flex flex-col overflow-y-scroll ${isTab === "tab2" ? "" : `hidden`}`}>
            <div className="flex flex-col bg-white dark:bg-black dark:bg-opacity-40 space-y-2 flex-1 py-1">

            </div>
        </div>
    )
}

export default Categorys