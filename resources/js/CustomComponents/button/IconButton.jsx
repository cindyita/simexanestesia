export default function IconButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[var(--radiusBtn)] bg-[--primary] p-2 font-semibold uppercase tracking-widest text-[var(--textReverse)] transition duration-150 ease-in-out hover:opacity-80 disabled:opacity-25 text-lg  ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
