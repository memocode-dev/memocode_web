'use client'

import {useEffect, useRef} from 'react';

const ResizeHandle = ({ onResize }: { onResize: (height: number) => void }) => {
    const handleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handle = handleRef.current;
        if (!handle) return;

        const onMouseMove = (e: MouseEvent) => {
            const height = e.clientY - handle.parentElement!.getBoundingClientRect().top;
            onResize(height);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        const onMouseDown = () => {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        };

        handle.addEventListener('mousedown', onMouseDown);

        return () => {
            handle.removeEventListener('mousedown', onMouseDown);
        };
    }, [onResize]);

    return <div ref={handleRef} className="resize-handle" />;
};

export default ResizeHandle;
