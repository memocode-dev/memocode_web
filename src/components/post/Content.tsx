import {PostDetailDTO} from "@/openapi/memo/model";
import {useContext, useEffect} from "react";
import mermaid from "mermaid";
import {ThemeContext} from "@/context/ThemeContext.tsx";
import MarkdownView from "@/components/ui/MarkdownView.ts";

const Content = ({post}: { post: PostDetailDTO }) => {

    const {theme} = useContext(ThemeContext);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: theme,
        });
        mermaid.run({
            querySelector: '.marmaid',
        });
    }, [post, theme]);

    return (
        <div className="bg-background border-b border-b-gray-300 px-1 py-10">
            <div className="text-lg font-medium leading-snug break-all">
                <div className="markdown-body" dangerouslySetInnerHTML={{__html: MarkdownView.render(post?.content || "")}}></div>
            </div>
        </div>
    )
}

export default Content
