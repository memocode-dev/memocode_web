// custom-instance.ts

import Axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const PROD_TOKEN_AXIOS_INSTANCE = Axios.create({ baseURL: "https://auth.memocode.dev" });
export const PROD_USER_AXIOS_INSTANCE = Axios.create({ baseURL: "https://api.memocode.dev" });
export const PROD_MEMO_AXIOS_INSTANCE = Axios.create({ baseURL: "https://api.memocode.dev" });

export const tokenAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {

    const source = Axios.CancelToken.source();
    const promise = PROD_TOKEN_AXIOS_INSTANCE({
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

export const userAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = PROD_USER_AXIOS_INSTANCE({
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

export const memoAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = PROD_MEMO_AXIOS_INSTANCE({
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