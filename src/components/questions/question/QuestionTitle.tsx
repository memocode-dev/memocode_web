import {QuestionDetailDto} from "@/openapi/question/model";

const QuestionTitle = ({question}: { question: QuestionDetailDto }) => {
    return (
        <div className="bg-background py-5 cursor-default">
            <div className="text-2xl font-bold leading-snug break-all">
                {question && question.title}
            </div>

            <div className="flex justify-between items-center border-b border-b-gray-300 pt-5 pb-2">
                <div className="text-sm tracking-wider">{question && question.author?.username}</div>

                <div className="text-sm stext-gray-500 dark:text-gray-300 tracking-wider">
                    {question &&  question?.createdAt
                        ? new Date(question?.createdAt).toLocaleDateString('en-CA', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }).replace(/-/g, '.')
                        : ''}
                </div>
            </div>
        </div>
    )
}

export default QuestionTitle
