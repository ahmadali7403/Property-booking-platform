const Card = ({ children, className = "", hover = false }) => {
  const baseStyles = "rounded-2xl bg-white shadow-card";

  const hoverStyles = hover
    ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-float"
    : "";

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
