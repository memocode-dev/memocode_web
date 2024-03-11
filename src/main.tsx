import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {UserProvider} from "./context/UserContext.tsx";
import Main from "./pages/Main.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ModalProvider} from "@/context/ModalConext.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Toaster} from './components/ui/toaster.tsx';
import PostDetail from "@/pages/PostDetail.tsx";
import Api from "@/pages/api/Api.tsx";
import MemoCommonPage from "@/pages/w/MemoCommonPage.tsx";

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <QueryClientProvider client={queryClient}>
                <ToastContainer/>
                <Toaster/>
                <ModalProvider>
                    <UserProvider>
                        <App/>
                    </UserProvider>
                </ModalProvider>
            </QueryClientProvider>
        ),
        errorElement: <div>Error Page 😭</div>,
        children: [
            // 메인
            {
                index: true,
                path: "/",
                element: <Main/>,
            },

            // 포스트 상세
            {
                index: true,
                path: "/post/:postId",
                element: <PostDetail/>,
            },

            // 스웨거
            {
                index: true,
                path: "/api",
                element: <Api/>,
            },

            // 메모 만들기
            {
                index: true,
                path: "/w",
                element: <MemoCommonPage/>,
            },
        ]
    }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>,
)
