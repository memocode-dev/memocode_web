import React, {ReactNode, useState} from "react";

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
    }
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
    }
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

    const openModal: IModalContext["openModal"] = ({ name, data }) => {
        setModalState((prev) => ({
            ...prev,
            [name]: { isVisible: true, data: data ?? {} },
        }));
    };

    const closeModal: IModalContext["closeModal"] = ({ name }) => {
        setModalState((prev) => ({
            ...prev,
            [name]: { isVisible: false, data: initialModalState[name].data }, // 기본 상태로 복원합니다.
        }));
    };

    const contextValue = {
        modalState,
        openModal,
        closeModal,
    }

    return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}