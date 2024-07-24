'use client'

import React, {createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState} from 'react';
import Keycloak, {KeycloakConfig} from 'keycloak-js';
import {AxiosRequestConfig} from 'axios';
import {MEMOCODE_AXIOS_INSTANCE} from '@/axios/axios_instance';
import {importData} from '@/axios/import-data';
import {useCreateAccessTokenCookie, useDeleteAccessTokenCookie} from "@/openapi/api/cookie/cookie";
import {Bounce, toast} from "react-toastify";
import {useTheme} from "@/context/ThemeContext";


const initOptions: KeycloakConfig = {
    url: importData.NEXT_PUBLIC_AUTH_SERVER_URL || '',
    realm: importData.NEXT_PUBLIC_AUTH_SERVER_REALM || '',
    clientId: 'react-client',
};

interface IUserInfo {
    id: string;
    email: string;
    username: string;
    roles: string[];
    first_name: string;
    last_name: string;
}

interface KeycloakContextValue {
    isLogined: boolean;
    login: () => void;
    logout: () => void;
    user_info: IUserInfo;
}

// Context 생성 with 초기값
const KeycloakContext = createContext<KeycloakContextValue | undefined>(undefined);

interface KeycloakProviderProps {
    children: ReactNode;
}

// Context의 Provider 컴포넌트
export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({children}) => {
    const didInit = useRef(false);
    const {theme} = useTheme()

    const [isLogined, setIsLogined] = useState<boolean>(false);
    const [user_info, set_user_info] = useState<IUserInfo>({
        id: '',
        email: '',
        username: '',
        roles: [],
        first_name: '',
        last_name: '',
    });

    const kc = useMemo(() => {
        if (typeof window !== 'undefined') {
            return new Keycloak(initOptions);
        }
        return null;
    }, []);

    /* 이미지 업로드 */
    const {mutateAsync: createAccessTokenCookie} = useCreateAccessTokenCookie();

    const handleCreateAccessTokenCookie = async () => {
        try {
            const response = await createAccessTokenCookie();
            console.log("response", response)
        } catch (e) {
            console.error(e);
            toast.error("쿠키 업데이트에 실패하였습니다.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm"
            });
        }
    }

    /* 쿠키 삭제 */
    const {mutateAsync: deleteAccessTokenCookie} = useDeleteAccessTokenCookie();

    const handleDeleteAccessTokenCookie = async () => {
        try {
            const response = await deleteAccessTokenCookie();
            console.log("response", response)
        } catch (e) {
            console.error(e);
            toast.error("쿠키 삭제에 실패하였습니다.", {
                position: "bottom-right",
                theme: theme,
                transition: Bounce,
                className: "text-sm"
            });
        }
    }

    useEffect(() => {
        if (!kc || didInit.current) return;

        didInit.current = true;

        // 인증 상태 변경 시 isLogined 상태 업데이트
        kc.onAuthSuccess = async () => {
            if (process.env.NODE_ENV !== 'production') {
                localStorage.setItem('access_token', kc.token!);
            }

            const tokenParsed = kc.tokenParsed;
            const idTokenParsed = kc.idTokenParsed;

            set_user_info({
                email: idTokenParsed!.email,
                username: idTokenParsed!.username,
                roles: tokenParsed!.realm_access!.roles,
                first_name: idTokenParsed!.first_name,
                last_name: idTokenParsed!.last_name,
                id: idTokenParsed!.sub!,
            });
            setIsLogined(kc.authenticated!);
            await handleCreateAccessTokenCookie();
        };
        kc.onAuthLogout = () => {
            setIsLogined(kc.authenticated!);
        };
        kc.onAuthRefreshError = () => {
            setIsLogined(kc.authenticated!);
        };

        kc.init({
            onLoad: 'check-sso',
            checkLoginIframe: false,
            pkceMethod: 'S256',
        });
    }, [kc]);

    const login = () => {
        kc?.login();
    };

    const logout = async () => {
        await handleDeleteAccessTokenCookie();
        kc?.logout();
    };

    useEffect(() => {
        const interceptorFunction = async (config: AxiosRequestConfig) => {
            const getAuthorizationHeader = async () => {
                if (!kc?.authenticated) {
                    return {};
                }

                const isTokenExpired = kc.isTokenExpired(10);
                if (isTokenExpired) {
                    await kc.updateToken(10);
                    await handleCreateAccessTokenCookie();
                }

                return {
                    Authorization: `Bearer ${kc.token}`,
                };
            };

            const authorizationHeader = await getAuthorizationHeader();

            return {
                ...config,
                headers: {
                    ...config.headers,
                    ...authorizationHeader,
                },
            };
        };

        // @ts-ignore
        const memocode_axios_instance_intercepter = MEMOCODE_AXIOS_INSTANCE.interceptors.request.use(interceptorFunction);

        return () => {
            MEMOCODE_AXIOS_INSTANCE.interceptors.request.eject(memocode_axios_instance_intercepter);
        };
    }, [kc]);

    return (
        <KeycloakContext.Provider value={{isLogined, login, logout, user_info}}>
            {children}
        </KeycloakContext.Provider>
    );
};

// Context를 사용하기 위한 Custom Hook
export const useKeycloak = (): KeycloakContextValue => {
    const context = useContext(KeycloakContext);
    if (context === undefined) {
        throw new Error('useKeycloak must be used within a KeycloakProvider');
    }
    return context;
};
