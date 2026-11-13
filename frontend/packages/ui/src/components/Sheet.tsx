import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { useRef, type ReactNode } from "react";

import { cx } from "../utils/cx";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  closeLabel: string;
  children: ReactNode;
  /** A sticky footer, e.g. "Show 12 results". */
  footer?: ReactNode;
  /** `bottom` on phones (filters); `full` for the site menu (full height). */
  side?: "bottom" | "full";
}

/**
 * A sheet (Radix dialog): focus trapped inside, Escape and the close button close it, focus goes
 * back to what opened it, the page behind is inert. From the bottom with the app's 20 px corners,
 * or full height for the menu.
 */
export function Sheet({
  open,
  onOpenChange,
  title,
  closeLabel,
  children,
  footer,
  side = "bottom",
}: SheetProps) {
  const opener = useRef<HTMLElement | null>(null);
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-[rgb(14_28_23/0.45)] data-[state=open]:animate-fade data-[state=closed]:animate-fade-out" />
        <RadixDialog.Content
          aria-describedby={undefined}
          // opened from outside (no Radix trigger): remember what had focus, give it back on close
          onOpenAutoFocus={() => {
            opener.current = document.activeElement as HTMLElement | null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
            opener.current = null;
          }}
          className={cx(
            "fixed z-50 flex flex-col bg-surface text-fg shadow-[var(--shadow-e3,var(--shadow-raised))] outline-none",
            side === "bottom"
              ? "inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[1.25rem] data-[state=open]:animate-[ml-sheet-up_240ms_var(--ease-out-quint)_both] data-[state=closed]:animate-[ml-sheet-down_180ms_var(--ease-out-quint)_both]"
              : "inset-0 data-[state=open]:animate-fade data-[state=closed]:animate-fade-out",
          )}
        >
          {side === "bottom" && (
            <span
              aria-hidden="true"
              className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-border"
            />
          )}
          <div className="flex items-center justify-between gap-4 px-5 pt-3 pb-2">
            <RadixDialog.Title className="m-0 font-heading text-h3 font-bold">
              {title}
            </RadixDialog.Title>
            <RadixDialog.Close
              aria-label={closeLabel}
              className="-mr-2 grid size-11 cursor-pointer place-items-center rounded-full text-fg-secondary hover:bg-subtle hover:text-fg focus-visible:outline-2 focus-visible:outline-focus"
            >
              <X aria-hidden="true" weight="bold" className="size-5" />
            </RadixDialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>
          {footer && (
            <div className="border-t border-border px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
