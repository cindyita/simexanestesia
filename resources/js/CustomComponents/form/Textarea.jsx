import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function Textarea(
    { rows=3, className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <textarea
            {...props}
            className={
                'w-full px-3 py-2 border border-[var(--secondary)] rounded-md focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent ' +
                className
            }
            ref={localRef}
            rows ={rows}
        />

    );
});
