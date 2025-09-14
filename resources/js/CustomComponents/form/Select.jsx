import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function Select(
    { children, rows=3, className = '', isFocused = false, ...props },
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
        <select
            {...props}
            className={
                'px-3 py-2 pr-8 border border-[var(--secondary)] rounded-lg text-sm focus:ring-2 focus:ring-[var(--secondary)] focus:border-transparent ' +
                className
            }
            ref={localRef}
        >
            {children}
        </select>

    );
});
