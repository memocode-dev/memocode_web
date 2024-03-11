import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

const authorization_server_url = import.meta.env.VITE_AUTHORIZATION_SERVER_API_URL
const api_server_url = import.meta.env.VITE_API_SERVER_URL
const token_uri = import.meta.env.VITE_TOKEN_API_JSON_URI
const user_uri = import.meta.env.VITE_USER_API_JSON_URI
const memo_uri = import.meta.env.VITE_MEMO_API_JSON_URI

const Api = () => {
    return (
        <div className="flex-1 px-[10px]">
            <SwaggerUI url={`${authorization_server_url}${token_uri}`} />
            <SwaggerUI url={`${api_server_url}${user_uri}`} />
            <SwaggerUI url={`${api_server_url}${memo_uri}`} />
        </div>
    )
}

export default Api;