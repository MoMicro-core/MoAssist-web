import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";

// A chip/tag input: type a value, press Enter (or comma) to add it to the list;
// committed values render as removable chips below the field. Replaces the old
// comma/newline textareas that corrupted entries on every keystroke.
export const TagInput = ({
  values = [],
  onChange,
  placeholder,
  addLabel = "Add",
  emptyLabel,
  inputType = "text",
  transform = (value) => value.trim(),
}) => {
  const [text, setText] = useState("");

  const commit = (raw) => {
    const value = transform(raw);
    if (!value) return;
    if (values.includes(value)) {
      setText("");
      return;
    }
    onChange([...values, value]);
    setText("");
  };

  const remove = (value) => onChange(values.filter((item) => item !== value));

  const onKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(text);
    } else if (event.key === "Backspace" && !text && values.length) {
      remove(values[values.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type={inputType}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => commit(text)}
          placeholder={placeholder}
          className="block w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30 dark:border-white/10 dark:bg-zinc-950/40 dark:text-white dark:placeholder:text-zinc-500"
        />
        <button
          type="button"
          onClick={() => commit(text)}
          disabled={!transform(text)}
          className="shrink-0 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {addLabel}
        </button>
      </div>
      {values.length ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 py-1 pl-3 pr-1.5 text-sm font-medium text-sky-800 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200"
            >
              <span className="max-w-[18rem] truncate">{value}</span>
              <button
                type="button"
                onClick={() => remove(value)}
                aria-label={`Remove ${value}`}
                className="grid h-5 w-5 place-items-center rounded-md text-sky-700/70 transition hover:bg-sky-200/60 hover:text-sky-900 dark:text-sky-200/70 dark:hover:bg-sky-400/20 dark:hover:text-white"
              >
                <XMarkIcon className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : emptyLabel ? (
        <div className="rounded-xl border border-dashed border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-400 dark:border-white/10 dark:text-zinc-500">
          {emptyLabel}
        </div>
      ) : null}
    </div>
  );
};

export default TagInput;
