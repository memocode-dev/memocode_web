interface DragPagProps {
    className: string;
    width: number;
    height?: number;
}

const DragPage = ({className, width, height}: DragPagProps) => {
    return (
        <div className={`fixed bg-black bg-opacity-30 z-50 flex items-center justify-center ${className}`}
             style={{width, height}}>
            <div className="text-white text-lg">이미지를 여기에 드롭하세요</div>
        </div>
    );

}

export default DragPage;