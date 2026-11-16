import type { ReactNode } from 'react';

// Icons for the docs shell, drawn on a 16px grid with a 1.5px stroke.
// The library's own Icon belongs to the components; the shell keeps its own small set.

const shapes = {
  search: <><circle cx="7.25" cy="7.25" r="4.5" /><path d="m10.6 10.6 3.15 3.15" /></>,
  menu: <path d="M2.5 5.25h11M2.5 10.75h11" />,
  close: <path d="m4 4 8 8m0-8-8 8" />,
  copy: <><rect x="5.75" y="5.75" width="7.75" height="7.75" rx="2" /><path d="M10.25 5.75V4.5a2 2 0 0 0-2-2H4.5a2 2 0 0 0-2 2v3.75a2 2 0 0 0 2 2h1.25" /></>,
  check: <path d="m3.25 8.5 3 3 6.5-7" />,
  sun: <><circle cx="8" cy="8" r="2.75" /><path d="M8 1.75v1.5m0 9.5v1.5M1.75 8h1.5m9.5 0h1.5M3.58 3.58l1.06 1.06m6.72 6.72 1.06 1.06m0-8.84-1.06 1.06m-6.72 6.72-1.06 1.06" /></>,
  moon: <path d="M13.25 9.6A5.6 5.6 0 0 1 6.4 2.75a5.6 5.6 0 1 0 6.85 6.85Z" />,
  arrowLeft: <path d="M13 8H3m4-4L3 8l4 4" />,
  arrowRight: <path d="M3 8h10M9 4l4 4-4 4" />,
  chevronDown: <path d="m4 6 4 4 4-4" />,
  chevronUp: <path d="m4 10 4-4 4 4" />,
  swatch: <><path d="M2.75 4.25a1.5 1.5 0 0 1 1.5-1.5h2.5a1.5 1.5 0 0 1 1.5 1.5v7.5a2.5 2.5 0 0 1-5 0Z" /><path d="m8.25 6 1.9-1.9a1.5 1.5 0 0 1 2.12 0l1.03 1.03a1.5 1.5 0 0 1 0 2.12L7.5 13" /><path d="M5.25 13.25h7a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5h-1.5" /><circle cx="5.25" cy="11.25" r=".5" /></>,
} satisfies Record<string, ReactNode>;

export type DocsIconName = keyof typeof shapes;

export function DocsIcon({ name, size = 16 }: { name: DocsIconName; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {shapes[name]}
    </svg>
  );
}
