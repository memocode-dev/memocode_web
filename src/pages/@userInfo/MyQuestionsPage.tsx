import Avatar from "react-avatar";

const MyQuestionsPage = () => {

    return (
        <div className="flex flex-1 flex-col py-10">

            <div className="flex flex-col relative bg-gray-100 dark:bg-neutral-700 p-10">
                <div className="profile_css">
                    <div className="avatar-size">
                        <Avatar
                            name={"ㅇ"}
                            size="100%"
                            round="5px"/>
                    </div>
                </div>
            </div>

            {/*<div className="flex flex-1 flex-col">*/}
                <div className="border border-gray-200 my-3 p-5 dark:border-neutral-700 bg-transparent rounded-none">

                </div>
            {/*</div>*/}

        </div>
    )
}

export default MyQuestionsPage