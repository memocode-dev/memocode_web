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
            const headingsArray = post.content.split('\n').filter(line => line.startsWith('#'));
            const newHeadings: Heading[] = headingsArray.map((heading, index) => {
                const hId = heading.split(' ')[0].length; // #, ##, ###의 길이로 hId 결정
                const text = heading.substring(hId + 1); // 첫 번째 공백 이후의 텍스트가 실제 내용
                return {hId, text, index: index + 1};
            });

            // newHeadings에 담긴 H1, H2, H3들을 html-h 태그로 변환하고, anchor link 이동을 위한 id 주기
            let htmlContent = post.content;
            newHeadings.forEach(heading => {
                const tag = `h${heading.hId}`;
                const headingText = `#${'.'.repeat(heading.hId - 1)} ${heading.text}`;
                const startIndex = htmlContent.indexOf(headingText);
                if (startIndex !== -1) {
                    const beforeText = htmlContent.substring(0, startIndex);
                    const afterText = htmlContent.substring(startIndex + headingText.length);
                    htmlContent = `${beforeText}<${tag} id="heading${heading.hId}_${heading.index}">${heading.text}</${tag}>${afterText}`;
                }
            });


            const markdownRenderHtmlContent = MarkdownView.render(htmlContent);
            const sanitizedHtmlContent = DOMPurify.sanitize(markdownRenderHtmlContent);
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
