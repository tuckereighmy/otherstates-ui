'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { formatDuration } from './agent-format';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';
import { focusStyles } from './internal/states';

// What a model thought before it answered (spec 1.20). While it thinks, the part is open and its label
// breathes; when it is done it folds to one line, "Thought for 12s", that opens again on a click. The
// thinking itself is quiet: muted caption text on a rail, never competing with the answer.

const reduce = '@media (prefers-reduced-motion: reduce)';
const canHover = '@media (hover: hover)';
const wave = stylex.keyframes({
  '0%, 100%': { opacity: 0.35 },
  '50%': { opacity: 1 },
});

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], minWidth: 0 },
  trigger: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'], justifySelf: 'start', margin: 0,
    marginInlineStart: `calc(${t['--os-space-1']} * -1)`, paddingBlock: t['--os-space-0-5'], paddingInline: t['--os-space-1'],
    borderRadius: t['--os-radius-xs'], backgroundColor: 'transparent', cursor: 'pointer',
    // Text-only control (spec 1.8): fg-muted, fg-base on hover.
    color: { default: t['--os-color-fg-muted'], ':hover': { default: null, [canHover]: t['--os-color-fg-base'] } },
    fontFamily: 'inherit', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    transitionProperty: 'color', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  // A small reveal (spec 1.10): the chevron turns over the popup duration.
  chevron: {
    display: 'flex', transitionProperty: 'transform', transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  chevronOpen: { transform: 'rotate(90deg)' },
  body: {
    minWidth: 0, paddingInlineStart: t['--os-space-3'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
    borderInlineStartWidth: t['--os-stroke-2'], borderInlineStartStyle: 'solid', borderInlineStartColor: t['--os-color-border-subtle'],
  },
  letter: {
    animationName: { default: wave, [reduce]: 'none' }, animationDuration: `calc(${t['--os-motion-spin']} * 2)`,
    animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite',
  },
  delay: (ms: number) => ({ animationDelay: `${ms}ms` }),
});

export type ThinkingTextProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  /** Default "Thinking". */
  children?: string;
};

/** A word that breathes letter by letter while a model works. Reduced motion keeps it still. */
export function ThinkingText({ children = 'Thinking', className, style, ref, ...props }: ThinkingTextProps) {
  return (
    <span ref={ref} role="status" aria-label={children} {...props} {...withStyles(stylex.props(), className, style)}>
      {[...children].map((char, index) => (
        <span key={index} aria-hidden {...stylex.props(s.letter, s.delay(index * 70))}>{char}</span>
      ))}
    </span>
  );
}

export type ReasoningProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** The model's thinking: text or any content. */
  children?: ReactNode;
  /** The model is still thinking. */
  streaming?: boolean;
  /** How long it thought, in ms: "Thought for 12s". */
  duration?: number;
  /** Open (controlled). Default: open while streaming, folded once done. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** A model's thinking: open while it thinks, one line once it is done. */
export function Reasoning({ children, streaming = false, duration, open, onOpenChange, className, style, ref, ...props }: ReasoningProps) {
  const [own, setOwn] = useState(streaming);
  const touched = useRef(false);
  const was = useRef(streaming);
  useEffect(() => {
    if (was.current !== streaming && !touched.current) setOwn(streaming);
    was.current = streaming;
  }, [streaming]);
  const shown = open ?? own;
  const bodyId = useId();
  const toggle = () => { touched.current = true; setOwn(!shown); onOpenChange?.(!shown); };
  return (
    <div ref={ref} {...props} {...withStyles(stylex.props(s.root), className, style)}>
      <button type="button" aria-expanded={shown} aria-controls={bodyId} onClick={toggle} {...stylex.props(s.trigger, focusStyles.ringVisible)}>
        {streaming ? <ThinkingText /> : <span>{duration !== undefined ? `Thought for ${formatDuration(duration)}` : 'Thoughts'}</span>}
        <span aria-hidden {...stylex.props(s.chevron, shown && s.chevronOpen)}><Icon name="chevron-right" size={14} /></span>
      </button>
      {shown && children && <div id={bodyId} {...stylex.props(s.body)}>{children}</div>}
    </div>
  );
}
