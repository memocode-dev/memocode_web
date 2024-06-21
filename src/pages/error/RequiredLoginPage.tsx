import {Button} from "@/components/ui/button.tsx";
import {useKeycloak} from "@/context/KeycloakContext.tsx";
import TopBar from "@/components/common/TopBar.tsx";
import {FaExclamation} from "react-icons/fa";

const RequiredLoginPage = () => {

    const {login} = useKeycloak()

    return (
        <div className="flex flex-col flex-1 min-w-screen min-h-screen bg-background">
            <TopBar/>
            <div className="flex flex-1 flex-col justify-center items-center space-y-10">
                <FaExclamation className="animate-pulse text-primary/80 w-28 h-28"/>
                <div className="flex flex-col justify-center space-y-4">
                    <div className="text-2xl font-semibold tracking-wider">로그인 후 이용해주세요!</div>
                    <Button className="text-lg" onClick={() => login()}>로그인</Button>
                </div>
            </div>
        </div>
    )
}

export default RequiredLoginPage;