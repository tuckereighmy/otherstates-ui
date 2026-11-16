import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

const s = stylex.create({
  srOnly: {
    position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden',
    clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0,
  },
});

/** Text for assistive tech only: a state word the eye gets from a color or an icon. */
export function SrOnly({ children }: { children: ReactNode }) {
  return <span {...stylex.props(s.srOnly)}>{children}</span>;
}
