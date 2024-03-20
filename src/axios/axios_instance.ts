// custom-instance.ts

import Axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {importData} from "@/axios/import-data.ts";

export const AUTH_AXIOS_INSTANCE = Axios.create({ baseURL: importData.VITE_AUTHORIZATION_SERVER_API_URL });
export const API_AXIOS_INSTANCE = Axios.create({ baseURL: importData.VITE_API_SERVER_URL });

export const authAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {

    const source = Axios.CancelToken.source();
    const promise = AUTH_AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};

export const apiAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = API_AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    promise.cancel = () => {
        source.cancel('Query was cancelled');
    };

    return promise;
};

export type ErrorType<Error> = AxiosError<Error>;
export type BodyType<BodyData> = BodyData;