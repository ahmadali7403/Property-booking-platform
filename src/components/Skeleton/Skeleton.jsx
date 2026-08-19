const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-gray-200 ${className}`}
      aria-hidden="true"
    />
  );
};

export default Skeleton;
