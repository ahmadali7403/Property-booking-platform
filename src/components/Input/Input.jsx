const Input = ({ label, error, id, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-gray-800"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
            : "border-border-soft focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10"
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
