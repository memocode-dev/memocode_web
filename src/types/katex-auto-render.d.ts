// src/types/katex-auto-render.d.ts
declare module 'katex/dist/contrib/auto-render' {
    import { KatexOptions } from 'katex';

    function renderMathInElement(
        element: HTMLElement,
        options?: {
            delimiters?: {
                left: string;
                right: string;
                display: boolean;
            }[];
            ignoredTags?: string[];
            errorCallback?: (msg: string, err: Error) => void;
            throwOnError?: boolean;
        } & KatexOptions
    ): void;

    export = renderMathInElement;
}
