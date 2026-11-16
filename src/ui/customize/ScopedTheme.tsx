'use client';

// A themed region: every token written inline on a wrapper, and every React Aria overlay
// opened inside it portaled into the wrapper, so popovers, menus and dialogs read the region's tokens.
import { useMemo, useRef, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria/PortalProvider';
import { toInlineStyle } from './apply.ts';
import type { DerivedTheme, Scheme } from './types.ts';

export type ScopedThemeProps = {
  readonly theme: DerivedTheme;
  readonly scheme: Scheme;
  readonly className?: string;
  readonly children: ReactNode;
};

/**
 * Renders `<div data-os-theme-scope>` with all 124 tokens inline (an element-level override that set only
 * some tokens would inherit the rest from the page's scheme) and `color-scheme`. Keep the wrapper free of
 * `transform`, `filter`, `contain`, `overflow: hidden` and `z-index`: each would clip popovers or trap fixed
 * overlays. Unlike a StyleX theme class, it stacks on top of the page theme without resetting it.
 */
export function ScopedTheme({ theme, scheme, className, children }: ScopedThemeProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const style = useMemo(
    () => ({ ...toInlineStyle(theme, scheme, { complete: true }), colorScheme: scheme }) as CSSProperties,
    [theme, scheme],
  );
  return (
    <div ref={ref} data-os-theme-scope={`${theme.code}|${scheme}`} className={className} style={style}>
      <UNSAFE_PortalProvider getContainer={() => ref.current}>{children}</UNSAFE_PortalProvider>
    </div>
  );
}
