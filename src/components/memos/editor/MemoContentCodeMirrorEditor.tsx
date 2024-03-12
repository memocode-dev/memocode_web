import CodeMirror, {ReactCodeMirrorRef} from "@uiw/react-codemirror";
import {RefObject, useRef} from "react";
import {solarizedLightInit} from "@uiw/codemirror-theme-solarized";
import {EditorView} from "@codemirror/view";
import {markdown, markdownLanguage} from "@codemirror/lang-markdown";
import {languages} from "@codemirror/language-data";
import {useForm} from "react-hook-form";

const MemoContentCodeMirrorEditor = () => {

    const {
        setValue,
        watch
    } = useForm({
        defaultValues: {
            saveContent: "",
            codeMirrorContent: "",
        },
    });

    // codemirror theme
    const codemirrorTheme = solarizedLightInit({
        settings: {
            background: "#ffffff",
            gutterBackground: "#ffffff",
            selection: "#d3d3d340", // 선택 영역은 주 테마 색상에 투명도를 줌
            selectionMatch: "#ffffff", // 선택된 텍스트와 일치하는 영역도 동일하게
            lineHighlight: "#d3d3d31a", // 현재 줄 강조에도 테마 색상의 투명 버전 적용
            fontFamily: 'monospace',
        }
    });

    // codemirror ref
    const codeMirrorRef: RefObject<ReactCodeMirrorRef> = useRef(null);

    // codemirror basic setup
    const codemirrorBasicSetup = {
        foldGutter: false,
        lineNumbers: true,
        tabSize: 2,
        indentOnInput: false,
    };

    // codemirror extensions
    const codemirrorExtensions = [
        EditorView.lineWrapping,
        markdown({base: markdownLanguage, codeLanguages: languages}),
        EditorView.updateListener.of(() => {
            // handleScroll(scrollableDivRef, tipTapContainerRef);
        }),
        EditorView.theme({
            ".cm-content": {
                fontSize: "1.2rem",
            },
            "&.cm-editor.cm-focused": {
                outline: "none"
            },
        }, {dark: false}),
    ];

    const codeMirrorOnChangeHandler = (content: string) => {
        setValue("saveContent", content);
    }

    return (
        <>
            <CodeMirror
                value={watch("codeMirrorContent")}
                theme={codemirrorTheme}
                height={"100%"}
                ref={codeMirrorRef}
                className="flex-1"
                basicSetup={codemirrorBasicSetup}
                extensions={codemirrorExtensions}
                placeholder="내용 없음"
                onChange={codeMirrorOnChangeHandler}
            />
        </>
    );
}

export default MemoContentCodeMirrorEditor