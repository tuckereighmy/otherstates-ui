'use client';

import * as stylex from '@stylexjs/stylex';
import { Children, cloneElement, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactElement, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Composer, type ComposerProps } from './composer';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';

// The conversation's frame (spec 1.20): one centered column for the messages and the composer, the
// composer sticky at the foot, and a thread that stays pinned to the newest text while it streams,
// unless the person scrolls up. Then a round button above the composer jumps back down. A Composer passed
// in spans the column exactly (it fills it unless it sets `fullWidth` itself).

const phone = '@media (max-width: 640px)';
const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  root: {
    position: 'relative', display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', minWidth: 0,
    backgroundColor: t['--os-color-bg-canvas'], color: t['--os-color-fg-base'], fontFamily: t['--os-font-family'],
  },
  viewport: { flex: '1 1 auto', minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain', display: 'flex', flexDirection: 'column' },
  column: {
    boxSizing: 'border-box', width: '100%', marginInline: 'auto',
    paddingInline: { default: t['--os-space-6'], [phone]: t['--os-space-4'] },
  },
  width: (max: number) => ({ maxWidth: max }),
  messages: { flex: '1 0 auto', display: 'flex', flexDirection: 'column', gap: t['--os-space-8'], paddingBlockStart: t['--os-space-8'], paddingBlockEnd: t['--os-space-6'] },
  footer: {
    position: 'sticky', insetBlockEnd: 0, zIndex: 1, backgroundColor: t['--os-color-bg-canvas'],
    paddingBlockStart: t['--os-space-2'], paddingBlockEnd: t['--os-space-4'],
  },
  footnote: {
    margin: 0, marginBlockStart: t['--os-space-2'], textAlign: 'center', color: t['--os-color-fg-subtle'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
  },
  jump: {
    position: 'absolute', insetBlockStart: 0, insetInlineStart: '50%', transform: `translate(-50%, calc(-100% - ${t['--os-space-2']}))`,
    transitionProperty: 'opacity, transform', transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  jumpHidden: { opacity: 0, pointerEvents: 'none', transform: 'translate(-50%, -100%)' },
  relative: { position: 'relative' },
  empty: {
    flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: t['--os-space-6'],
    paddingBlock: t['--os-space-12'],
  },
});

export type ChatThreadProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** ChatMessage elements, oldest first. */
  children?: ReactNode;
  /** The Composer, sticky at the foot of the thread. It spans the column unless it sets `fullWidth`. */
  composer?: ReactNode;
  /** A caption under the composer: "Agents can make mistakes. Check important changes." */
  footnote?: ReactNode;
  /** Shown instead of the messages while there are none, above the composer, which moves up beside it: a greeting. */
  empty?: ReactNode;
  /** Shown under the composer while the thread is empty: PromptSuggestions. */
  suggestions?: ReactNode;
  /** The column's widest size in px. Default 720. */
  maxWidth?: number;
  /** Names the message log for assistive tech. Default "Conversation". */
  label?: string;
};

/** The composer's surface spans the column (spec 1.20): a Composer fills it unless it sets `fullWidth` itself. */
function spanColumn(composer: ReactNode) {
  if (!isValidElement(composer) || composer.type !== Composer) return composer;
  const element = composer as ReactElement<ComposerProps>;
  return element.props.fullWidth === undefined ? cloneElement(element, { fullWidth: true }) : element;
}

/** A conversation: messages in one column, pinned to the newest, with the composer at the foot. */
export function ChatThread({
  children, composer, footnote, empty, suggestions, maxWidth = 720, label = 'Conversation', className, style, ref, ...props
}: ChatThreadProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const pinned = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  const isEmpty = Children.count(children) === 0 && empty !== undefined;

  const lastTop = useRef(0);
  // Only a person scrolls up: moving up unpins, reaching the bottom pins. Scrolling down on its way to the
  // newest text (ours, smooth) never unpins.
  const measure = useCallback(() => {
    const el = viewport.current;
    if (!el) return;
    const bottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    if (bottom) pinned.current = true;
    else if (el.scrollTop < lastTop.current - 2) pinned.current = false;
    lastTop.current = el.scrollTop;
    setAtBottom(bottom);
  }, []);

  const toBottom = useCallback((smooth: boolean) => {
    const el = viewport.current;
    if (!el) return;
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth && !quiet ? 'smooth' : 'auto' });
  }, []);

  // Start at the newest message, and follow new text while pinned.
  useLayoutEffect(() => { toBottom(false); }, [toBottom]);
  useEffect(() => {
    const node = content.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => { if (pinned.current) toBottom(false); });
    observer.observe(node);
    // A message the person just sent brings them back to the newest text, wherever they had scrolled.
    const sent = new MutationObserver(records => {
      const added = records.flatMap(record => Array.from(record.addedNodes));
      if (added.some(item => item instanceof HTMLElement && item.dataset.role === 'user')) { pinned.current = true; toBottom(true); }
    });
    sent.observe(node, { childList: true });
    return () => { observer.disconnect(); sent.disconnect(); };
  }, [toBottom, isEmpty]);

  const column = (extra?: stylex.StyleXStyles) => stylex.props(s.column, s.width(maxWidth), extra);
  const composerNode = spanColumn(composer);

  return (
    <div ref={ref} {...props} {...withStyles(stylex.props(s.root), className, style)}>
      <div ref={viewport} onScroll={measure} {...stylex.props(s.viewport)}>
        {isEmpty ? (
          <div {...column(s.empty)}>
            {empty}
            <div>
              {composerNode}
              {footnote && <p {...stylex.props(s.footnote)}>{footnote}</p>}
            </div>
            {suggestions}
          </div>
        ) : (
          <>
            <div ref={content} role="log" aria-label={label} aria-live="polite" aria-relevant="additions" {...column(s.messages)}>
              {children}
            </div>
            {(composer || footnote) && (
              <div {...stylex.props(s.footer)}>
                <div {...column(s.relative)}>
                  <span {...stylex.props(s.jump, atBottom && s.jumpHidden)} aria-hidden={atBottom || undefined}>
                    <Button size="sm" appearance="secondary" iconOnly aria-label="Scroll to the newest message" tabIndex={atBottom ? -1 : 0}
                      onClick={() => { pinned.current = true; toBottom(true); }}>
                      <Icon name="arrow-down" />
                    </Button>
                  </span>
                  {composerNode}
                  {footnote && <p {...stylex.props(s.footnote)}>{footnote}</p>}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
