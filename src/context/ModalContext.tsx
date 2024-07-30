'use client'

import React, {ReactNode, useState} from "react";
import {FindAllMemoCommentMemoCommentResult, FindAllQuestionCommentQuestionCommentResult} from "@/openapi/model";

interface IModalContext {
    modalState: IModal;
    openModal: (modalOptions: IOpenModal<ModalTypes>) => void;
    closeModal: (closeOptions: ICloseModal) => void;
}

export enum ModalTypes {

    // 메모 검색
    MEMO_SEARCH = "MEMO_SEARCH",

    // 메모 댓글/답글 삭제
    MEMO_COMMENT_DELETE = "MEMO_COMMENT_DELETE",

    // 메모 댓글/답글 수정
    MEMO_COMMENT_UPDATE = "MEMO_COMMENT_UPDATE",

    // 메모 답글 등록
    MEMO_CHILD_COMMENT_CREATE = "MEMO_CHILD_COMMENT_CREATE",


    // 나의 메모 버전리스트
    MY_MEMO_VERSIONS = "MY_MEMO_VERSIONS",

    // 나의 메모 버전
    MY_MEMO_VERSION = "MY_MEMO_VERSION",

    // 나의 메모 버전 삭제
    MY_MEMO_VERSION_DELETE = "MY_MEMO_VERSION_DELETE",

    // 나의 메모 보안
    MY_MEMO_SECURITY = "MY_MEMO_SECURITY",

    // 나의 메모 상세정보 등록
    MY_MEMO_CREATE_DETAIL_INFO = "MY_MEMO_CREATE_DETAIL_INFO",

    // 나의 메모 상세정보 수정
    MY_MEMO_UPDATE_DETAIL_INFO = "MY_MEMO_UPDATE_DETAIL_INFO",

    // 나의 메모 미리보기
    MY_MEMO_PREVIEW = "MY_MEMO_PREVIEW",

    // 나의 메모 검색
    MY_MEMO_SEARCH = "MY_MEMO_SEARCH",


    // 질문 검색
    QUESTION_SEARCH = "QUESTION_SEARCH",

    // 질문 등록 - 취소
    QUESTION_CREATE_CANCEL = "QUESTION_CREATE_CANCEL",

    // 질문 삭제
    QUESTION_DELETE = "QUESTION_DELETE",

    // 질문 답글 등록
    QUESTION_CHILD_COMMENT_CREATE = "QUESTION_CHILD_COMMENT_CREATE",

    // 질문 답변/답글 수정
    QUESTION_COMMENT_UPDATE = "QUESTION_COMMENT_UPDATE",

    // 질문 답변/답글 삭제
    QUESTION_COMMENT_DELETE = "QUESTION_COMMENT_DELETE",


    // 커스텀 모나코 에디터 미리보기
    CUSTOM_MONACO_EDITOR_PREVIEW = "CUSTOM_MONACO_EDITOR_PREVIEW",


    // 내블로그 유저정보 수정
    MY_BLOG_UPDATE_PROFILE = "MY_BLOG_UPDATE_PROFILE",


    // 임시
    // 시리즈 관리 - 수정
    MEMO_SERIES = "MEMO_SERIES",

    // 시리즈 관리 - 추가
    MEMO_SERIES_ADD = "MEMO_SERIES_ADD",
}

type IModal = {
    // 메모 검색
    [ModalTypes.MEMO_SEARCH]: {
        isVisible: boolean,
        data: {},
    },

    // 메모 댓글/답글 삭제
    [ModalTypes.MEMO_COMMENT_DELETE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            commentId: string,
        },
    },

    // 메모 댓글/답글 수정
    [ModalTypes.MEMO_COMMENT_UPDATE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            comment: FindAllMemoCommentMemoCommentResult,
        },
    },

    // 메모 답글 등록
    [ModalTypes.MEMO_CHILD_COMMENT_CREATE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            commentId: string,
        },
    },


    // 나의 메모 버전리스트
    [ModalTypes.MY_MEMO_VERSIONS]: {
        isVisible: boolean,
        data: {
            memoId: string,
        },
    },

    // 나의 메모 버전
    [ModalTypes.MY_MEMO_VERSION]: {
        isVisible: boolean,
        data: {
            memoId: string,
            memoVersionId: string,
        },
    },

    // 나의 메모 버전 삭제
    [ModalTypes.MY_MEMO_VERSION_DELETE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            memoVersionId: string,
        },
    },

    // 나의 메모 보안
    [ModalTypes.MY_MEMO_SECURITY]: {
        isVisible: boolean,
        data: {},
    },

    // 나의 메모 상세정보 등록
    [ModalTypes.MY_MEMO_CREATE_DETAIL_INFO]: {
        isVisible: boolean,
        data: {},
    },

    // 나의 메모 상세정보 수정
    [ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO]: {
        isVisible: boolean,
        data: {
            createNewMemo: boolean
        },
    },

    // 나의 메모 미리보기
    [ModalTypes.MY_MEMO_PREVIEW]: {
        isVisible: boolean,
        data: {},
    },

    // 나의 메모 검색
    [ModalTypes.MY_MEMO_SEARCH]: {
        isVisible: boolean,
        data: {},
    },


    // 질문 검색
    [ModalTypes.QUESTION_SEARCH]: {
        isVisible: boolean,
        data: {},
    },

    // 질문 등록 - 취소
    [ModalTypes.QUESTION_CREATE_CANCEL]: {
        isVisible: boolean,
        data: {},
    },

    // 질문 삭제
    [ModalTypes.QUESTION_DELETE]: {
        isVisible: boolean,
        data: {
            questionId: string,
        },
    },

    // 질문 댓글/답글 삭제
    [ModalTypes.QUESTION_COMMENT_DELETE]: {
        isVisible: boolean,
        data: {
            questionId: string,
            questionCommentId: string
        },
    },

    // 질문 댓글/답글 수정
    [ModalTypes.QUESTION_COMMENT_UPDATE]: {
        isVisible: boolean,
        data: {
            questionId: string,
            questionComment: FindAllQuestionCommentQuestionCommentResult
        },
    },

    // 질문 답글 등록
    [ModalTypes.QUESTION_CHILD_COMMENT_CREATE]: {
        isVisible: boolean,
        data: {
            questionId: string,
            questionCommentId: string,
        },
    },


    // 커스텀 모나코 에디터 미리보기
    [ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]: {
        isVisible: boolean,
        data: {
            content: string,
        },
    },


    // 내 블로그 유저 정보 수정
    [ModalTypes.MY_BLOG_UPDATE_PROFILE]: {
        isVisible: boolean,
        data: {
            username: string,
            userInfo: {
                introduce: string,
                email: string,
                git: string,
                profile: string,
            }
        },
    },



    // 임시
    [ModalTypes.MEMO_SERIES]: {
        isVisible: boolean,
        data: {},
    },
    [ModalTypes.MEMO_SERIES_ADD]: {
        isVisible: boolean,
        data: {},
    },
}

const initialModalState: IModal = {
    // 메모 검색
    [ModalTypes.MEMO_SEARCH]: {
        isVisible: false,
        data: {},
    },

    // 메모 댓글/답글 삭제
    [ModalTypes.MEMO_COMMENT_DELETE]: {
        isVisible: false,
        data: {
            memoId: "",
            commentId: "",
        },
    },

    // 메모 댓글/답글 수정
    [ModalTypes.MEMO_COMMENT_UPDATE]: {
        isVisible: false,
        data: {
            memoId: "",
            comment: {},
        },
    },

    // 메모 답글 등록
    [ModalTypes.MEMO_CHILD_COMMENT_CREATE]: {
        isVisible: false,
        data: {
            memoId: "",
            commentId: "",
        },
    },


    // 나의 메모 버전들
    [ModalTypes.MY_MEMO_VERSIONS]: {
        isVisible: false,
        data: {
            memoId: "",
        },
    },

    // 나의 메모 버전
    [ModalTypes.MY_MEMO_VERSION]: {
        isVisible: false,
        data: {
            memoId: "",
            memoVersionId: "",
        },
    },

    // 나의 메모 버전 삭제
    [ModalTypes.MY_MEMO_VERSION_DELETE]: {
        isVisible: false,
        data: {
            memoId: "",
            memoVersionId: "",
        },
    },

    // 나의 메모 보안
    [ModalTypes.MY_MEMO_SECURITY]: {
        isVisible: false,
        data: {},
    },

    // 나의 메모 상세정보 등록
    [ModalTypes.MY_MEMO_CREATE_DETAIL_INFO]: {
        isVisible: false,
        data: {},
    },

    // 나의 메모 상세정보 수정
    [ModalTypes.MY_MEMO_UPDATE_DETAIL_INFO]: {
        isVisible: false,
        data: {
            createNewMemo: true // 기본값 세 메모 생성
        },
    },

    // 나이 메모 미리보기
    [ModalTypes.MY_MEMO_PREVIEW]: {
        isVisible: false,
        data: {},
    },

    // 나의 메모 검색
    [ModalTypes.MY_MEMO_SEARCH]: {
        isVisible: false,
        data: {},
    },


    // 질문 검색
    [ModalTypes.QUESTION_SEARCH]: {
        isVisible: false,
        data: {},
    },

    // 질문 등록 - 취소
    [ModalTypes.QUESTION_CREATE_CANCEL]: {
        isVisible: false,
        data: {},
    },

    // 질문 삭제
    [ModalTypes.QUESTION_DELETE]: {
        isVisible: false,
        data: {
            questionId: "",
        },
    },

    // 질문 댓글/답글 삭제
    [ModalTypes.QUESTION_COMMENT_DELETE]: {
        isVisible: false,
        data: {
            questionId: "",
            questionCommentId: ""
        },
    },

    // 질문 댓글/답글 수정
    [ModalTypes.QUESTION_COMMENT_UPDATE]: {
        isVisible: false,
        data: {
            questionId: "",
            questionComment: {}
        },
    },

    // 질문 답글 등록
    [ModalTypes.QUESTION_CHILD_COMMENT_CREATE]: {
        isVisible: false,
        data: {
            questionId: "",
            questionCommentId: "",
        },
    },

    // 커스텀 모나코 에디터 미리보기
    [ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]: {
        isVisible: false,
        data: {
            content: "",
        },
    },

    // 내 블로그 유저 정보 수정
    [ModalTypes.MY_BLOG_UPDATE_PROFILE]: {
        isVisible: false,
        data: {
            username: "",
            userInfo: {
                introduce: "",
                email: "",
                git: "",
                profile: "",
            }
        },
    },


    // 임시
    [ModalTypes.MEMO_SERIES]: {
        isVisible: false,
        data: {},
    }, [ModalTypes.MEMO_SERIES_ADD]: {
        isVisible: false,
        data: {},
    },
};

export const ModalContext = React.createContext<IModalContext>({
    modalState: initialModalState,
    openModal: ({name, data}) => {
        console.log("Opening modal:", name, "with data:", data);
    },
    closeModal: ({name}) => {
        console.log("Closing modal:", name);
    },
});

export type IOpenModal<T extends ModalTypes> = {
    name: T;
    data?: IModal[T]['data'];
}

export type ICloseModal = {
    name: ModalTypes;
}

export function ModalProvider({children}: { children: ReactNode }) {
    const [modalState, setModalState] = useState<IModal>(initialModalState);

    const openModal: IModalContext["openModal"] = ({name, data}) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: true, data: data ?? {}},
        }));
    };

    const closeModal: IModalContext["closeModal"] = ({name}) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: false, data: initialModalState[name].data}, // 기본 상태로 복원합니다.
        }));
    };

    const contextValue = {
        modalState,
        openModal,
        closeModal,
    }

    return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}