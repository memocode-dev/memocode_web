'use client';

import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";
import '@/css/github-markdown.css'
import '@/css/highlight.css'
import { sanitize as DOMPurifySanitize } from "dompurify";

export const sanitize = (text: string): string => {
    const isBrowser = typeof window !== 'undefined';
    return isBrowser ? DOMPurifySanitize(text) : global.DOMPurify.sanitize(text);
}

const marked = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            if (lang === "mermaid") {
                return `
                    <div class="mermaid">${code}</div>
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
        return sanitize(rawHtml);
    }
}

export default MarkdownView;