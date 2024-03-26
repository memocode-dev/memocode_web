import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
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
import Question from "@/pages/questions/Question.tsx";
import QuestionsCommon from "@/pages/questions/QuestionsCommon.tsx";
import Questions from "@/pages/questions/Questions.tsx";
import MyBlogCommon from "@/pages/@username/MyBlogCommon.tsx";
import MyBlogAbout from "@/pages/@username/MyBlogAbout.tsx";
import MyBlogPosts from "@/pages/@username/MyBlogPosts.tsx";
import MyBlogSeries from "@/pages/@username/MyBlogSeries.tsx";

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
                path: "/:username/:postId",
                element: <Post/>,
            },

            // 스웨거
            {
                index: true,
                path: "/api",
                element: <Api/>,
            },

            // 메모
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

            // 질문
            {
                path: "/questions",
                element: <QuestionsCommon/>,
                children: [
                    // 질문 전체조회
                    {
                        index: true,
                        element: <Questions/>
                    },
                    // 질문 상세
                    {
                        path: ":questionId",
                        element: <Question/>
                    },
                ]
            },

            // 내 블로그
            {
                path: "/:username",
                element: <MyBlogCommon/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="about" replace />,
                    },
                    // 소개
                    {
                        path: "about",
                        element: <MyBlogAbout/>
                    },
                    // 게시글
                    {
                        path: "posts",
                        element: <MyBlogPosts/>
                    },
                    // 시리즈
                    {
                        path: "series",
                        element: <MyBlogSeries/>
                    },
                ]
            }
        ]
    }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>,
)
