import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[1000] grid place-items-center p-5 bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <section
        className="relative w-full max-w-[560px] max-h-[85vh] flex flex-col rounded-lg bg-canvas dark:bg-dark-surface shadow-xl border border-hairline dark:border-hairline-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-hairline dark:border-hairline-dark shrink-0">
          <h2 id="modal-title" className="text-[17px] font-semibold text-ink dark:text-on-dark">
            {title || ""}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full grid place-items-center text-ink-muted hover:text-ink dark:text-on-dark-muted dark:hover:text-on-dark hover:bg-canvas-alt dark:hover:bg-dark-surface-2 transition-colors text-[18px]"
            aria-label="Close"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </section>
    </div>
  );
}
