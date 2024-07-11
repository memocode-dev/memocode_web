import React, {ReactNode, useState} from "react";
import {FindAllMemoCommentMemoCommentResult} from "@/openapi/model";

interface IModalContext {
    modalState: IModal;
    openModal: (modalOptions: IOpenModal<ModalTypes>) => void;
    closeModal: (closeOptions: ICloseModal) => void;
}

export enum ModalTypes {
    // 메모 버전
    MEMO_VERSIONS = "MEMO_VERSIONS",
    MEMO_VERSION = "MEMO_VERSION",
    MEMO_VERSION_DELETE = "MEMO_VERSION_DELETE",

    // 메모 미리보기
    MEMO_PREVIEW = "MEMO_PREVIEW",

    // 메모 보안
    MEMO_SECURITY = "MEMO_SECURITY",

    // 메모 상세정보
    MEMO_DETAIL_INFO = "MEMO_DETAIL_INFO",

    // 내 메모 검색
    MY_MEMO_SEARCH = "MY_MEMO_SEARCH",

    // 메모 전체 검색
    MEMOS_SEARCH = "MEMOS_SEARCH",

    // 시리즈 관리 - 수정
    MEMO_SERIES = "MEMO_SERIES",

    // 시리즈 관리 - 추가
    MEMO_SERIES_ADD = "MEMO_SERIES_ADD",

    // 메모 댓글 삭제
    MEMO_COMMENT_DELETE = "MEMO_COMMENT_DELETE",

    // 메모 댓글 수정
    MEMO_COMMENT_UPDATE = "MEMO_COMMENT_UPDATE",

    // 메모 답글 등록
    MEMO_CHILD_COMMENT_CREATE = "MEMO_CHILD_COMMENT_CREATE",

    // 블로그 소개 등록
    BLOG_INTRODUCTION_CREATE = "BLOG_INTRODUCTION_CREATE",

    // 질문 검색
    QUESTION_SEARCH = "QUESTION_SEARCH",

    // 질문 등록 - 취소
    QUESTION_CREATE_CANCEL = "QUESTION_CREATE_CANCEL",

    // 질문 삭제
    QUESTION_DELETE = "QUESTION_DELETE",

    // 질문 - 댓글 삭제
    QUESTION_COMMENT_DELETE = "QUESTION_COMMENT_DELETE",

    // 질문 - 댓글 수정
    QUESTION_COMMENT_UPDATE = "QUESTION_COMMENT_UPDATE",

    // 질문 - 대댓글 수정
    QUESTION_CHILD_COMMENT_UPDATE = "QUESTION_CHILD_COMMENT_UPDATE",

    // 태그 - 검색
    TAG_SEARCH = "TAG_SEARCH",

    // 커스텀 모나코 에디터 미리보기
    CUSTOM_MONACO_EDITOR_PREVIEW = "CUSTOM_MONACO_EDITOR_PREVIEW",

    MEMO_REPRESENTATIVE = "MEMO_REPRESENTATIVE",

    CREATE_MEMO_DETAIL_INFO = "CREATE_MEMO_DETAIL_INFO",
}

type IModal = {
    [ModalTypes.MEMO_VERSIONS]: {
        isVisible: boolean,
        data: {
            memoId: string,
        },
    },
    [ModalTypes.MEMO_VERSION]: {
        isVisible: boolean,
        data: {
            memoId: string,
            memoVersionId: string,
        },
    },
    [ModalTypes.MEMO_VERSION_DELETE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            memoVersionId: string,
        },
    },
    [ModalTypes.MEMO_PREVIEW]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.MEMO_SECURITY]: {
        isVisible: boolean,
        data: {
            memoId: string,
        },
    },
    [ModalTypes.MEMO_DETAIL_INFO]: {
        isVisible: boolean,
        data: {
            createNewMemo: boolean
        },
    },
    [ModalTypes.BLOG_INTRODUCTION_CREATE]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.MY_MEMO_SEARCH]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.MEMOS_SEARCH]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.QUESTION_SEARCH]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.MEMO_SERIES]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.MEMO_SERIES_ADD]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.QUESTION_CREATE_CANCEL]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.MEMO_COMMENT_DELETE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            commentId: string,
        },
    },
    [ModalTypes.MEMO_CHILD_COMMENT_CREATE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            commentId: string,
        },
    },
    [ModalTypes.MEMO_COMMENT_UPDATE]: {
        isVisible: boolean,
        data: {
            memoId: string,
            comment: FindAllMemoCommentMemoCommentResult,
        },
    },
    [ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]: {
        isVisible: boolean,
        data: {
            content: string,
        },
    },
    [ModalTypes.QUESTION_DELETE]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.QUESTION_COMMENT_DELETE]: {
        isVisible: boolean,
        data: {
            questionId: string,
            questionCommentId: string
        },
    },
    [ModalTypes.QUESTION_COMMENT_UPDATE]: {
        isVisible: boolean,
        data: {
            questionId: string,
            questionCommentId: string
        },
    },
    [ModalTypes.QUESTION_CHILD_COMMENT_UPDATE]: {
        isVisible: boolean,
        data: {
            questionId: string,
            questionCommentId: string,
            questionChildCommentId: string
        },
    },
    [ModalTypes.MEMO_REPRESENTATIVE]: {
        isVisible: boolean,
        data: {
            temp: string,
        }
    },
    [ModalTypes.CREATE_MEMO_DETAIL_INFO]: {
        isVisible: boolean,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    },
    [ModalTypes.TAG_SEARCH]: {
        isVisible: boolean,
        data: {
            keyword: string,
        },
    },
}

const initialModalState: IModal = {
    [ModalTypes.MEMO_VERSIONS]: {
        isVisible: false,
        data: {
            memoId: "",
        },
    },
    [ModalTypes.MEMO_VERSION]: {
        isVisible: false,
        data: {
            memoId: "",
            memoVersionId: "",
        },
    },
    [ModalTypes.MEMO_VERSION_DELETE]: {
        isVisible: false,
        data: {
            memoId: "",
            memoVersionId: "",
        },
    },
    [ModalTypes.MEMO_PREVIEW]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.MEMO_SECURITY]: {
        isVisible: false,
        data: {
            memoId: "",
        },
    }, [ModalTypes.MEMO_DETAIL_INFO]: {
        isVisible: false,
        data: {
            createNewMemo: true // 기본값 세 메모 생성
        },
    }, [ModalTypes.BLOG_INTRODUCTION_CREATE]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.MY_MEMO_SEARCH]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.MEMOS_SEARCH]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.QUESTION_SEARCH]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.MEMO_SERIES]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.MEMO_SERIES_ADD]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.QUESTION_CREATE_CANCEL]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.MEMO_CHILD_COMMENT_CREATE]: {
        isVisible: false,
        data: {
            memoId: "",
            commentId: "",
        },
    }, [ModalTypes.MEMO_COMMENT_DELETE]: {
        isVisible: false,
        data: {
            memoId: "",
            commentId: "",
        },
    }, [ModalTypes.MEMO_COMMENT_UPDATE]: {
        isVisible: false,
        data: {
            memoId: "",
            comment: {},
        },
    }
    , [ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW]: {
        isVisible: false,
        data: {
            content: "",
        },
    }, [ModalTypes.QUESTION_DELETE]: {
        isVisible: false,
        data: {
            // 어떤 데이터든 올 수 있습니다.
        },
    }, [ModalTypes.QUESTION_COMMENT_DELETE]: {
        isVisible: false,
        data: {
            questionId: "",
            questionCommentId: ""
        },
    }, [ModalTypes.QUESTION_COMMENT_UPDATE]: {
        isVisible: false,
        data: {
            questionId: "",
            questionCommentId: ""
        },
    }, [ModalTypes.QUESTION_CHILD_COMMENT_UPDATE]: {
        isVisible: false,
        data: {
            questionId: "",
            questionCommentId: "",
            questionChildCommentId: ""
        },
    }, [ModalTypes.MEMO_REPRESENTATIVE]: {
        isVisible: false,
        data: {
            temp: "",
        },
    }, [ModalTypes.CREATE_MEMO_DETAIL_INFO]: {
        isVisible: false,
        data: {},
    },
    [ModalTypes.TAG_SEARCH]: {
        isVisible: false,
        data: {
            keyword: "",
        },
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
