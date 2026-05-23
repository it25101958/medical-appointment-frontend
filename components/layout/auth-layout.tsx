import Image from "next/image";
import Link from "next/link";
import React from "react";

type ActionLink = { href: string; label: string; external?: boolean };

type AuthLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  imagePriority?: boolean;
  showImage?: boolean;
  imagePosition?: "left" | "right";
  registerLink?: ActionLink | null;
  primaryAction?: ActionLink | null;
  secondaryAction?: ActionLink | null;
  infoText?: string;
  className?: string;
  footer?: React.ReactNode;
};

export function AuthLayout({
  title,
  description,
  children,
  imageSrc = "/login.png",
  imageAlt = "Auth image",
  imagePriority = true,
  showImage = true,
  imagePosition = "left",
  registerLink = null,
  primaryAction = null,
  secondaryAction = null,
  infoText,
  className = "",
  footer,
}: AuthLayoutProps) {
  const ImagePanel = (
    <div className="hidden lg:flex flex-1 relative rounded-3xl bg-primary/5 border border-border/60 overflow-hidden">
      <div className="relative h-full w-full">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          priority={imagePriority}
        />
      </div>
      <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
    </div>
  );

  return (
    <div className="col-span-full lg:col-start-3 lg:col-span-8 flex flex-col lg:flex-row items-stretch justify-center gap-4 min-h-[30vh]">
      {showImage && imagePosition === "left" && ImagePanel}

      <div
        className={`flex-1 w-full flex flex-col justify-center rounded-3xl border border-border/60 bg-card/50 p-8 shadow-sm md:p-10 ${className}`}
      >
        <div className="mb-6 flex flex-col space-y-2 text-center lg:text-left">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className={"w-full max-w-md mx-auto"}>{children}</div>

        <div className="mt-6 flex flex-col items-center gap-2">
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              aria-label={primaryAction.label}
              {...(primaryAction.external
                ? { target: "_blank", rel: "noreferrer" }
                : {})}
            >
              {primaryAction.label}
            </Link>
          )}

          {secondaryAction && (
            <Link
              href={secondaryAction.href}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
              aria-label={secondaryAction.label}
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>

        {registerLink && (
          <div className="mt-6 space-y-3 border-t border-border/10 pt text-center text-sm text-muted-foreground">
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href={registerLink.href}
                className="font-semibold text-primary underline-offset-4 transition-colors hover:underline"
                {...(registerLink.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
              >
                {registerLink.label}
              </Link>
            </p>
          </div>
        )}

        {infoText && (
          <div className="mt-6 space-y-3 border-t border-border/10 pt text-center text-sm text-muted-foreground">
            <p>{infoText}</p>
          </div>
        )}

        {footer && <div className="mt-4">{footer}</div>}
      </div>

      {showImage && imagePosition === "right" && ImagePanel}
    </div>
  );
}

export default AuthLayout;
