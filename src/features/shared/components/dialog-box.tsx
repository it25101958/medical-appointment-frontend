import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogBoxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  contentClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

export function DialogBox({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  maxWidth = "sm:max-w-[460px]",
  contentClassName,
  bodyClassName,
  footerClassName,
}: DialogBoxProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-5 border-border/60 bg-card p-0 shadow-xl",
          maxWidth,
          contentClassName,
        )}
      >
        <DialogHeader>
          <div className="border-b border-border/60 px-6 pb-5 pt-6">
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  {title}
                </DialogTitle>
                {description ? (
                  <DialogDescription>{description}</DialogDescription>
                ) : null}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className={cn("space-y-5 px-6", bodyClassName)}>{children}</div>

        {footer ? (
          <DialogFooter
            className={cn(
              "border-t border-border/60 bg-muted/20 px-6 py-4",
              footerClassName,
            )}
          >
            {footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
