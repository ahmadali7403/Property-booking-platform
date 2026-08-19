const Avatar = ({ src, alt = "Avatar", size = "md", className = "" }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
    xl: "h-20 w-20",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizes[size]} rounded-full object-cover ${className}`}
    />
  );
};

export default Avatar;
