import {useNavigate} from "react-router-dom";

const ErrorPage = () => {

    const navigate = useNavigate()

    return (
        <div className="flex flex-col min-w-screen min-h-screen bg-background">
            <div
                className="flex w-full py-4 bg-transparent px-3 md:px-[50px] lg:px-[100px] xl:px-[150px] 2xl:px-[200px]">
                <div className="flex items-center cursor-pointer"
                     onClick={() => {
                         navigate('/')
                     }}>
                    <div className="logo-font text-3xl text-primary pt-1.5">MEMOCODE</div>
                </div>
            </div>

            <div className="flex flex-1 flex-col justify-center items-center bg-secondary leading-[50px]">
                <div className="text-[50px] logo-font tracking-wider">404</div>
                <div className="text-[30px] logo-font tracking-wider">Page Not Found.</div>
            </div>
        </div>
    )
}

export default ErrorPage;