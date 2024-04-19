// custom-instance.ts

import Axios, {AxiosError, AxiosRequestConfig} from 'axios';
import {importData} from "@/axios/import-data.ts";

export const MEMO_AXIOS_INSTANCE = Axios.create({ baseURL: importData.VITE_MEMO_SERVER_URL });
export const QUESTION_AXIOS_INSTANCE = Axios.create({ baseURL: importData.VITE_QUESTION_SERVER_URL });

export const memoAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = MEMO_AXIOS_INSTANCE({
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

export const questionAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = QUESTION_AXIOS_INSTANCE({
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