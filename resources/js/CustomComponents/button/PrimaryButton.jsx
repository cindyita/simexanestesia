export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[var(--radiusBtn)] border border-transparent bg-[--primary] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--textReverse)] transition duration-150 ease-in-out hover:opacity-80 disabled:opacity-25 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
