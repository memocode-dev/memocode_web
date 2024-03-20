export default {
    token: {
        input: `https://auth.dev.memocode.dev/api/token/api-docs`,
        output: {
            mode: 'tags-split',
            target: 'src/openapi/token/api',
            schemas: 'src/openapi/token/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'authAxiosInstance',
                },
            },
        },
    },
    user: {
        input: 'https://api.dev.memocode.dev/users/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/user/api',
            schemas: 'src/openapi/user/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'apiAxiosInstance',
                },
            },
        },
    },
    memo: {
        input: 'https://api.dev.memocode.dev/memos/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/memo/api',
            schemas: 'src/openapi/memo/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'apiAxiosInstance',
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
    question: {
        input: 'https://api.dev.memocode.dev/questions/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/question/api',
            schemas: 'src/openapi/question/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'apiAxiosInstance',
                },
                query: {
                    useQuery: true,
                    useInfinite: true,
                    useInfiniteQueryParam: 'pageable', // 다음 페이지 데이터를 가져오는 데 사용될 쿼리 파라미터
                    options: {
                        staleTime: 10000, // 캐시 데이터의 신선도 유지 시간
                    },
                    signal: true, // 요청 취소 기능 활성화
                },
            },
        },
    },
};