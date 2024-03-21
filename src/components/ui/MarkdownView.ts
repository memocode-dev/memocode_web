import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";
import './highlight.css';
import './github-markdown.css'
import DOMPurify from 'dompurify';

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            if (lang === "marmaid") {
                return `
                    <div class="marmaid">${code}</div>
                `;
            }

            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    }),
);

class MarkdownView {
    static render(markdownText: string) {
        const rawHtml = marked.parse(markdownText) as string;
        return DOMPurify.sanitize(rawHtml);
    }
}

export default MarkdownView;