import {Button} from "@/components/ui/button";


interface internalErrorProps {
    onClick: () => void;
    className?: string;
}

const InternalError = ({onClick, className}: internalErrorProps) => {
    return (
        <div
            className={`flex flex-col space-y-2 flex-1 justify-center items-center h-full ${className ? className : ""}`}>
            <div className="flex space-x-2 items-center">
                <div>잠시후 다시 시도해주세요.</div>
                <Button
                    color="danger"
                    type="button"
                    onClick={onClick}
                    className="max-w-md ml-[15px]"
                >
                    재시도
                </Button>
            </div>
        </div>
    )
}

export default InternalError;