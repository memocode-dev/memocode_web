export default {
    memo: {
        input: 'http://localhost:18081/memos/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/memo/api',
            schemas: 'src/openapi/memo/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
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
    question: {
        input: 'http://localhost:18082/questions/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/question/api',
            schemas: 'src/openapi/question/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'questionAxiosInstance',
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