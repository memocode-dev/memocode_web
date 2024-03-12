import {useEffect, useRef} from "react";
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
    language: string;
    theme: string;
    value?: string;
    onChange: (value: string) => void;
}

// 수정하지 마세요!
const MonacoEditor = ({ language, theme, onChange, value } : MonacoEditorProps) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
                value: "",
                language: language,
                theme: theme,
            });

            // onChange event
            const disposable = monacoInstanceRef.current.onDidChangeModelContent(() => {
                const newValue = monacoInstanceRef.current?.getValue();
                onChange(newValue || '');
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

    return <div ref={editorRef} style={{ height: '100%', width: '100%' }} />;
}

export default MonacoEditor;