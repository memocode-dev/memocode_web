import {createContext, ReactNode, useEffect, useState} from "react";
import {generateRandomString, generateVerifierAndChallenge} from "../lib/pkceUtils.ts";
import axios, {AxiosRequestConfig} from "axios";
import {useLocation, useNavigate} from "react-router-dom";
import {parseJwt} from "@/lib/jwt.ts";
import {
    AUTH_AXIOS_INSTANCE,
    API_AXIOS_INSTANCE,
} from "@/axios/axios_instance.ts";
import {useUserInfo} from "@/openapi/user/api/users/users.ts";

const UserContext = createContext<{
    login: () => void,
    logout: () => Promise<void>,
    user_info: IUserInfo,
    token_endpoint: ({grant_type, code}: TokenEndpointProperties) => Promise<{
        status: string,
        access_token: string,
    }>
}>({
    login: () => {
    },
    logout: async () => undefined,
    user_info: {
        authority: "NOT_LOGIN",
        username: "",
        nickname: "",
    },
    token_endpoint: () => {
        return new Promise((resolve) => {
            resolve({
                status: "",
                access_token: "",
            })
        });
    }
})

interface TokenEndpointProperties {
    grant_type: "refresh_token" | "authorization_code";
    code?: string;
}

interface IUserInfo {
    authority: "NOT_LOGIN" | "ANONYMOUS" | "USER" | "ADMIN";
    username: string;
    nickname: string;
}

let axios_access_token = "";
let axios_authority = "NOT_LOGIN";

function set_axios_accessToken(newToken: string) {
    axios_access_token = newToken;
}

function set_axios_authority(newToken: string) {
    axios_authority = newToken;
}

let isRefreshing = false;
const refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
    refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
    refreshSubscribers.map(cb => cb(token));
    refreshSubscribers.length = 0;
};

export function UserProvider({children}: { children: ReactNode }) {

    const authorization_server_url = import.meta.env.VITE_AUTHORIZATION_SERVER_API_URL
    const authorization_server_client_id = import.meta.env.VITE_AUTHORIZATION_SERVER_CLIENT_ID
    const authorization_server_redirect_url = import.meta.env.VITE_AUTHORIZATION_SERVER_REDIRECT_URL

    const [access_token, set_access_token] = useState<string>("")
    const [user_info, set_user_info] = useState<IUserInfo>({
        authority: "NOT_LOGIN",
        username: "",
        nickname: "",
    })

    const navigate = useNavigate();
    const location = useLocation();

    const {data: user_info_data} = useUserInfo({
        query: {
            queryKey: ['user_info', axios_access_token],
            retry: 10,
            enabled: !!axios_access_token,
        },
    });

    useEffect(() => {
        if (user_info_data) {
            set_user_info({
                ...user_info,
                username: user_info_data.username || "ERROR",
                nickname: user_info_data.nickname || "ERROR",
            })
        }
    }, [user_info_data]);

    const login = async () => {
        const {verifier, challenge} = await generateVerifierAndChallenge()
        const state = generateRandomString()

        localStorage.setItem("before_uri", location.pathname);
        localStorage.setItem("verifier", verifier)
        localStorage.setItem("state", state)

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: authorization_server_client_id,
            state,
            code_challenge: challenge,
            code_challenge_method: 'S256',
            redirect_uri: authorization_server_redirect_url,
            scope: "openid",
        })

        window.location.href =
            `${authorization_server_url}/oauth2/authorize?${params.toString()}`
    }

    const logout = async () => {
        remove_access_token()

        await axios.delete(`${authorization_server_url}/api/token/refresh`, {withCredentials: true})
    }

    const token_endpoint = async ({grant_type, code}: TokenEndpointProperties) => {
        try {
            const response = await axios.post(`${authorization_server_url}/api/token`, {
                grant_type,
                code,
                redirect_uri: authorization_server_redirect_url,
                ...(grant_type === "authorization_code" && { code_verifier: localStorage.getItem("verifier") }),
                client_id: authorization_server_client_id,
            }, {
                headers: {
                    "Content-type": "application/json",
                },
                withCredentials: true,
            })

            console.log(response);

            return {
                status: "SUCCESS",
                access_token: response.data.access_token
            }
        } catch (error) {
            console.log(error)
            return {
                status: "FAIL",
                access_token: "",
            }
        }
    }

    const remove_access_token = () => {
        localStorage.removeItem("access_token");
        set_access_token("");
        set_axios_accessToken("");
    }

    const save_access_token = (token: string) => {
        localStorage.setItem("access_token", token);
        set_access_token(token);
        set_axios_accessToken(token);
    }

    const get_access_token = async (): Promise<string> => {
        if (axios_access_token) {
            const {exp} = parseJwt(axios_access_token);
            if (exp > Math.floor(Date.now() / 1000)) {
                return axios_access_token;
            }
        }

        if (!isRefreshing) {
            isRefreshing = true;
            const response = await token_endpoint({ grant_type: "refresh_token" });
            if (response.status === "FAIL") {
                await logout();
            } else {
                save_access_token(response.access_token);
                isRefreshing = false;
                onRrefreshed(response.access_token);
            }
        } else {
            return new Promise((resolve) => {
                subscribeTokenRefresh((token) => {
                    resolve(token);
                });
            });
        }

        return axios_access_token;
    };

    useEffect(() => {
        if (access_token) {
            const {authority} = parseJwt(access_token);

            set_axios_authority(authority);
            set_user_info({
                ...user_info,
                authority: authority,
            });
        } else {
            set_axios_authority("NOT_LOGIN");
            set_user_info({
                ...user_info,
                authority: "NOT_LOGIN",
            });
        }
    }, [access_token]);

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code');

        if (code) {
            (async () => {
                const response = await token_endpoint({
                    grant_type: "authorization_code",
                    code: code,
                })

                if (response.status === "SUCCESS") {
                    save_access_token(response.access_token)
                }

                const before_uri = localStorage.getItem("before_uri");

                if (before_uri) {
                    navigate(before_uri)
                } else {
                    navigate("/")
                }

            })()
        } else {
            (async () => {
                try {
                    const response = await token_endpoint({
                        grant_type: "refresh_token",
                    })

                    save_access_token(response.access_token)
                } catch (error) {console.log(error)}
            })()
        }
    }, []);

    useEffect(() => {

        const interceptorFunction = async (config: AxiosRequestConfig) => {
            return {
                ...config,
                headers: axios_authority !== "NOT_LOGIN"
                    ? {
                        ...config.headers,
                        Authorization: `Bearer ${await get_access_token()}`,
                    }
                    : config.headers,
            };
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const auth_axios_instance_intercepter = AUTH_AXIOS_INSTANCE.interceptors.request.use(interceptorFunction);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const api_axios_instance_intercepter = API_AXIOS_INSTANCE.interceptors.request.use(interceptorFunction);

        return () => {
            AUTH_AXIOS_INSTANCE.interceptors.request.eject(auth_axios_instance_intercepter);
            API_AXIOS_INSTANCE.interceptors.request.eject(api_axios_instance_intercepter);
        };
    }, [])

    return (
        <UserContext.Provider value={{
            login,
            logout,
            user_info,
            token_endpoint,
        }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserContext;