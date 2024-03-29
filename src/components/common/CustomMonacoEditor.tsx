import {useEffect, useRef, useState} from "react";
import * as monaco from 'monaco-editor';
import {
    LuBold,
    LuCode2,
    LuHeading1,
    LuHeading2,
    LuHeading3,
    LuItalic,
    LuLink,
    LuPalette,
    LuStrikethrough
} from "react-icons/lu";
import {FaListOl, FaListUl} from "react-icons/fa";
import {Button} from "@/components/ui/button.tsx";
import {IoImageOutline} from "react-icons/io5";
import {HexColorPicker} from "react-colorful";

interface CustomMonacoEditorProps {
    language: string;
    theme: "vs" | "vs-dark";
    value?: string;
    onChange?: (value: string) => void;
    width: string;
    height: string;
    className: string;
}

const CustomMonacoEditor = ({
                                language,
                                theme,
                                onChange,
                                value,
                                width,
                                height,
                                className
                            }: CustomMonacoEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const [handleColorButton, setHandleColorButton] = useState(false)
    const [color, setColor] = useState("#aabbcc");

    // 폰트스타일 함수
    const setFontStyle = (style: string) => {
        const editor = monacoInstanceRef.current;
        if (!editor) return;

        const selection = editor.getSelection(); // 모나코에디터에서 사용자가 선택한 영역

        if (!selection) return;

        const text = editor?.getModel()?.getValueInRange(selection); // 선택된 영역을 모나코에디터의 IRange타입으로 맞춤
        let styledText = "";

        if (style === "bold") {
            styledText = `\n**${text}**`;
        }
        if (style === "italic") {
            styledText = `\n*${text}*`;
        }
        if (style === "strikethrough") {
            styledText = `\n~~${text}~~`;
        }
        if (style === "code") {
            styledText = "\n```\n" + text + "\n```";
        }
        if (style === "link") {
            styledText = `\n[](${text})`;
        }
        if (style === "image") {
            styledText = `\n![](${text})`;
        }
        if (style === "listOrdered") {
            styledText = `\n1. ${text}`;
        }
        if (style === "list") {
            styledText = `\n- ${text}`;
        }
        if (style === "heading1") {
            styledText = `\n# ${text}`;
        }
        if (style === "heading2") {
            styledText = `\n## ${text}`;
        }
        if (style === "heading3") {
            styledText = `\n### ${text}`;
        }
        if (/^#[0-9A-F]{6}$/i.test(style)) {
            styledText = `\n<span style="color:${style};">${text}</span>`;
        }

        const operation: monaco.editor.IIdentifiedSingleEditOperation = { // bold 기능을 에디터에 정의
            range: selection, // 이제 'IRange' 타입과 호환됩니다.
            text: styledText,
            forceMoveMarkers: true,
        };

        editor.executeEdits("my-source", [operation]); // 실행
    };

    useEffect(() => {
        if (editorRef.current) {
            monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
                value: value,
                language: language,
                minimap: {enabled: false},
                automaticLayout: true,
                theme: theme,
                mouseWheelZoom: true,
                fontSize: 20,
                lineNumbers: "off",
                scrollbar: {horizontal: "hidden"},
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: {top: 10, bottom: 10},
                suggestOnTriggerCharacters: false,
                renderLineHighlight: "none"
            });

            // onChange event
            const disposable = monacoInstanceRef.current.onDidChangeModelContent(() => {
                const newValue = monacoInstanceRef.current?.getValue();
                if (onChange) {
                    onChange(newValue || '');
                }
            });

            return () => {
                disposable.dispose();
                monacoInstanceRef.current?.dispose();
            };
        }
    }, [theme]);

    useEffect(() => {
        const editor = monacoInstanceRef.current;
        if (editor && value !== undefined && value !== editor.getValue()) {
            editor.setValue(value);
        }
    }, [value]);

    return (
        <>
            <div className="flex relative space-y-10">
                <div className="flex flex-col absolute z-10 top-1 left-1 space-y-1">
                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("bold")
                        }}
                    >
                        <LuBold className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("strikethrough")
                        }}
                    >
                        <LuStrikethrough className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("italic")
                        }}
                    >
                        <LuItalic className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("code")
                        }}
                    >
                        <LuCode2 className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("link")
                        }}
                    >
                        <LuLink className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("image")
                        }}
                    >
                        <IoImageOutline className="h-6 w-6"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setHandleColorButton(true)
                        }}
                    >
                        <LuPalette className="h-5 w-5"/>
                    </Button>

                    {handleColorButton &&
                        <div className="absolute bg-transparent top-32 left-12">
                            <HexColorPicker
                                className=""
                                color={color}
                                onChange={setColor}
                            />

                            <div className="flex justify-center space-x-1 mt-2">
                                <Button
                                    onClick={() => {
                                        setFontStyle("")
                                        setHandleColorButton(false)
                                    }}
                                    variant="secondary"
                                    className="rounded hover:bg-secondary-hover w-fit h-fit px-2 py-1 text-sm">
                                    취소
                                </Button>
                                <Button
                                    className="bg-primary hover:bg-primary-hover rounded w-fit h-fit px-2 py-1 text-sm"
                                    onClick={() => {
                                        setFontStyle(color)
                                        setHandleColorButton(false)
                                    }}
                                >
                                    등록
                                </Button>
                            </div>
                        </div>
                    }

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("listOrdered")
                        }}
                    >
                        <FaListOl className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("list")
                        }}
                    >
                        <FaListUl className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("heading1")
                        }}
                    >
                        <LuHeading1 className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("heading2")
                        }}
                    >
                        <LuHeading2 className="h-5 w-5"/>
                    </Button>

                    <Button
                        className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                        onClick={() => {
                            setFontStyle("heading3")
                        }}
                    >
                        <LuHeading3 className="h-5 w-5"/>
                    </Button>
                </div>
            </div>

            <div ref={editorRef} style={{height: height, width: width}} className={className}/>
        </>
    )
}

export default CustomMonacoEditor;