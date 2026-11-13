import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "@phosphor-icons/react";
import { useId, useState, type FormEvent, type ReactNode } from "react";

import { cx } from "../utils/cx";
import { Alert } from "./Alert";
import { Button } from "./Button";
import { TextareaField } from "./TextareaField";

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Accessible label of the close (X) button. */
  closeLabel: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** `md` for forms; `lg` for wider content. */
  size?: "md" | "lg";
  className?: string;
}

/**
 * Focus-trapped modal (Radix Dialog): Escape and the close button close it, focus returns to the
 * trigger, the rest of the page is inert for assistive technology.
 */
export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  children,
  footer,
  size = "md",
  className,
}: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-fg/40 data-[state=open]:animate-fade data-[state=closed]:animate-fade-out" />
        <RadixDialog.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cx(
            "fixed top-1/2 left-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col",
            "rounded-lg bg-surface shadow-lg text-fg data-[state=open]:animate-rise data-[state=closed]:animate-fall",
            size === "lg" ? "max-w-3xl" : "max-w-lg",
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="flex flex-col gap-1">
              <RadixDialog.Title className="m-0 font-heading text-h3">{title}</RadixDialog.Title>
              {description && (
                <RadixDialog.Description className="m-0 text-body-sm text-fg-muted">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close asChild>
              <Button variant="ghost" aria-label={closeLabel} className="-mr-2 px-2">
                <X aria-hidden="true" weight="bold" />
              </Button>
            </RadixDialog.Close>
          </div>
          <div className="overflow-y-auto px-5 py-4">{children}</div>
          {footer && (
            <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4">
              {footer}
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** What will happen (shown before the buttons). */
  consequences: ReactNode;
  confirmLabel: string;
  cancelLabel: string;
  closeLabel: string;
  tone?: "primary" | "danger";
  /** When set, a reason text area is shown; `reasonRequired` makes it mandatory. */
  reasonLabel?: string;
  reasonRequired?: boolean;
  reasonRequiredMessage?: string;
  busy?: boolean;
  /** Server or validation error shown above the buttons. */
  error?: string | undefined;
  onConfirm: (reason: string) => void;
  /** Extra fields (e.g. a reason list) above the reason text. */
  children?: ReactNode;
}

/** Confirmation with consequences and an optional reason (design 04 §2: destructive actions). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  consequences,
  confirmLabel,
  cancelLabel,
  closeLabel,
  tone = "primary",
  reasonLabel,
  reasonRequired = false,
  reasonRequiredMessage,
  busy = false,
  error,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const formId = useId();
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState<string | undefined>();

  function submit(event: FormEvent) {
    event.preventDefault();
    if (reasonLabel && reasonRequired && !reason.trim()) {
      setReasonError(reasonRequiredMessage);
      return;
    }
    setReasonError(undefined);
    onConfirm(reason.trim());
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setReason("");
          setReasonError(undefined);
        }
        onOpenChange(next);
      }}
      title={title}
      closeLabel={closeLabel}
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            form={formId}
            variant={tone === "danger" ? "danger" : "primary"}
            loading={busy}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <div className="text-body">{consequences}</div>
        {children}
        {reasonLabel && (
          <TextareaField
            label={reasonLabel}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            optional={!reasonRequired}
            error={reasonError}
            rows={3}
          />
        )}
        {error && <Alert tone="danger">{error}</Alert>}
      </form>
    </Dialog>
  );
}
