import {Marked} from "marked";
import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";
import './highlight.css';
import './github-markdown.css'

export const markdownView = new Marked(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);