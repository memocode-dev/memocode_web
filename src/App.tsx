import {useContext} from "react";
import UserContext from "./context/UserContext.tsx";
import {Outlet, useLocation} from "react-router-dom";
import Anonymous from "@/pages/Anonymous.tsx";
import TopBar from "@/components/common/TopBar.tsx";

function App() {

    const {user_info} = useContext(UserContext)
    const location = useLocation()

    return <div className="h-screen flex flex-col mx-auto">
        {location.pathname === "/w" ? <></> : <TopBar/>}
        <div className="flex-1 flex">
            {user_info.authority === "ANONYMOUS" ?
                <Anonymous/>
                :
                <Outlet/>
            }
        </div>
    </div>
}

export default App
