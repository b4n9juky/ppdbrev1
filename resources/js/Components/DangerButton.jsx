export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-200 transition hover:from-red-700 hover:to-rose-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
