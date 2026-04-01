import type { PropsWithChildren } from "react";

import { classNames } from "../../lib/utils";
import type { Tone } from "../../lib/types";

interface BadgeProps extends PropsWithChildren {
  tone?: Tone;
}

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={classNames("badge", `badge--${tone}`)}>{children}</span>;
}
