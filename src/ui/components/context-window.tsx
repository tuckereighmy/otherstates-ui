'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type ReactNode } from 'react';
import { ToggleButton } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { formatTokens } from './agent-format';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { Icon } from './Icon';
import { cardStyles as c, decisionKeys, useShortcutNames } from './internal/agent-parts';
import { focusStyles } from './internal/states';
import { RollingNumber } from './rolling-number';
import { UsageBar, type UsageColor, type UsageSegment } from './usage-bar';

// A model's context window as one card (spec 1.19), built around the question a person actually has: how
// much room is left, and what can I let go of to get more. The head says how full it is in words. The hero
// is the room left, not the room used. Under the bar every source is a row, in the bar's order; the ones the
// agent can free (summarize a conversation, close files) are choices. Choosing one is a preview, not an
// action: its share of the bar turns hatched and the figure counts to the room you would have. Free commits
// every choice at once, the hatched shares narrow away, and an outcome with Undo takes the actions' place.
// Pointing at a row or a part of the bar holds it while the rest fall back; the row is the readout.

export type ContextReclaim = {
  /** The segment this frees. */
  id: string;
  /** What the source shrinks to once freed. Default 0: it leaves the window. */
  to?: number;
  /** What freeing does, in a word: "Summarize", "Close". Default "Summarize" when `to` is above 0, else "Remove". */
  action?: ReactNode;
};

export type ContextWindowProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  /** Default "Context". */
  title?: ReactNode;
  /** The model, under the title. */
  model?: ReactNode;
  /** The window in tokens. */
  max: number;
  /** What fills it, in the order the bar draws them. */
  segments: UsageSegment[];
  /** The sources a person may free, and what each becomes. Leave out for a card that only reads. */
  reclaim?: ContextReclaim[];
  /** The sources already freed (controlled). */
  freed?: string[];
  /** The sources freed at first (uncontrolled). */
  defaultFreed?: string[];
  /** Called with every freed source when a person frees some or undoes it. */
  onFreedChange?: (freed: string[]) => void;
  /** Default `formatTokens`. */
  format?: (value: number) => string;
  /** @deprecated Use `reclaim={[{ id, to }]}`. */
  compact?: { id: string; to: number };
  /** @deprecated Use `freed`. */
  compacted?: boolean;
  /** @deprecated Use `onFreedChange`. */
  onCompactedChange?: (compacted: boolean) => void;
};

const reduce = '@media (prefers-reduced-motion: reduce)';
// The key swatch's corner: half of radius-xs, the same square key as UsageBar and the chart legend (spec 1.18).
const keyRadius = 0;

const s = stylex.create({
  state: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'], whiteSpace: 'nowrap',
  },
  warning: { color: t['--os-color-fg-warning'] },
  error: { color: t['--os-color-fg-error'] },

  item: { display: 'grid', minWidth: 0 },
  /** A source is a list row, 48 tall; the ones a person can free are wash choices, the rest sit plain beside them. */
  row: {
    display: 'grid', gridTemplateColumns: '8px minmax(0, 1fr) auto', alignItems: 'center', columnGap: t['--os-space-3'],
    width: '100%', margin: 0, color: t['--os-color-fg-base'], fontFamily: 'inherit', textAlign: 'start',
    backgroundColor: 'transparent',
    transitionProperty: 'opacity, background-color, box-shadow',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  marked: { gridTemplateColumns: `8px minmax(0, 1fr) auto ${t['--os-size-2xs']}` },
  option: { borderWidth: 0, cursor: 'pointer', outlineStyle: 'none', backgroundColor: t['--os-color-bg-muted'], boxShadow: 'none' },
  optionHover: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  chosen: { backgroundColor: t['--os-color-bg-surface'], boxShadow: `inset 0 0 0 1.5px ${t['--os-color-fg-base']}` },
  swatch: { width: 8, height: 8, borderRadius: keyRadius, backgroundColor: 'currentColor' },
  c1: { color: t['--os-color-chart-1'] },
  c2: { color: t['--os-color-chart-2'] },
  c3: { color: t['--os-color-chart-3'] },
  c4: { color: t['--os-color-chart-4'] },
  c5: { color: t['--os-color-chart-5'] },
  muted: { color: t['--os-color-fg-disabled'] },
  label: { fontWeight: t['--os-font-weight-regular'] },
  detail: { color: t['--os-color-fg-subtle'] },
  value: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'], fontVariantNumeric: 'tabular-nums',
  },
  mark: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: t['--os-size-2xs'], height: t['--os-size-2xs'],
    borderRadius: t['--os-radius-full'], color: 'transparent', backgroundColor: 'transparent',
    boxShadow: `inset 0 0 0 1.5px ${t['--os-color-border-control']}`,
    transitionProperty: 'background-color, box-shadow, color',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
  },
  markOn: { color: t['--os-color-bg-surface'], backgroundColor: t['--os-color-fg-base'], boxShadow: 'none' },
  undo: { marginInlineStart: 'auto' },
});

const hues = { 1: s.c1, 2: s.c2, 3: s.c3, 4: s.c4, 5: s.c5, muted: s.muted } as const;

/** How full, in words, and the color that carries it: only nearly full and over the limit take one. */
function fullness(used: number, max: number) {
  const share = max > 0 ? used / max : 1;
  if (share > 1) return { words: 'Over the limit', tone: s.error };
  if (share >= 0.9) return { words: 'Nearly full', tone: s.warning };
  if (share >= 0.7) return { words: 'Filling up', tone: null };
  return { words: 'Plenty of room', tone: null };
}

/** A context window: how much room is left, what fills it, and the sources a person can free. */
export function ContextWindow({
  title = 'Context', model, max, segments, reclaim, freed: freedProp, defaultFreed, onFreedChange, format = formatTokens,
  compact, compacted, onCompactedChange, size = 'sm', onKeyDown, ...props
}: ContextWindowProps) {
  const options = (reclaim ?? (compact ? [{ id: compact.id, to: compact.to }] : []))
    .filter(option => segments.some(segment => segment.id === option.id));
  const legacy = compact && compacted !== undefined ? (compacted ? [compact.id] : []) : undefined;
  const [ownFreed, setOwnFreed] = useState<string[]>(defaultFreed ?? []);
  const freed = freedProp ?? legacy ?? ownFreed;
  const [picked, setPicked] = useState<string[]>([]);
  const [held, setHeld] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ ids: string[]; amount: number } | null>(null);

  const optionFor = (id: string) => options.find(option => option.id === id);
  const shrunk = (segment: UsageSegment) => Math.min(segment.value, Math.max(0, optionFor(segment.id)?.to ?? 0));
  const canFree = (id: string) => !!optionFor(id) && !freed.includes(id);
  const choices = picked.filter(canFree);
  const parts: UsageSegment[] = segments.map((segment, index) => {
    const color: UsageColor = segment.color ?? (((index % 5) + 1) as 1 | 2 | 3 | 4 | 5);
    if (optionFor(segment.id) && freed.includes(segment.id)) return { ...segment, color, value: shrunk(segment) };
    return { ...segment, color, pending: choices.includes(segment.id) ? segment.value - shrunk(segment) : 0 };
  });
  const used = parts.reduce((sum, part) => sum + Math.max(0, part.value), 0);
  const release = parts.reduce((sum, part) => sum + (part.pending ?? 0), 0);
  const after = used - release;
  const staged = choices.length > 0;
  const state = fullness(used, max);
  const label = typeof title === 'string' ? title : 'Context';
  const names = useShortcutNames();

  const setFreed = (next: string[]) => {
    setOwnFreed(next);
    onFreedChange?.(next);
    if (compact) onCompactedChange?.(next.includes(compact.id));
  };
  const toggle = (id: string, on: boolean) => setPicked(current => (on ? [...current.filter(item => item !== id), id] : current.filter(item => item !== id)));
  const clear = () => setPicked([]);
  const free = () => {
    if (!staged) return;
    setFreed([...freed, ...choices]);
    setOutcome({ ids: choices, amount: release });
    setPicked([]);
  };
  const undo = () => {
    if (!outcome) return;
    setFreed(freed.filter(id => !outcome.ids.includes(id)));
    setOutcome(null);
  };
  const keys = decisionKeys(staged ? free : undefined, staged ? clear : undefined, options.length > 0);
  const showFoot = options.some(option => !freed.includes(option.id)) || (outcome && !staged);

  return (
    <Card
      size={size}
      aria-label={label}
      onKeyDown={event => { onKeyDown?.(event); keys(event); }}
      {...props}
    >
      <div {...stylex.props(c.stack)}>
        <div {...stylex.props(c.head)}>
          <span {...stylex.props(c.headText)}>
            <span {...stylex.props(c.title)}>{title}</span>
            {model && <span {...stylex.props(c.eyebrow)}>{model}</span>}
          </span>
          <span {...stylex.props(c.headEnd, s.state, state.tone)}>{state.words}</span>
        </div>

        <div {...stylex.props(c.figureRow)} aria-live="polite">
          <RollingNumber value={format(Math.abs(max - after))} {...stylex.props(c.figure)} />
          <span {...stylex.props(c.unit)}>
            {after > max ? `over the ${format(max)} limit` : staged ? 'left after freeing' : `left of ${format(max)}`}
          </span>
        </div>

        <UsageBar label={label} hideHeader size="lg" legend="none" max={max} segments={parts} format={format} active={held} onActiveChange={setHeld} />

        <ul {...stylex.props(c.washList)} aria-label="Sources" onPointerLeave={() => setHeld(null)}>
          {parts.map((part, index) => {
            const source = segments[index];
            const option = optionFor(part.id);
            const isFreed = !!option && freed.includes(part.id);
            const frees = source.value - shrunk(source);
            const dim = held != null && held !== part.id && c.dim;
            const action = option?.action ?? ((option?.to ?? 0) > 0 ? 'Summarize' : 'Remove');
            const swatch = <span aria-hidden {...stylex.props(s.swatch, hues[part.color ?? 1])} />;
            const value = <span {...stylex.props(s.value)}>{format(part.value)}</span>;

            if (option && !isFreed) {
              const on = choices.includes(part.id);
              return (
                <li key={part.id} {...stylex.props(s.item)}>
                  <ToggleButton
                    isSelected={on}
                    onChange={next => toggle(part.id, next)}
                    onHoverStart={() => setHeld(part.id)}
                    onFocus={() => setHeld(part.id)}
                    onBlur={() => setHeld(null)}
                    aria-label={typeof part.label === 'string' && typeof action === 'string'
                      ? `${part.label}, ${format(part.value)}. ${action} to free ${format(frees)}` : undefined}
                    className={button => stylex.props(
                      c.wash, c.washRow, s.row, s.marked, s.option, button.isHovered && !on && s.optionHover, on && s.chosen,
                      button.isFocusVisible && focusStyles.ring, dim,
                    ).className ?? ''}
                  >
                    {swatch}
                    <span {...stylex.props(c.rowText)}>
                      <span {...stylex.props(c.rowTitle, s.label)}>{part.label}</span>
                      <span {...stylex.props(c.meta, c.ellipsis, s.detail)}>{action} to free {format(frees)}</span>
                    </span>
                    {value}
                    <span aria-hidden {...stylex.props(s.mark, on && s.markOn)}><Icon name="check" size={12} strokeWidth={2.4} /></span>
                  </ToggleButton>
                </li>
              );
            }
            return (
              <li key={part.id} onPointerEnter={() => setHeld(part.id)} {...stylex.props(c.wash, c.washRow, s.row, options.length > 0 && s.marked, dim)}>
                {swatch}
                <span {...stylex.props(c.rowText)}>
                  <span {...stylex.props(c.rowTitle, s.label)}>{part.label}</span>
                  {isFreed && frees > 0 && <span {...stylex.props(c.meta, c.ellipsis, s.detail)}>Freed {format(frees)}</span>}
                </span>
                {value}
              </li>
            );
          })}
        </ul>

        {showFoot && (outcome && !staged ? (
          <div role="status" {...stylex.props(c.outcome)}>
            <span {...stylex.props(c.outcomeIcon, c.approved)}><Icon name="check" size={16} /></span>
            <span>Freed {format(outcome.amount)}</span>
            <span {...stylex.props(s.undo)}><Button size="xs" appearance="text" onClick={undo}>Undo</Button></span>
          </div>
        ) : (
          <div {...stylex.props(c.actionsFill)}>
            <Button size="sm" appearance="secondary" isDisabled={!staged} aria-keyshortcuts={names.dismiss} onClick={clear}>Clear</Button>
            <Button size="sm" isDisabled={!staged} aria-keyshortcuts={names.primary} onClick={free}>
              {staged ? `Free ${format(release)}` : 'Free space'}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
