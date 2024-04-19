import {Outlet, useLocation} from "react-router-dom";
import TopBar from "@/components/common/TopBar.tsx";

function App() {
    const {pathname} = useLocation()
    const isWRoute = pathname.startsWith('/w');

    return (
        <div className="h-screen flex flex-col mx-auto bg-background">
            <div className="flex-1 flex">
                {!isWRoute && (<TopBar/>)}
                <Outlet/>
            </div>
        </div>
    )
}

export default App