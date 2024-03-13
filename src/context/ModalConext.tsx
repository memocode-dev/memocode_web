import React, {ReactNode, useState} from "react";

interface IModalContext {
    modalState: IModal;
    openModal: ({name, data}: IOpenModal) => void;
    closeModal: ({name}: IOpenClose) => void;
}

export const ModalContext = React.createContext<IModalContext>({
    modalState: {},
    openModal: ({name, data}) => {
        console.log("Opening modal:", name, "with data:", data);
    },
    closeModal: ({name}) => {
        console.log("Closing modal:", name);
    },
});

export type IOpenModal = {
    name: string
    data?: string
}

export type IOpenClose = {
    name: string
}

interface IModal {
    [key: string]: {
        isVisible?: boolean;
        data?: string;
    };
}

export function ModalProvider({children}: { children: ReactNode }) {
    const [modalState, setModalState] = useState<IModal>({});

    const openModal = ({name, data}: IOpenModal) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: true, data},
        }));
    }

    const closeModal = ({name}: IOpenClose) => {
        setModalState((prev) => ({
            ...prev,
            [name]: {isVisible: false, data: undefined},
        }));
    };

    const contextValue = {
        modalState,
        openModal,
        closeModal,
    }

    return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
}

export const ModalTypes = Object.freeze({
    // 메모 버전
    MEMO_VERSIONS: "MEMO_VERSIONS",
});