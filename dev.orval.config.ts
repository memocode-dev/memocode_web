export default {
    token: {
        input: 'https://auth.dev.memocode.dev/api/token/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/token/api',
            schemas: 'src/openapi/token/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/dev_axios_instance.ts',
                    name: 'tokenAxiosInstance',
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
                    path: './src/axios/dev_axios_instance.ts',
                    name: 'userAxiosInstance',
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
                    path: './src/axios/dev_axios_instance.ts',
                    name: 'memoAxiosInstance',
                },
            },
        },
    },
};