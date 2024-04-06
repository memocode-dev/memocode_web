import {PostDetailDTO} from "@/openapi/memo/model";
import {useContext, useEffect} from "react";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";
import {faker} from "@faker-js/faker";
import {Badge} from "@/components/ui/badge.tsx";

const Content = ({post}: { post: PostDetailDTO }) => {

    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.mermaid',
        });
    }, [post, theme]);

    // 가짜 데이터 생성
    const fakerData = { tags: Array.from({ length: faker.datatype.number({ min: 1, max: 20 }) }, () => faker.random.word()) };

    return (
        <>
            <div className="flex flex-wrap pt-10 cursor-default">
                {fakerData.tags.map((tag: string) => {
                    return (
                        <>
                            <Badge
                                className="text-md text-white bg-indigo-300 hover:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 mx-1 my-1">{tag}</Badge>
                        </>
                    );
                })}
            </div>

            <div className="bg-background border-b border-b-gray-300 px-1 py-10">
                <div className="text-lg font-medium leading-snug break-all">
                    <div className="markdown-body"
                         dangerouslySetInnerHTML={{__html: MarkdownView.render(post?.content || "")}}></div>
                </div>
            </div>
        </>
    )
}

export default Content
