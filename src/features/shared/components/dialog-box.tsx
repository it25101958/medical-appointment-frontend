"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DialogBoxVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "destructive";

type DialogButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

interface DialogAction {
  label: ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: DialogButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  closeOnClick?: boolean;
}

interface DialogMessage {
  title?: ReactNode;
  content?: ReactNode;
  icon?: LucideIcon;
}

interface DialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;

  variant?: DialogBoxVariant;
  message?: DialogMessage;

  footer?: ReactNode;
  primaryAction?: DialogAction;
  secondaryAction?: DialogAction;
  cancelAction?: DialogAction | false;

  maxWidth?: string;
  contentClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const fadeMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.18, ease: "easeOut" },
};

const toneMap = {
  info: {
    header: "from-primary/10 via-card to-card",
    icon: "bg-primary/10 text-primary ring-primary/15",
    title: "",
    message: "border-primary/20 bg-primary/5",
    messageIcon: "bg-primary/10 text-primary",
    messageTitle: "text-primary",
    MessageIcon: Info,
  },
  success: {
    header: "from-emerald-500/10 via-card to-card",
    icon: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/15 dark:text-emerald-400",
    title: "",
    message: "border-emerald-500/20 bg-emerald-500/5",
    messageIcon: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    messageTitle: "text-emerald-700 dark:text-emerald-400",
    MessageIcon: CheckCircle2,
  },
  warning: {
    header: "from-amber-500/10 via-card to-card",
    icon: "bg-amber-500/10 text-amber-600 ring-amber-500/15 dark:text-amber-400",
    title: "",
    message: "border-amber-500/20 bg-amber-500/5",
    messageIcon: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    messageTitle: "text-amber-700 dark:text-amber-400",
    MessageIcon: AlertTriangle,
  },
  destructive: {
    header: "from-destructive/10 via-card to-card",
    icon: "bg-destructive/10 text-destructive ring-destructive/15",
    title: "text-destructive",
    message: "border-destructive/20 bg-destructive/5",
    messageIcon: "bg-destructive/10 text-destructive",
    messageTitle: "text-destructive",
    MessageIcon: ShieldAlert,
  },
} satisfies Record<
  Exclude<DialogBoxVariant, "default">,
  {
    header: string;
    icon: string;
    title: string;
    message: string;
    messageIcon: string;
    messageTitle: string;
    MessageIcon: LucideIcon;
  }
>;

function getTone(variant: DialogBoxVariant) {
  return variant === "default" ? toneMap.info : toneMap[variant];
}

function DialogActionButton({
  action,
  onOpenChange,
}: {
  action: DialogAction;
  onOpenChange: (open: boolean) => void;
}) {
  async function handleClick() {
    await action.onClick?.();

    if (action.closeOnClick) {
      onOpenChange(false);
    }
  }

  return (
    <Button
      type={action.type ?? "button"}
      variant={action.variant ?? "default"}
      disabled={action.disabled || action.loading}
      onClick={handleClick}
      className={cn("gap-2", action.className)}
    >
      {action.loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {action.loadingLabel ?? action.label}
        </>
      ) : (
        action.label
      )}
    </Button>
  );
}

export function DialogBox({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  variant = "default",
  message,
  footer,
  primaryAction,
  secondaryAction,
  cancelAction,
  maxWidth = "sm:max-w-[480px]",
  contentClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
}: DialogBoxProps) {
  const tone = getTone(variant);
  const MessageIcon = message?.icon ?? tone.MessageIcon;

  const cancel =
    cancelAction === false
      ? null
      : (cancelAction ?? {
          label: "Cancel",
          variant: "outline" as const,
          onClick: () => onOpenChange(false),
        });

  const actions = [cancel, secondaryAction, primaryAction].filter(
    Boolean,
  ) as DialogAction[];

  const footerContent =
    footer ??
    (actions.length > 0
      ? actions.map((action, index) => (
          <DialogActionButton
            key={index}
            action={action}
            onOpenChange={onOpenChange}
          />
        ))
      : null);

  const hasMessage = Boolean(message?.title || message?.content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-h-[90vh] gap-0 overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-2xl shadow-black/10",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100",
          "duration-200",
          maxWidth,
          contentClassName,
        )}
      >
        <motion.div
          initial={fadeMotion.initial}
          animate={fadeMotion.animate}
          transition={fadeMotion.transition}
        >
          <DialogHeader
            className={cn(
              "border-b border-border/60 bg-gradient-to-br px-6 pb-5 pt-6 text-left",
              tone.header,
              headerClassName,
            )}
          >
            <div className="flex items-start gap-4 pr-8">
              {icon ? (
                <div
                  aria-hidden="true"
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl ring-1",
                    tone.icon,
                  )}
                >
                  {icon}
                </div>
              ) : null}

              <div className="min-w-0 space-y-1">
                <DialogTitle
                  className={cn(
                    "text-lg font-semibold leading-none tracking-tight sm:text-xl",
                    tone.title,
                  )}
                >
                  {title}
                </DialogTitle>

                {description ? (
                  <DialogDescription className="max-w-md text-sm leading-6 text-muted-foreground">
                    {description}
                  </DialogDescription>
                ) : null}
              </div>
            </div>
          </DialogHeader>

          <div
            className={cn(
              "max-h-[60vh] space-y-5 overflow-y-auto px-6 py-5",
              !footerContent && "pb-6",
              bodyClassName,
            )}
          >
            {hasMessage ? (
              <div className={cn("rounded-xl border px-4 py-3", tone.message)}>
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      tone.messageIcon,
                    )}
                  >
                    <MessageIcon className="size-4" />
                  </div>

                  <div className="min-w-0">
                    {message?.title ? (
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          tone.messageTitle,
                        )}
                      >
                        {message.title}
                      </p>
                    ) : null}

                    {message?.content ? (
                      <div className="mt-1 text-xs leading-5 text-muted-foreground">
                        {message.content}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {children}
          </div>

          {footerContent ? (
            <DialogFooter
              className={cn(
                "border-t border-border/60 bg-muted/25 px-6 py-4",
                "flex-col-reverse gap-2 sm:flex-row sm:justify-end",
                footerClassName,
              )}
            >
              {footerContent}
            </DialogFooter>
          ) : null}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
