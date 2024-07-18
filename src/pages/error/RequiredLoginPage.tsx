import {Button} from "@/components/ui/button";
import {useKeycloak} from "@/context/KeycloakContext";
import TopBar from "@/components/common/TopBar";
import {BsExclamationOctagon} from "react-icons/bs";

const RequiredLoginPage = () => {

    const {login} = useKeycloak()

    return (
        <div className="flex flex-col flex-1 min-w-screen min-h-screen bg-background">
            <TopBar/>
            <div className="flex flex-1 flex-col justify-center items-center space-y-10">
                <BsExclamationOctagon className="animate-pulse text-primary/80 w-16 h-16"/>
                <div className="flex flex-col justify-center">
                    <div className="text-foreground">로그인 후 이용 가능합니다.</div>
                    <Button variant="link" className="flex flex-col text-lg logo-font" onClick={() => login()}>
                        <div>LOGIN</div>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RequiredLoginPage;