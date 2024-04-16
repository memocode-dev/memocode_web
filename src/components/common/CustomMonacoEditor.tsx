import {useContext, useEffect, useRef, useState} from "react";
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
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {VscOpenPreview} from "react-icons/vsc";
import {ModalContext, ModalTypes} from "@/context/ModalContext.tsx";
import CustomMonacoEditorPreview from "@/components/common/CustomMonacoEditorPreview.tsx";
import {Separator} from "@/components/ui/separator"

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

    const {openModal} = useContext(ModalContext)
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
                overviewRulerLanes: 0,
                scrollbar: {
                    vertical: "hidden",
                    horizontal: "hidden",
                    handleMouseWheel: true,
                },
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                padding: {top: 0, bottom: 0},
                suggestOnTriggerCharacters: false,
                renderLineHighlight: "none",
                glyphMargin: false,
                folding: false,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 0,
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
            <div
                className="flex w-full border-b border-b-gray-200 dark:border-b-neutral-600 absolute items-centers justify-between z-10 top-0 left-0 px-1.5 py-2 overflow-x-auto">
                <div className="flex">
                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("bold")
                                    }}
                                >
                                    <LuBold className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>굵게</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("strikethrough")
                                    }}
                                >
                                    <LuStrikethrough className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>취소선</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("italic")
                                    }}
                                >
                                    <LuItalic className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>기울임꼴</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("link")
                                    }}
                                >
                                    <LuLink className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>링크</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setHandleColorButton(true)
                                    }}
                                >
                                    <LuPalette className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>글자 색</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="py-1.5">
                        <Separator orientation="vertical" className="border border-gray-300 dark:border-neutral-500"/>
                    </div>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mx-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("code")
                                    }}
                                >
                                    <LuCode2 className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>코드</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>


                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("image")
                                    }}
                                >
                                    <IoImageOutline className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>사진 업로드</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="py-1.5">
                        <Separator orientation="vertical" className="border border-gray-300 dark:border-neutral-500"/>
                    </div>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mx-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("heading1")
                                    }}
                                >
                                    <LuHeading1 className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>제목1</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("heading2")
                                    }}
                                >
                                    <LuHeading2 className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>제목2</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("heading3")
                                    }}
                                >
                                    <LuHeading3 className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>제목3</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <div className="py-1.5">
                        <Separator orientation="vertical" className="border border-gray-300 dark:border-neutral-500"/>
                    </div>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mx-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("listOrdered")
                                    }}
                                >
                                    <FaListOl className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>번호 목록</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild className="mr-1.5">
                                <Button
                                    type="button"
                                    className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                    onClick={() => {
                                        setFontStyle("list")
                                    }}
                                >
                                    <FaListUl className="h-5 w-5"/>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                                <p>글머리 기호 목록</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild className="mr-1.5" disabled={!value && true}>
                            <Button
                                type="button"
                                className="flex bg-background h-fit p-2 text-secondary-foreground hover:bg-gray-100 dark:hover:bg-neutral-700 hover:text-neutral-400"
                                onClick={() => openModal({
                                    name: ModalTypes.CUSTOM_MONACO_EDITOR_PREVIEW,
                                    data: {
                                        content: value
                                    }
                                })}
                            >
                                <VscOpenPreview className="w-5 h-5"/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            className="bg-black bg-opacity-70 text-gray-200 rounded-none shadow-none border-0 text-xs">
                            <p>미리보기</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <div ref={editorRef} style={{height: height, width: width}} className={className}>
                {handleColorButton &&
                    <div className="absolute bg-transparent top-0 left-1/2">
                        <HexColorPicker
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
            </div>

            <CustomMonacoEditorPreview/>
        </>
    )
}

export default CustomMonacoEditor;
