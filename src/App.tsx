import {useContext} from "react";
import UserContext from "./context/UserContext.tsx";
import {Outlet, useLocation} from "react-router-dom";
import Anonymous from "@/pages/Anonymous.tsx";
import TopBar from "@/components/common/TopBar.tsx";

function App() {

    const {user_info} = useContext(UserContext)
    const {pathname} = useLocation()
    const isWRoute = pathname.startsWith('/w');

    return <div className="h-screen flex flex-col mx-auto bg-white dark:bg-[#1E1E1E]">
        <div className="flex-1 flex">
            {!isWRoute && (<TopBar/>)}
            {user_info.authority === "ANONYMOUS" ?
                <Anonymous/>
                :
                <Outlet/>
            }
        </div>
    </div>
}

export default App
