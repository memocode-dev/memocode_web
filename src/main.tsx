import ReactDOM from 'react-dom/client'
import '@/css/index.css'
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ModalProvider} from "@/context/ModalContext.tsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {Toaster} from './components/ui/toaster.tsx';
import {ThemeProvider} from "@/context/ThemeContext.tsx";
import React, {Suspense} from "react";
import App from "@/App.tsx";
import MyBlogSeriesDetail from "@/pages/@username/MyBlogSeriesDetail.tsx";
import MemoSeriess from "@/pages/w/series/MemoSeriess.tsx";
import MyQuestions from "@/pages/@username/MyQuestions.tsx";
import MyAnswers from "@/pages/@username/MyAnswers.tsx";
import QuestionCreate from "@/pages/questions/ask/QuestionCreate.tsx";
import QuestionEdit from "@/pages/questions/edit/QuestionEdit.tsx";
import {KeycloakProvider} from "@/context/KeycloakContext.tsx";


const queryClient = new QueryClient()

function preloadComponent(componentLoader: () => void): void {
    setTimeout(componentLoader, 1000);
}

// Lazy-loaded components
const MainPage = React.lazy(() => import('./pages/MainPage.tsx'));
preloadComponent(() => import('./pages/MainPage.tsx'));
const Post = React.lazy(() => import('@/pages/posts/Post.tsx'));
preloadComponent(() => import('@/pages/posts/Post.tsx'));
const MemoCommon = React.lazy(() => import('@/pages/w/MemoCommon.tsx'));
preloadComponent(() => import('@/pages/w/MemoCommon.tsx'));
const MemoEdit = React.lazy(() => import('@/pages/w/MemoEdit.tsx'));
preloadComponent(() => import('@/pages/w/MemoEdit.tsx'));
const MemoCreatePage = React.lazy(() => import('@/pages/w/MemoCreate.tsx'));
preloadComponent(() => import('@/pages/w/MemoCreate.tsx'));
const QuestionsCommon = React.lazy(() => import('@/pages/questions/QuestionsCommon.tsx'));
preloadComponent(() => import('@/pages/questions/QuestionsCommon.tsx'));
const Questions = React.lazy(() => import('@/pages/questions/Questions.tsx'));
preloadComponent(() => import('@/pages/questions/Questions.tsx'));
const Question = React.lazy(() => import('@/pages/questions/Question.tsx'));
preloadComponent(() => import('@/pages/questions/Question.tsx'));
const MyBlogCommon = React.lazy(() => import('@/pages/@username/MyBlogCommon.tsx'));
preloadComponent(() => import('@/pages/@username/MyBlogCommon.tsx'));
const MyBlogAbout = React.lazy(() => import('@/pages/@username/MyBlogAbout.tsx'));
preloadComponent(() => import('@/pages/@username/MyBlogAbout.tsx'));
const MyBlogPosts = React.lazy(() => import('@/pages/@username/MyBlogPosts.tsx'));
preloadComponent(() => import('@/pages/@username/MyBlogPosts.tsx'));
const MyBlogSeries = React.lazy(() => import('@/pages/@username/MyBlogSeries.tsx'));
preloadComponent(() => import('@/pages/@username/MyBlogSeries.tsx'));
const Api = React.lazy(() => import('@/pages/api/Api.tsx'));

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <ToastContainer/>
                    <Toaster/>
                    <ModalProvider>
                        <KeycloakProvider>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <App/>
                                </Suspense>
                        </KeycloakProvider>
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
                element: <MainPage/>,
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
                    },
                    // 시리즈 관리
                    {
                        path: "series",
                        element: <MemoSeriess/>
                    }
                ]
            },

            // Q&A
            {
                path: "/questions",
                element: <QuestionsCommon/>,
                children: [
                    // 질문 전체조회
                    {
                        index: true,
                        element: <Questions/>
                    },
                    // 질문 생성
                    {
                        path: "ask",
                        element: <QuestionCreate/>
                    },
                ]
            },

            // Q&A - 질문 상세
            {
                path: "/questions/:questionId",
                element: <Question/>
            },

            // Q&A - 질문 수정
            {
                path: "/questions/edit/:questionId",
                element: <QuestionEdit/>
            },

            // 내 질문
            {
                path: "/:username/questions",
                element: <QuestionsCommon/>,
                children: [
                    {
                        index: true,
                        element: <MyQuestions/>
                    }
                ]
            },

            // 내 답변
            {
                path: "/:username/answers",
                element: <QuestionsCommon/>,
                children: [
                    {
                        index: true,
                        element: <MyAnswers/>
                    }
                ]
            },

            // 내 블로그
            {
                path: "/:username",
                element: <MyBlogCommon/>,
                children: [
                    {
                        index: true,
                        element: <Navigate to="about" replace/>,
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
            },

            // 시리즈 상세
            {
                index: true,
                path: "/:username/series/:seriesTitle",
                element: <MyBlogSeriesDetail/>
            },
        ]
    }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>,
)