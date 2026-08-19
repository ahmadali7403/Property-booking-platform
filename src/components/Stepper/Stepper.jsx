import { Minus, Plus } from "lucide-react";

const Stepper = ({ value = 0, min = 0, max = 10, onChange }) => {
  const decrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const increase = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-white text-gray-700 transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease value"
      >
        <Minus size={16} />
      </button>

      <span
        className="min-w-6 text-center text-sm font-semibold text-gray-900"
        aria-live="polite"
      >
        {value}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border-soft bg-white text-gray-700 transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase value"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default Stepper;
