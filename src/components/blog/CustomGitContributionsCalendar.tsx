import GitHubCalendar from "react-github-calendar";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useContext, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import {useKeycloak} from "@/context/KeycloakContext.tsx";

const CustomGitContributionsCalendar = () => {

    const {isLogined} = useKeycloak()
    const {theme} = useContext(ThemeContext);
    const [createGithubNameButton, setCreateGithubNameButton] = useState(false)
    const [githubName, setGithubName] = useState("")
    const [fetchGithubName, setFetchGithubName] = useState("")

    return (
        <div className="p-5 space-y-5">
            <span className="text-xl font-semibold">Git contributions History</span>

            <div className="flex items-center">
                <div className="text-gray-400 text-sm">
                    <GitHubCalendar
                        username={fetchGithubName}
                        colorScheme={theme}
                        blockSize={11}
                        errorMessage={createGithubNameButton ? "" : "가져온 커밋기록이 없습니다."}
                    />
                </div>

                {!githubName && !createGithubNameButton && !fetchGithubName && isLogined &&
                    <Button
                        onClick={() => {
                            setCreateGithubNameButton(true)
                        }}
                        className="ml-2 px-1 py-3 h-0 bg-primary hover:bg-primary-hover rounded focus-visible:ring-0">
                        <div className="text-xs">가져오기</div>
                    </Button>
                }

                {createGithubNameButton &&
                    <>
                        <Input
                            onChange={(e) => {
                                setGithubName(e.target.value)
                            }}
                            type="text"
                            placeholder="깃허브 유저네임을 입력하세요."
                            className="w-[225px] h-[35px] px-2 text-sm dark:bg-neutral-700 dark:border-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0"/>

                        <Button
                            onClick={() => {
                                setFetchGithubName(githubName)
                                setCreateGithubNameButton(false)
                            }}
                            className="ml-2 px-3 h-[35px] bg-primary hover:bg-primary-hover rounded focus-visible:ring-0">
                            <div className="text-primary-foreground text-xs">등록</div>
                        </Button>

                        <Button
                            onClick={() => {
                                setCreateGithubNameButton(false)
                            }}
                            variant="secondary"
                            className="ml-2 px-3 h-[35px] text-xs rounded hover:bg-secondary-hover">
                            취소
                        </Button>
                    </>
                }
            </div>
        </div>
    )
}

export default CustomGitContributionsCalendar