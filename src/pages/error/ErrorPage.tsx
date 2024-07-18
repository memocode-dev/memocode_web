const ErrorPage = () => {

    return (
        <div className="flex flex-col flex-1 min-w-screen min-h-screen">
            <div
                className="flex flex-1 flex-col justify-center items-center bg-secondary leading-[35px] md:leading-[50px]">
                <div className="text-[25px] md:text-[40px] logo-font tracking-wider">404</div>
                <div className="text-[15px] md:text-[20px] logo-font tracking-wider">Page Not Found.</div>
            </div>
        </div>
    )
}

export default ErrorPage;