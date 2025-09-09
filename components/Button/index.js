"use client";

export default function Button({
    onClick,
    disabled = false,
    loading = false,
    children,
    className = "",
    variant = "primary",
    size = "md",
}) {
    const baseClasses =
        "w-full font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-600 text-white hover:bg-gray-700",
        success: "bg-green-600 text-white hover:bg-green-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizeClasses = {
        sm: "py-2 px-3 rounded-lg text-sm",
        md: "py-3 px-4 rounded-xl text-base",
        lg: "py-4 px-6 rounded-xl text-lg",
    };

    const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={combinedClasses}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>{loading ? "Updating..." : children}</span>
        </button>
    );
}
