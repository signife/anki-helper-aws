import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const [show, setShow] = useState(false);
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
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={show ? "text" : "password"}
            className={`w-full h-[44px] px-4 pr-11 rounded-md border bg-canvas text-ink outline-none transition-colors
              ${error
                ? "border-error focus:border-error"
                : "border-hairline focus:border-accent dark:border-hairline-dark dark:focus:border-accent-dark"
              }
              dark:bg-dark-surface dark:text-on-dark
              placeholder:text-ink-faint dark:placeholder:text-on-dark-muted
              ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink dark:text-on-dark-muted dark:hover:text-on-dark transition-colors"
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {error && <p className="mt-1.5 text-[13px] text-error">{error}</p>}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
