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
import MyBlogSeriesDetail from "@/pages/@userInfo/MyBlogSeriesDetail.tsx";
import MyQuestionsPage from "@/pages/@userInfo/MyQuestionsPage.tsx";
import MyAnswersPage from "@/pages/@userInfo/MyAnswersPage.tsx";
import {KeycloakProvider} from "@/context/KeycloakContext.tsx";
import MemoSeriesManagementPage from "@/pages/w/MemoSeriesManagementPage.tsx";
import QuestionCreatePage from "@/pages/questions/QuestionCreatePage.tsx";
import QuestionEditPage from "@/pages/questions/QuestionEditPage.tsx";

const queryClient = new QueryClient()

function preloadComponent(componentLoader: () => void): void {
    setTimeout(componentLoader, 1000);
}

// Lazy-loaded components
const MainPage = React.lazy(() => import('./pages/MainPage.tsx'));
preloadComponent(() => import('./pages/MainPage.tsx'));
const Post = React.lazy(() => import('@/pages/posts/Post.tsx'));
preloadComponent(() => import('@/pages/posts/Post.tsx'));
const MemoWritePageLayout = React.lazy(() => import('@/pages/w/MemoWritePageLayout.tsx'));
preloadComponent(() => import('@/pages/w/MemoWritePageLayout.tsx'));
const MemoEditPage = React.lazy(() => import('@/pages/w/MemoEditPage.tsx'));
preloadComponent(() => import('@/pages/w/MemoEditPage.tsx'));
const MemoCreatePage = React.lazy(() => import('@/pages/w/MemoCreatePage.tsx'));
preloadComponent(() => import('@/pages/w/MemoCreatePage.tsx'));
const QuestionsPageLayout = React.lazy(() => import('@/pages/questions/QuestionsPageLayout.tsx'));
preloadComponent(() => import('@/pages/questions/QuestionsPageLayout.tsx'));
const QuestionsPage = React.lazy(() => import('@/pages/questions/QuestionsPage.tsx'));
preloadComponent(() => import('@/pages/questions/QuestionsPage.tsx'));
const QuestionPage = React.lazy(() => import('@/pages/questions/QuestionPage.tsx'));
preloadComponent(() => import('@/pages/questions/QuestionPage.tsx'));
const MyBlogPageLayout = React.lazy(() => import('@/pages/@userInfo/MyBlogPageLayout.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogPageLayout.tsx'));
const MyBlogAbout = React.lazy(() => import('@/pages/@userInfo/MyBlogAbout.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogAbout.tsx'));
const MyBlogPosts = React.lazy(() => import('@/pages/@userInfo/MyBlogPosts.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogPosts.tsx'));
const MyBlogSeries = React.lazy(() => import('@/pages/@userInfo/MyBlogSeries.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogSeries.tsx'));
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
            // 메인 페이지
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

            // 메모 페이지
            {
                path: "/w",
                element: <MemoWritePageLayout/>,
                children: [
                    // 메모 생성
                    {
                        index: true,
                        element: <MemoCreatePage/>
                    },
                    // 메모 수정
                    {
                        path: ":memoId",
                        element: <MemoEditPage/>
                    },
                    // 시리즈 관리
                    {
                        path: "series",
                        element: <MemoSeriesManagementPage/>
                    }
                ]
            },

            // Q&A 페이지
            {
                path: "/questions",
                element: <QuestionsPageLayout/>,
                children: [
                    // Q&A - 질문 전체조회
                    {
                        index: true,
                        element: <QuestionsPage/>
                    },
                    // Q&A - 질문 생성
                    {
                        path: "ask",
                        element: <QuestionCreatePage/>
                    },
                ]
            },

            // Q&A - 질문 상세페이지
            {
                path: "/questions/:questionId",
                element: <QuestionPage/>
            },

            // Q&A - 질문 수정페이지
            {
                path: "/questions/edit/:questionId",
                element: <QuestionEditPage/>
            },

            // 내 질문 페이지
            {
                path: "/:username/questions",
                element: <QuestionsPageLayout/>,
                children: [
                    {
                        index: true,
                        element: <MyQuestionsPage/>
                    }
                ]
            },

            // 내 답변 페이지
            {
                path: "/:username/answers",
                element: <QuestionsPageLayout/>,
                children: [
                    {
                        index: true,
                        element: <MyAnswersPage/>
                    }
                ]
            },

            // 내 블로그
            {
                path: "/:username",
                element: <MyBlogPageLayout/>,
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