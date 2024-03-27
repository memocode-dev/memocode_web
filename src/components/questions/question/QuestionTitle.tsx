import {faker} from "@faker-js/faker";

const QuestionTitle = () => {

    // 가짜 데이터 생성
    const fakerData = {
        title: faker.lorem.sentence(),
        author: faker.person.fullName(),
    };

    return (
        <div className="bg-background p-5">
            <div className="text-2xl font-bold leading-snug break-all">
                {fakerData.title}
            </div>

            <div className="flex justify-between items-center border-b border-b-gray-300 pt-5 pb-2">
                <div className="tracking-wider">{fakerData.author}</div>

                <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                    2024.03.11
                </div>
            </div>
        </div>
    )
}

export default QuestionTitle
