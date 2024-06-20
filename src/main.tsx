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
import MyBlogSeriesDetailPage from "@/pages/@userInfo/MyBlogSeriesDetailPage.tsx";
import {KeycloakProvider} from "@/context/KeycloakContext.tsx";
import MemoSeriesManagementPage from "@/pages/w/MemoSeriesManagementPage.tsx";
import QuestionCreatePage from "@/pages/questions/QuestionCreatePage.tsx";
import QuestionEditPage from "@/pages/questions/QuestionEditPage.tsx";
import MemoPage from "@/pages/@userInfo/MemoPage.tsx";
import MyBlogQnAPage from "@/pages/@userInfo/MyBlogQnAPage.tsx";
import MyQuestionsTabPage from "@/pages/@userInfo/MyQuestionsTabPage.tsx";
import MyAnswersTabPage from "@/pages/@userInfo/MyAnswersTabPage.tsx";
import ErrorPage from "@/pages/error/ErrorPage.tsx";
import LoadingPage from "@/pages/loading/LoadingPage.tsx";

const queryClient = new QueryClient()

function preloadComponent(componentLoader: () => void): void {
    setTimeout(componentLoader, 1000);
}

// Lazy-loaded components
const MainPage = React.lazy(() => import('./pages/MainPage.tsx'));
preloadComponent(() => import('./pages/MainPage.tsx'));
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
const MyBlogAboutPage = React.lazy(() => import('@/pages/@userInfo/MyBlogAboutPage.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogAboutPage.tsx'));
const MyBlogMemosPage = React.lazy(() => import('@/pages/@userInfo/MyBlogMemosPage.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogMemosPage.tsx'));
const MyBlogSeriesPage = React.lazy(() => import('@/pages/@userInfo/MyBlogSeriesPage.tsx'));
preloadComponent(() => import('@/pages/@userInfo/MyBlogSeriesPage.tsx'));
const ApiPage = React.lazy(() => import('@/pages/api/ApiPage.tsx'));

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
                            <Suspense fallback={<LoadingPage/>}>
                                <App/>
                            </Suspense>
                        </KeycloakProvider>
                    </ModalProvider>
                </ThemeProvider>
            </QueryClientProvider>
        ),
        errorElement: <ErrorPage/>,
        children: [
            // 메인 페이지
            {
                index: true,
                path: "/",
                element: <MainPage/>,
            },

            // @userInfo - 메모 상세페이지
            {
                index: true,
                path: "/:username/:memoId",
                element: <MemoPage/>,
            },

            // @userInfo - 내 블로그 페이지
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
                        element: <MyBlogAboutPage/>
                    },
                    // 게시글
                    {
                        path: "memos",
                        element: <MyBlogMemosPage/>
                    },
                    // 시리즈
                    {
                        path: "series",
                        element: <MyBlogSeriesPage/>
                    },
                    // 질문&답변
                    {
                        path: "q&a",
                        element: <MyBlogQnAPage/>,
                        children: [
                            {
                                index: true,
                                element: <MyQuestionsTabPage/>
                            },
                            {
                                path: "questions",
                                element: <MyQuestionsTabPage/>
                            },
                            {
                                path: "answers",
                                element: <MyAnswersTabPage/>
                            }
                        ]
                    },
                ]
            },

            // @userInfo - 시리즈 상세페이지
            {
                index: true,
                path: "/:username/series/:seriesTitle",
                element: <MyBlogSeriesDetailPage/>
            },

            // questions - Q&A 모아보기
            {
                path: "/questions",
                element: <QuestionsPageLayout/>,
                children: [
                    // 질문 전체조회 페이지
                    {
                        index: true,
                        element: <QuestionsPage/>
                    },
                    // questions - 질문 등록 페이지
                    {
                        path: "ask",
                        element: <QuestionCreatePage/>
                    },
                    // 질문 전체조회 - 최신순 정렬
                    {
                        path: "recent",
                        element: <QuestionsPage/>
                    },
                    // 질문 전체조회 - 좋아요순 정렬
                    {
                        path: "like",
                        element: <QuestionsPage/>
                    },
                    // 질문 전체조회 - 답변많은순 정렬
                    {
                        path: "comment",
                        element: <QuestionsPage/>
                    },
                ]
            },

            // questions - 질문 상세페이지
            {
                path: "/questions/:questionId",
                element: <QuestionPage/>
            },

            // questions - 질문 수정페이지
            {
                path: "/questions/edit/:questionId",
                element: <QuestionEditPage/>
            },

            // w - 메모 편집 페이지
            {
                path: "/w",
                element: <MemoWritePageLayout/>,
                children: [
                    // 메모 생성 페이지
                    {
                        index: true,
                        element: <MemoCreatePage/>
                    },
                    // 메모 수정 페이지
                    {
                        path: ":memoId",
                        element: <MemoEditPage/>
                    },
                    // 시리즈 관리 페이지
                    {
                        path: "series",
                        element: <MemoSeriesManagementPage/>
                    }
                ]
            },

            // api - 스웨거 페이지
            {
                index: true,
                path: "/api",
                element: <ApiPage/>,
            },
        ]
    }]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}/>,
)