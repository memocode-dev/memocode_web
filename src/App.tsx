import {Outlet, useLocation} from "react-router-dom";
import TopBar from "@/components/common/TopBar.tsx";
import {useContext, useEffect} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import BottomBar from "@/components/common/BottomBar.tsx";

function App() {
    const {pathname} = useLocation()
    const isWRoute = pathname.startsWith('/w');
    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        let savedColor = localStorage.getItem('themeColor');
        let savedFontColor = localStorage.getItem('fontColor');

        if (savedColor || savedFontColor) {

            if (theme === "light" && savedColor === "0 0% 100%") {
                savedColor = "222.2 47.4% 11.2%";
                savedFontColor = "0 0% 100%";
            }

            if (theme === "light" && savedColor === "173 53% 56%") {
                savedFontColor = "0 0% 100%";
            }

            if (theme === "dark" && savedColor === "173 53% 56%") {
                savedFontColor = "222.2 47.4% 11.2%";
            }

            if (theme === "dark" && savedColor === "222.2 47.4% 11.2%") {
                savedColor = "0 0% 100%";
                savedFontColor = "222.2 47.4% 11.2%";
            }

            document.documentElement.style.setProperty('--primary', savedColor);
            document.documentElement.style.setProperty('--primary-foreground', savedFontColor);
        }

    }, [theme]);

    return (
        <div className="h-screen flex flex-col mx-auto bg-background">
            <div className="flex-1 flex">
                {!isWRoute && (<TopBar/>)}
                <Outlet/>
                <BottomBar/>
            </div>
        </div>
    )
}

export default App