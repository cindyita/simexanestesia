export default function MiniButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[var(--radiusBtn)] border border-transparent bg-[--primary] px-2 py-1 text-xs font-semibold tracking-widest text-[var(--textReverse)] transition duration-150 ease-in-out hover:opacity-80 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
