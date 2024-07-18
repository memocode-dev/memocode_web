'use client';

import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import * as monaco from 'monaco-editor';
import {IKeyboardEvent} from 'monaco-editor';

interface MonacoEditorProps {
    language: string; // 언어
    theme: "vs" | "vs-dark"; // 테마
    value?: string; // 값
    onChange?: (value: string) => void; // 변화하는 값 이벤트
    onKeyDown?: (e: IKeyboardEvent) => void; // 키보드 이벤트
    width: string;
    height: string;
}

export interface MonacoEditorHandle {
    insertTextAtCursor: (text: string) => void;
}

// 수정하지 마세요!
const MonacoEditor = forwardRef<MonacoEditorHandle, MonacoEditorProps>(({
                                     language,
                                     theme,
                                     onChange,
                                     value,
                                     onKeyDown,
                                     width,
                                     height
                                 }: MonacoEditorProps, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            monacoInstanceRef.current = monaco.editor.create(editorRef.current, {
                value: value,
                language: language,
                minimap: {enabled: false},
                automaticLayout: true,
                theme: theme,
                tabSize: 4,
                mouseWheelZoom: true,
                fontSize: 20,
            });

            // onChange event
            const disposable = monacoInstanceRef.current.onDidChangeModelContent(() => {
                const newValue = monacoInstanceRef.current?.getValue();
                if (onChange) {
                    onChange(newValue || '');
                }
            });

            // onKeyDown event
            const keyDownDisposable = monacoInstanceRef.current.onKeyDown((e) => {
                if (onKeyDown) {
                    onKeyDown(e);
                }
            });

            return () => {
                disposable.dispose();
                keyDownDisposable.dispose();
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

    useImperativeHandle(ref, () => ({
        insertTextAtCursor: (text: string) => {
            if (monacoInstanceRef.current) {
                const editor = monacoInstanceRef.current;
                const position = editor.getPosition();

                if (position) {
                    const id = {major: 1, minor: 1}; // Change tracking ID
                    const range = new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column);
                    const edits = [{
                        identifier: id,
                        range: range,
                        text: text,
                        forceMoveMarkers: true
                    }];
                    editor.executeEdits('my-source', edits);
                }
            }
        }
    }));

    return <div ref={editorRef} style={{height: height, width: width}}/>;
})

MonacoEditor.displayName = 'MonacoEditor';

export default MonacoEditor;