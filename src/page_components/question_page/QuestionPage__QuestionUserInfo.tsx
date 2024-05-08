import Avatar from "react-avatar";

const QuestionUserInfo = () => {

    const testUserName = "귀여운친친라를좋아하는나에요";

    return (
        <div className="hidden xl:flex xl:flex-col w-[300px] min-h-screen bg-secondary ml-10 rounded-md p-7 space-y-3">
            <div
                className="flex items-center space-x-2 cursor-pointer relative">
                <Avatar
                    name={"q"}
                    size="65"
                    round="5px"/>
                <div className="break-all">
                    <div className="tracking-tighter text-lg font-semibold">{testUserName}</div>
                    <div className={`${testUserName.length > 20 ? `hidden` : `flex text-sm`} `}>
                        <div>
                            <span>질문 수</span><span>4</span>
                        </div>
                        <div>
                            <span>답변 수</span><span>0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div>dbflarla4966님의 Q&A</div>
            <div className="ml-5 text-sm">
                <div>
                    <span>작성한 질문 수</span><span>4</span>
                </div>
                <div>
                    <span>작성한 답변 수</span><span>0</span>
                </div>
            </div>


            <div>관심있는 분야</div>

            <div>dbflarla4966님의 질문과 비슷한 질문</div>
        </div>
    )
}

export default QuestionUserInfo;