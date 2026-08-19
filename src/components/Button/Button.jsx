const Button = ({
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
  onClick,
}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-brand-500 text-white shadow-soft hover:bg-brand-600 active:scale-[0.98]",

    secondary:
      "border border-border-soft bg-white text-gray-800 shadow-soft hover:bg-surface-muted active:scale-[0.98]",

    ghost: "text-gray-700 hover:bg-surface-muted active:scale-[0.98]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
