import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {UserProvider} from "./context/UserContext.tsx";
import Main from "./pages/Main.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ModalProvider} from "@/context/ModalContext.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Toaster} from './components/ui/toaster.tsx';
import Api from "@/pages/api/Api.tsx";
import MemoCommon from "@/pages/w/MemoCommon.tsx";
import MemoCreatePage from "@/pages/w/MemoCreate.tsx";
import MemoEdit from "@/pages/w/MemoEdit.tsx";
import {ThemeProvider} from "@/context/ThemeContext.tsx";
import Post from "@/pages/posts/Post.tsx";
import Questions from "@/pages/questions/Questions.tsx";

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <ToastContainer/>
                    <Toaster/>
                    <ModalProvider>
                        <UserProvider>
                            <App/>
                        </UserProvider>
                    </ModalProvider>
                </ThemeProvider>
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
                path: "/posts/:postId",
                element: <Post/>,
            },

            // 스웨거
            {
                index: true,
                path: "/api",
                element: <Api/>,
            },

            // 메모 생성
            {
                path: "/w",
                element: <MemoCommon/>,
                children: [
                    // 메모 생성
                    {
                        index: true,
                        element: <MemoCreatePage/>
                    },
                    // 메모 수정
                    {
                        path: ":memoId",
                        element: <MemoEdit/>
                    }
                ]
            },

            // QNA 전체조회
            {
                path: "/questions",
                element: <Questions/>,
                children: [
                    // 질문 생성
                    {
                        path: "ask",
                        element: <Post/>
                    },
                ]
            },
        ]
    }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>,
)
