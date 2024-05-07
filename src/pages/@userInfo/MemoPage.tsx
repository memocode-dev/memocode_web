import {useNavigate, useParams} from "react-router-dom";
import UpToDownButton from "@/components/ui/UpToDownButton.tsx";
import {useFindMemo} from "@/openapi/api/memos/memos.ts";
import Avatar from "react-avatar";
import {Badge} from "@/components/ui/badge.tsx";
import DOMPurify from "dompurify";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import mermaid from "mermaid";
import {faker} from "@faker-js/faker";
import MemoPage__MemoAnchorLinkBar from "@/page_components/memo_page/MemoPage__MemoAnchorLinkBar.tsx";
import {MdPlayArrow} from "react-icons/md";
import MemoPage__MemoComments from "@/page_components/memo_page/MemoPage__MemoComments.tsx";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "react-toastify";
import {
    useCreateMemoComment, useFindAllMemoComment,
} from "@/openapi/api/memos-memocomments/memos-memocomments.ts";

interface Heading {
    hId: number;
    text: string;
    index: number;
}

const MemoPage = () => {

    const {memoId, username} = useParams();
    const {theme} = useContext(ThemeContext)

    const [comment, setComment] = useState("")
    const [renderedContent, setRenderedContent] = useState("")
    const [headings, setHeadings] = useState<Heading[]>([])
    const [beforeHover, setBeforeHover] = useState<boolean>(false)
    const [afterHover, setAfterHover] = useState<boolean>(false)
    const navigate = useNavigate()

    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    if (!/^@[a-z\d]+$/.test(username as string)) {
        throw new Error();
    }

    const {data: memo} = useFindMemo(memoId!, {
        query: {
            queryKey: ['MemoPage', memoId!],
        }
    });

    const {
        refetch: commentsRefetch,
    } = useFindAllMemoComment(
        memoId!, {
            query: {
                queryKey: ['MemoPage__MemoComments', memoId],
            }
        });

    const {mutate: createComment} = useCreateMemoComment({
        mutation: {
            onSuccess: async () => {
                setComment("")
                toast.success("성공적으로 댓글이 등록되었습니다.")
                await commentsRefetch()
            },
            onError: (error) => {
                console.log(error)
                toast.error("관리자에게 문의하세요")
            }
        }
    })

    const onCreateCommentSubmit = () => createComment({
        memoId: memoId!,
        data: {
            content: comment
        }
    })

    const handleClickBeforePost = () => {
        console.log("before")
    }

    const handleClickAfterPost = () => {
        console.log("after")
    }

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [memo, theme]);

    // 점프 링크
    useEffect(() => {
        if (memo?.content) {
            // H1, H2, H3 텍스들 추출하여 newHeadings 배열에 담기
            const headingRegex = /(?:^|\n)(#{1,3})\s+(.*)/g;
            let match;
            const newHeadings = [];
            let index = 0; // 각 제목에 대한 고유 인덱스
            while ((match = headingRegex.exec(memo.content)) !== null) {
                newHeadings.push({
                    hId: match[1].length, // #의 길이로 h1, h2, h3 구분
                    text: match[2].trim(), // 해당 텍스트
                    index: ++index, // 해당 인덱스
                });
            }

            // newHeadings에 담긴 H1, H2, H3들을 html-h 태그로 변환하고, anchor link 이동을 위한 id 주기
            let htmlContent = memo.content;
            newHeadings.forEach(heading => {
                const tag = `h${heading.hId}`;
                const escapedText = escapeRegExp(heading.text);
                const regex = new RegExp(`(?:^|\\n)#{${heading.hId}}\\s+${escapedText}`);
                htmlContent = htmlContent.replace(regex, `<${tag} id="heading${heading.hId}_${heading.index}">${heading.text}</${tag}>`);
            });

            const markdownRenderHtmlContent = MarkdownView.render(htmlContent); // 마크다운 렌더
            const sanitizedHtmlContent = DOMPurify.sanitize(markdownRenderHtmlContent); // 안전하게 살균
            setRenderedContent(sanitizedHtmlContent);

            setHeadings(newHeadings);
        }
    }, [memo]);

    // 가짜 데이터 생성
    const fakerData = {tags: Array.from({length: faker.datatype.number({min: 1, max: 20})}, () => faker.random.word())};

    const MemoPage__MemoTitleZone = (
        <div className="bg-background border-b border-b-gray-300 pb-1">
            <div className="text-2xl sm:text-4xl font-bold leading-snug break-all">
                {memo?.title}
            </div>

            <div className="flex justify-between items-center mt-7">
                <div className="flex items-center space-x-1.5 cursor-pointer"
                     onClick={() => {
                         navigate(`/@${memo?.user?.username}/about`)
                     }}>
                    <Avatar
                        name={memo?.user?.username}
                        size="25"
                        round="5px"/>
                    <div className="tracking-wider">{memo?.user?.username}</div>
                </div>

                <div>
                    <div className="text-gray-500 dark:text-gray-300 tracking-wider">
                        {memo?.createdAt && new Date(memo.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    )

    const MemoPage__MemoContentZone = (
        <>
            <div className="flex flex-wrap pt-10 cursor-default">
                {fakerData.tags.map((tag: string, index) => {
                    return (
                        <div key={index}>
                            <Badge
                                className="text-md text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mx-1 my-1">{tag}</Badge>
                        </div>
                    );
                })}
            </div>

            <div className="bg-background border-b border-b-gray-300 px-1 py-10">
                <div className="text-lg font-medium leading-snug break-all">
                    <div className="markdown-body"
                         dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(MarkdownView.render(renderedContent || ""))}}></div>
                </div>
            </div>

            <MemoPage__MemoAnchorLinkBar headings={headings}/>
        </>
    )

    const MemoPage__MemoBeforeButton = (
        <div className="flex flex-1 px-5 items-center">
            <div
                className="flex flex-1 items-center space-x-2 cursor-pointer hover:animate-headShake hover:text-indigo-500"
                onMouseOver={() => setBeforeHover(true)}
                onMouseOut={() => setBeforeHover(false)}
                onClick={handleClickBeforePost}
            >
                <MdPlayArrow className="hidden sm:flex w-6 h-6 rotate-180"/>
                <div
                    className={`flex flex-1 flex-col h-auto sm:h-[76px] justify-center items-center text-gray-800 dark:text-gray-300 text-sm font-semibold 
                    ${beforeHover && `transform transition duration-700`}
                    `}>
                    <div className="flex items-center space-x-1">
                        <MdPlayArrow className="flex sm:hidden w-4 h-4 rotate-180"/>
                        <span className="text-xs sm:text-sm">이전 포스트</span>
                    </div>
                    <div className="text-md sm:text-lg line-clamp-1 sm:line-clamp-2">이전 포스트 제목
                    </div>
                </div>
            </div>
        </div>
    )

    const MemoPage__MemoCreateComment = (
        <div className="flex flex-1 bg-background">
            <div className="flex-1 py-10">
                <div className="mb-1 text-gray-700 dark:text-gray-300">댓글</div>
                <div className="flex flex-1 space-x-2">
                    <textarea
                        value={comment}
                        onChange={(event) => {
                            setComment(event.target.value)
                        }}
                        className="flex-1 resize-none border border-gray-200 bg-background outline-none rounded h-32 p-2"></textarea>
                    <Button
                        onClick={() => {
                            if (!comment) {
                                toast.error("내용을 입력하세요.")
                                return
                            }

                            if (comment) {
                                onCreateCommentSubmit()
                            }
                        }}
                        className="flex w-24 h-32 bg-primary hover:bg-primary-hover text-white rounded p-2 justify-center items-center">
                        <div>등록</div>
                    </Button>
                </div>
            </div>
        </div>
    )

    const MemoPage__MemoAfterButton = (
        <div className="flex flex-1 px-5 items-center justify-end">
            <div
                className="flex flex-1 items-center space-x-2 cursor-pointer hover:animate-headShake hover:text-indigo-500"
                onMouseOver={() => setAfterHover(true)}
                onMouseOut={() => setAfterHover(false)}
                onClick={handleClickAfterPost}
            >
                <div
                    className={`flex flex-1 flex-col h-auto sm:h-[76px] justify-center items-center text-gray-800 dark:text-gray-300 text-sm font-semibold 
                    ${afterHover && `transform transition duration-700`}
                    `}>
                    <div className="flex items-center space-x-1">
                        <span className="text-xs sm:text-sm">다음 포스트</span>
                        <MdPlayArrow className="flex sm:hidden w-4 h-4"/>
                    </div>
                    <div className="text-md sm:text-lg line-clamp-1 sm:line-clamp-2">다음 포스트 제목</div>
                </div>
                <MdPlayArrow className="hidden sm:flex w-6 h-6"/>
            </div>
        </div>
    )

    return (
        <div
            className="flex flex-1 bg-background pt-32 overflow-y-auto mx-3 md:mx-[80px] lg:mx-[150px] xl:mx-[320px] 2xl:mx-[400px]">

            <div className="flex-1 w-full">
                {MemoPage__MemoTitleZone}

                {MemoPage__MemoContentZone}

                <div className="flex flex-1 bg-background py-10">
                    {MemoPage__MemoBeforeButton}

                    {MemoPage__MemoAfterButton}
                </div>

                {MemoPage__MemoCreateComment}
                <MemoPage__MemoComments/>
            </div>

            <UpToDownButton direction="up"/>
        </div>

    )
}

export default MemoPage