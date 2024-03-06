const Comment = () => {
    return (
        <div className="flex flex-1 bg-white">
            <div className="flex-1 p-5">
                <div className="mb-1 text-gray-700">댓글</div>
                <div className="flex flex-1 space-x-2">
                    <textarea
                        className="flex-1 resize-none border border-gray-200 bg-white outline-none rounded-lg h-32 p-2"></textarea>
                    <div
                        className="flex w-24 h-32 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg p-2 justify-center items-center">
                        <div>등록</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Comment