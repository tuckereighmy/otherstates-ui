import type React from 'react';
export function withClassName(styles: { className?: string }, className?: string) {
  return [styles.className, className].filter(Boolean).join(' ');
}

/** StyleX props merged with a caller's className and style, for spreading onto an element. */
export function withStyles(
  styles: { className?: string; style?: Record<string, unknown> },
  className?: string,
  style?: object,
): { className?: string; style?: React.CSSProperties } {
  return {
    className: withClassName(styles, className) || undefined,
    style: styles.style || style ? { ...(styles.style as React.CSSProperties), ...(style as React.CSSProperties) } : undefined,
  };
}
