export default {
    memocode: {
        input: 'https://api.memocode.dev/memocode/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/openapi/api',
            schemas: 'src/openapi/model',
            client: 'react-query',
            mock: false,
            override: {
                mutator: {
                    path: './src/axios/axios_instance.ts',
                    name: 'memocodeAxiosInstance',
                },
            },
        },
    },
};