interface MemoWritePageLayout__MemoTabButtonProps {
    setIsTab: (tab: string) => void;
    isTab: string;
}

const MemoWritePageLayout__MemoTabButtons = ({setIsTab, isTab}: MemoWritePageLayout__MemoTabButtonProps) => {
    return (
        <div className="flex w-full my-1">
            {/* tab1 - 공개 버튼 */}
            <label
                htmlFor="tab1"
                className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab1" ? `bg-primary text-primary-foreground` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
                <button
                    onClick={() => {
                        setIsTab("tab1")
                    }}
                    className="flex-1 flex justify-center text-sm tracking-wider"
                >
                    공개
                </button>
            </label>

            {/* tab2 - 비공개 버튼 */}
            <label
                htmlFor="tab2"
                className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab2" ? `bg-primary text-primary-foreground` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
                <button
                    onClick={() => {
                        setIsTab("tab2")
                    }}
                    className="flex-1 flex justify-center text-sm tracking-wider"
                >
                    비공개
                </button>
            </label>

            {/* tab3 - 즐겨찾기 버튼 */}
            <label htmlFor="tab3"
                   className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab3" ? `bg-primary text-primary-foreground` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
                <button
                    onClick={() => {
                        setIsTab("tab3");

                    }}
                    className="flex-1 flex justify-center text-sm tracking-wider"
                >
                    즐겨찾기
                </button>
            </label>

            {/* tab4 - 보안 버튼 */}
            <label htmlFor="tab4"
                   className={`flex-1 flex rounded-sm py-1 px-2 select-none ${isTab === "tab4" ? `bg-primary text-primary-foreground` : `text-gray-400 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-black dark:hover:text-white`}`}>
                <button
                    onClick={() => {
                        setIsTab("tab4");

                    }}
                    className="flex-1 flex justify-center text-sm tracking-wider"
                >
                    보안
                </button>
            </label>
        </div>
    )
}

export default MemoWritePageLayout__MemoTabButtons;
