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
                `inline-flex items-center rounded-[var(--radiusBtn)] bg-[--primary] p-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-emerald-800 text-lg  ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
