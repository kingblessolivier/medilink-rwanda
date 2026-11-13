import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cx } from "../utils/cx";
import { Button } from "./Button";

export interface SidePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Row detail drawer (design 08 §4): slides in from the end edge, full screen under 640 px,
 * focus-trapped; focus returns to the row (the trigger) when it closes.
 */
export function SidePanel({
  open,
  onOpenChange,
  title,
  closeLabel,
  children,
  footer,
}: SidePanelProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-fg/25 data-[state=open]:animate-fade data-[state=closed]:animate-fade-out" />
        <RadixDialog.Content
          aria-describedby={undefined}
          className={cx(
            "fixed inset-y-2 right-2 z-50 flex w-[calc(100%-1rem)] flex-col overflow-hidden rounded-3xl bg-surface text-fg shadow-raised",
            "data-[state=open]:animate-[ml-panel-in_280ms_var(--ease-out-quint)_both] data-[state=closed]:animate-[ml-panel-out_180ms_var(--ease-out-quint)_both] motion-reduce:animate-none",
            "sm:max-w-xl",
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-5">
            <RadixDialog.Title className="m-0 font-heading text-h3">{title}</RadixDialog.Title>
            <RadixDialog.Close asChild>
              <Button variant="ghost" pill aria-label={closeLabel} className="-mr-2 size-10 px-0">
                <X aria-hidden="true" weight="bold" />
              </Button>
            </RadixDialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-border/60 bg-page/60 px-6 py-4">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
