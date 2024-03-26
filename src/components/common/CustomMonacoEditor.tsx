import {useEffect, useRef} from "react";
import * as monaco from 'monaco-editor';
import {Toggle} from "@/components/ui/toggle.tsx";
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


    // 볼드체 버튼
    const setBold = () => {
        const editor = monacoInstanceRef.current;
        if (!editor) return;

        const selection = editor.getSelection(); // 모나코에디터에서 사용자가 선택한 영역

        if (!selection) return;

        const text = editor?.getModel()?.getValueInRange(selection); // 선택된 영역을 모나코에디터의 IRange타입으로 맞춤
        const boldedText = `**${text}**`;

        const operation: monaco.editor.IIdentifiedSingleEditOperation = { // bold 기능을 에디터에 정의
            range: selection, // 이제 'IRange' 타입과 호환됩니다.
            text: boldedText,
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
                    <Toggle
                        aria-label="Toggle bold"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                        onClick={setBold}
                    >
                        <LuBold className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle italic"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuItalic className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle strikethrough"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuStrikethrough className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle code"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuCode2 className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle link"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuLink className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle palette"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuPalette className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle listOrdered"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <FaListOl className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle list"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <FaListUl className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle heading1"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuHeading1 className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle heading2"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuHeading2 className="h-5 w-5"/>
                    </Toggle>

                    <Toggle
                        aria-label="Toggle heading3"
                        className="flex hover:bg-gray-100 data-[state=on]:bg-gray-100 dark:hover:bg-neutral-700 dark:data-[state=on]:bg-black hover:text-neutral-400 ring-0"
                    >
                        <LuHeading3 className="h-5 w-5"/>
                    </Toggle>
                </div>
            </div>

            <div ref={editorRef} style={{height: height, width: width}} className={className}/>
        </>
    )
}

export default CustomMonacoEditor;