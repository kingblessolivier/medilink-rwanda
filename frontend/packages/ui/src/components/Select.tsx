import { CaretDown, Check } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cx } from "../utils/cx";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export interface SelectProps<T extends string> {
  /** Visible label above the field, or only for screen readers with `hideLabel`. */
  label: string;
  hideLabel?: boolean;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  /** An icon inside the field, before the value (e.g. a map pin). */
  icon?: ReactNode;
  /** `pill` for search bars and filter rows; `field` for forms. */
  shape?: "pill" | "field";
  className?: string;
  id?: string;
}

/**
 * A select that looks the same in every browser (the native one did not): a button that opens a
 * listbox (WAI-ARIA select-only combobox pattern). Keyboard: Enter, Space or the arrows open it;
 * arrows, Home and End move; typing jumps to a match; Enter or Space picks; Escape closes and
 * focus goes back to the button; Tab closes.
 */
export function Select<T extends string>({
  label,
  hideLabel = false,
  value,
  onChange,
  options,
  icon,
  shape = "field",
  className,
  id: givenId,
}: SelectProps<T>) {
  const autoId = useId();
  const id = givenId ?? `select-${autoId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const listId = `${id}-list`;
  const labelId = `${id}-label`;
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const button = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: "", at: 0 });

  const show = (index = selectedIndex) => {
    setActive(index);
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };
  const pick = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    close();
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const away = (event: PointerEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [active, open]);

  const typeahead = (key: string, now: number) => {
    typed.current =
      now - typed.current.at > 700
        ? { text: key, at: now }
        : { text: typed.current.text + key, at: now };
    const text = typed.current.text.toLowerCase();
    const start = typed.current.text.length === 1 ? active + 1 : active;
    for (let i = 0; i < options.length; i++) {
      const index = (start + i) % options.length;
      if (options[index]!.label.toLowerCase().startsWith(text)) return index;
    }
    return -1;
  };

  const onButtonKey = (event: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      show(event.key === "ArrowUp" ? Math.max(0, selectedIndex - 1) : selectedIndex);
    }
  };
  const onListKey = (event: KeyboardEvent) => {
    const last = options.length - 1;
    const move: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
      PageDown: Math.min(last, active + 8),
      PageUp: Math.max(0, active - 8),
    };
    if (event.key in move) {
      event.preventDefault();
      setActive(move[event.key]!);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(active);
    } else if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const index = typeahead(event.key, event.timeStamp);
      if (index >= 0) setActive(index);
    }
  };

  const current = options[selectedIndex];
  return (
    <div ref={wrapper} className={cx("relative flex flex-col gap-1.5", className)}>
      <span id={labelId} className={hideLabel ? "sr-only" : "text-body-sm font-semibold text-fg"}>
        {label}
      </span>
      <button
        ref={button}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        onClick={() => (open ? close() : show())}
        onKeyDown={onButtonKey}
        className={cx(
          "flex min-h-control w-full cursor-pointer items-center gap-2 bg-surface px-4 text-left text-body text-fg",
          "shadow-[0_0_0_1px_var(--color-hairline,var(--color-border))] transition-shadow duration-150 ease-out-quint",
          "hover:shadow-[0_0_0_1px_var(--color-hairline-strong,var(--color-border-input))]",
          "focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-focus)]",
          open && "shadow-[0_0_0_2px_var(--color-focus)]",
          shape === "pill" ? "rounded-full" : "rounded-xl",
        )}
      >
        {icon && (
          <span aria-hidden="true" className="flex shrink-0 text-fg-muted">
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate">{current?.label}</span>
        <CaretDown
          aria-hidden="true"
          className={cx(
            "size-4 shrink-0 text-fg-muted transition-transform duration-150 ease-out-quint",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className={cx(
            "absolute top-full right-0 left-0 z-50 m-0 mt-1.5 max-h-72 min-w-[12rem] overflow-y-auto rounded-xl bg-raised p-1.5 outline-none",
            "origin-top shadow-[var(--shadow-e3,var(--shadow-raised))] animate-pop",
          )}
        >
          {options.map((option, index) => {
            const selected = index === selectedIndex;
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- listbox: focus and keys stay on the list (aria-activedescendant)
              <div
                key={option.value}
                id={`${id}-opt-${index}`}
                data-index={index}
                role="option"
                aria-selected={selected}
                onPointerMove={() => setActive(index)}
                onClick={() => pick(index)}
                className={cx(
                  "flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-body",
                  index === active ? "bg-subtle text-fg" : "text-fg-secondary",
                  selected && "font-semibold text-fg",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {selected && (
                  <Check aria-hidden="true" weight="bold" className="size-4 shrink-0 text-brand" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
