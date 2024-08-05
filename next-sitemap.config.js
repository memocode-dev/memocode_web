import fetch from 'node-fetch';

async function getMemos({page, pageSize}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_MEMOCODE_SERVER_URL}/memos?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) {
        return {content: []};
    }
    return res.json();
}

async function getQuestions({page, pageSize}) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_MEMOCODE_SERVER_URL}/questions?page=${page}&pageSize=${pageSize}`);
    if (!res.ok) {
        return {content: []};
    }
    return res.json();
}

export default {
    siteUrl: process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev',
    generateRobotsTxt: true,
    sitemapSize: 50000,
    changefreq: 'daily',
    priority: 0.7,
    exclude: [
        '/w',
        '/api',
    ],
    robotsTxtOptions: {
        policies: [
            {userAgent: '*', allow: '/'},
            {userAgent: '*', allow: '/memos'},
            {userAgent: '*', allow: '/questions'},
            {userAgent: '*', allow: '/questions/ask'},
            {userAgent: '*', disallow: '/w'},
            {userAgent: '*', disallow: '/api'},
        ],
    },
    additionalPaths: async (config) => {
        const memos = [];

        let memoPage = 0;
        const memoPageSize = 100;
        while (true) {
            const searchMemos = await getMemos({page: memoPage, pageSize: memoPageSize});
            memos.push(...searchMemos.content);

            if (searchMemos.last) {
                break;
            }

            if (memos.length > 50000) {
                break;
            }

            memoPage = memoPage + 1;
        }

        const questions = [];

        let questionPage = 0;
        const questionPageSize = 100;
        while (true) {
            const searchQuestions = await getQuestions({page: questionPage, pageSize: questionPageSize});
            questions.push(...searchQuestions.content);

            if (searchQuestions.last) {
                break;
            }

            if (questions.length > 50000) {
                break;
            }

            questionPage = questionPage + 1;
        }

        const staticPaths = [
            {
                loc: `${process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev'}/`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 1,
            },
            {
                loc: `${process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev'}/memos`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 1,
            },
            {
                loc: `${process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev'}/questions`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 1,
            },
            {
                loc: `${process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev'}/questions/ask`,
                lastmod: new Date().toISOString(),
                changefreq: 'daily',
                priority: 1,
            }
        ];

        const memoPaths = memos.map((memo) => ({
            loc: `${process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev'}/@${memo.user?.username}/memos/${memo.id}`,
            lastmod: new Date(memo.updatedAt).toISOString(),
            changefreq: 'daily',
            priority: 1,
        }));

        const questionPaths = questions.map((question) => ({
            loc: `${process.env.NEXT_PUBLIC_MEMOCODE_LOCAL_URL || 'https://memocode.dev'}/questions/${question.id}`,
            lastmod: new Date(question.updatedAt).toISOString(),
            changefreq: 'daily',
            priority: 1,
        }));

        return [...staticPaths, ...memoPaths, ...questionPaths];
    },
};
