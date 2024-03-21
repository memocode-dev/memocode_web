const QuestionComment = () => {
    return (
        <div className="flex flex-1 bg-white dark:bg-[#1E1E1E]">
            <div className="flex-1 py-10 px-5">
                <div className="mb-1 font-semibold text-gray-700 dark:text-gray-300">답변하기</div>
                <div className="flex flex-1 space-x-2">
                    <textarea
                        placeholder="에디터로 변경예정"
                        className="flex-1 resize-none border border-gray-200 bg-white dark:bg-[#1E1E1E] outline-none rounded-lg h-44 p-2"></textarea>
                    <div
                        className="flex w-24 h-44 bg-indigo-400 hover:bg-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white rounded-lg p-2 justify-center items-center">
                        <div>등록</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionComment