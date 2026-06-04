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
                `inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-200 transition hover:from-emerald-700 hover:to-green-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
