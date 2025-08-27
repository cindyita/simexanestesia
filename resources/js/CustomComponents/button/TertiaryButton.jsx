export default function TertiaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-[var(--radiusBtn)] border border-yellow-300 bg-yellow-100 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-yellow-700 shadow-sm transition duration-150 ease-in-out hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
