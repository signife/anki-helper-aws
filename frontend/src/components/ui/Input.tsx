import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[14px] font-medium text-ink-muted dark:text-on-dark-muted mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-[44px] px-4 rounded-md border bg-canvas text-ink outline-none transition-colors
            ${error
              ? "border-error focus:border-error"
              : "border-hairline focus:border-accent dark:border-hairline-dark dark:focus:border-accent-dark"
            }
            dark:bg-dark-surface dark:text-on-dark
            placeholder:text-ink-faint dark:placeholder:text-on-dark-muted
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-[13px] text-error">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
