const Badge = ({ children, variant = "default", className = "" }) => {
  const baseStyles =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  const variants = {
    default: "bg-surface-muted text-gray-700",

    brand: "bg-brand-100 text-brand-700",

    success: "bg-green-50 text-green-700",

    warning: "bg-amber-50 text-amber-700",

    danger: "bg-red-50 text-red-700",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
