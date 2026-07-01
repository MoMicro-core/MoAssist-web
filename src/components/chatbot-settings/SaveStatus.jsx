import clsx from "clsx";

// Compact auto-save indicator that replaces the manual "Save" button.
// `labels` lets each page localize the four states.
export const SaveStatus = ({ status, onRetry, labels = {} }) => {
  const text = {
    idle: labels.idle ?? "All changes saved",
    saving: labels.saving ?? "Saving…",
    saved: labels.saved ?? "All changes saved",
    error: labels.error ?? "Couldn't save",
  }[status];

  const dot =
    status === "saving"
      ? "bg-sky-500 animate-pulse"
      : status === "error"
        ? "bg-red-500"
        : "bg-emerald-500";

  return (
    <div
      role="status"
      aria-live="polite"
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium",
        status === "error"
          ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
          : "border-zinc-200 bg-white text-zinc-600 dark:border-white/10 dark:bg-zinc-950/40 dark:text-zinc-300",
      )}
    >
      <span className={clsx("h-2 w-2 shrink-0 rounded-full", dot)} />
      <span>{text}</span>
      {status === "error" && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="ml-1 rounded-lg px-1.5 font-semibold text-red-700 underline decoration-red-300 underline-offset-2 hover:text-red-800 dark:text-red-300"
        >
          {labels.retry ?? "Retry"}
        </button>
      ) : null}
    </div>
  );
};

export default SaveStatus;
