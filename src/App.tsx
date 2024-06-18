import {Outlet, useLocation} from "react-router-dom";
import TopBar from "@/components/common/TopBar.tsx";
import {useEffect} from "react";

function App() {
    const {pathname} = useLocation()
    const isWRoute = pathname.startsWith('/w');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

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