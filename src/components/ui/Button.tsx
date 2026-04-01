import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { classNames } from "../../lib/utils";

interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={classNames("button", `button--${variant}`, className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
