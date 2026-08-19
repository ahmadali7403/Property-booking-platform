const StarRating = ({
  rating = 0,
  maxRating = 5,
  showValue = true,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const filled = index < Math.round(rating);

          return (
            <span
              key={index}
              className={filled ? "text-brand-500" : "text-gray-300"}
            >
              ★
            </span>
          );
        })}
      </div>

      {showValue && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
