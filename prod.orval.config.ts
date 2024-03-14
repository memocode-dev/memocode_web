export default {
    token: {
        input: 'https://auth.memocode.dev/api/token/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/token/api',
            schemas: 'src/openapi/token/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/prod_axios_instance.ts',
                    name: 'tokenAxiosInstance',
                },
            },
        },
    },
    user: {
        input: 'https://api.memocode.dev/users/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/user/api',
            schemas: 'src/openapi/user/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/prod_axios_instance.ts',
                    name: 'userAxiosInstance',
                },
            },
        },
    },
    memo: {
        input: 'https://api.memocode.dev/memos/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/memo/api',
            schemas: 'src/openapi/memo/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/dev_axios_instance.ts',
                    name: 'memoAxiosInstance',
                },
                query: {
                    useQuery: true,
                    useInfinite: true,
                    useInfiniteQueryParam: 'page', // 다음 페이지 데이터를 가져오는 데 사용될 쿼리 파라미터
                    options: {
                        staleTime: 10000, // 캐시 데이터의 신선도 유지 시간
                    },
                    signal: true, // 요청 취소 기능 활성화
                },
            },
        },
    },
};