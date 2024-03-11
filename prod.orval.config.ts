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
                    path: './src/axios/prod_axios_instance.ts',
                    name: 'memoAxiosInstance',
                },
            },
        },
    },
};