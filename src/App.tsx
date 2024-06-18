import {Outlet, useLocation} from "react-router-dom";
import TopBar from "@/components/common/TopBar.tsx";
import {useContext, useEffect} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";

function App() {
    const {pathname} = useLocation()
    const isWRoute = pathname.startsWith('/w');
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        let savedColor = localStorage.getItem('themeColor');

        if (savedColor) {
            if (theme === "light" && savedColor === "0 0% 100%") {
                savedColor = "222.2 47.4% 11.2%";
            }

            if (theme === "dark" && savedColor === "222.2 47.4% 11.2%") {
                savedColor = "0 0% 100%";
            }

            document.documentElement.style.setProperty('--primary', savedColor);
        }
    }, [theme]);

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