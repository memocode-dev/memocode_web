import {useContext} from "react";
import UserContext from "./context/UserContext.tsx";
import {Outlet} from "react-router-dom";
import Anonymous from "@/pages/Anonymous.tsx";
import TopBar from "@/components/common/TopBar.tsx";

function App() {

    const {user_info} = useContext(UserContext)

    return <div className="h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex mt-[50px]">
            {user_info.authority === "ANONYMOUS" ?
                <Anonymous/>
                :
                <Outlet/>
            }
        </div>
    </div>
}

export default App
