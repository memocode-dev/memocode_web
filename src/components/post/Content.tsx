import {PostDetailDTO} from "@/openapi/memo/model";
import {useContext, useEffect, useState} from "react";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {faker} from "@faker-js/faker";
import {Badge} from "@/components/ui/badge.tsx";
import DOMPurify from "dompurify";
import AnchorLinkBar from "@/components/post/AnchorLinkBar.tsx";

interface Heading {
    hId: number;
    text: string;
    index: number;
}

const Content = ({post}: { post: PostDetailDTO }) => {

    const {theme} = useContext(ThemeContext)
    const [renderedContent, setRenderedContent] = useState("")
    const [headings, setHeadings] = useState<Heading[]>([])

    function escapeRegExp(string: string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [post, theme]);

    useEffect(() => {
        if (post?.content) {
            // H1, H2, H3 텍스들 추출하여 newHeadings 배열에 담기
            const headingRegex = /(?:^|\n)(#{1,3})\s+(.*)/g;
            let match;
            const newHeadings = [];
            let index = 0; // 각 제목에 대한 고유 인덱스
            while ((match = headingRegex.exec(post.content)) !== null) {
                newHeadings.push({
                    hId: match[1].length, // #의 길이로 h1, h2, h3 구분
                    text: match[2].trim(), // 해당 텍스트
                    index: ++index, // 해당 인덱스
                });
            }

            // newHeadings에 담긴 H1, H2, H3들을 html-h 태그로 변환하고, anchor link 이동을 위한 id 주기
            let htmlContent = post.content;
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
    }, [post]);

    // 가짜 데이터 생성
    const fakerData = {tags: Array.from({length: faker.datatype.number({min: 1, max: 20})}, () => faker.random.word())};

    return (
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

            <AnchorLinkBar headings={headings}/>
        </>
    )
}

export default Content
