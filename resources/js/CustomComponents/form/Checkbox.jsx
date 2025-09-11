export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-[var(--secondary)] text-[var(--primary)] shadow-sm focus:ring-[var(--secondary)] ' +
                className
            }
        />
    );
}
