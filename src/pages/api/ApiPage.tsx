import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"
import {importData} from "@/axios/import-data.ts";

const ApiPage = () => {
    return (
        <div className="flex-1 px-[10px] mt-10 pb-12 md:pb-0">
            <SwaggerUI url={`${importData.VITE_MEMOCODE_SERVER_URL}${importData.VITE_SWAGGER_DOCS_API_URI}`} />
        </div>
    )
}

export default ApiPage;