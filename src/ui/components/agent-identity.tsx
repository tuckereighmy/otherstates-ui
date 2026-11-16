import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { agentStateLabels, StatusDot, type AgentState } from './agent-status';
import { Icon, type IconName } from './Icon';
import { withStyles } from './internal/class-name';
import { SrOnly } from './internal/sr-only';

// Agents are squares, people are circles (spec 1.19). An agent's tile is neutral unless several agents
// share a view, where `color` tells them apart with the chart palette, in order.

export type AgentColor = 1 | 2 | 3 | 4 | 5;
export type AgentGlyphSize = 'xs' | 'sm' | 'md' | 'lg';

const s = stylex.create({
  glyph: {
    position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    boxSizing: 'border-box', backgroundColor: t['--os-color-bg-muted'], color: t['--os-color-fg-muted'],
    fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'], lineHeight: 1,
  },
  xs: { width: 20, height: 20, borderRadius: t['--os-radius-xs'], fontSize: t['--os-font-size-xs'] },
  sm: { width: t['--os-size-xs'], height: t['--os-size-xs'], borderRadius: t['--os-radius-sm'], fontSize: t['--os-font-size-xs'] },
  md: { width: t['--os-size-sm'], height: t['--os-size-sm'], borderRadius: t['--os-radius-sm'], fontSize: t['--os-font-size-caption'] },
  lg: { width: t['--os-size-md'], height: t['--os-size-md'], borderRadius: t['--os-radius-md'], fontSize: t['--os-font-size-sm'] },
  c1: { color: t['--os-color-chart-1'], backgroundColor: `color-mix(in oklab, ${t['--os-color-chart-1']} 14%, ${t['--os-color-bg-surface']})` },
  c2: { color: t['--os-color-chart-2'], backgroundColor: `color-mix(in oklab, ${t['--os-color-chart-2']} 14%, ${t['--os-color-bg-surface']})` },
  c3: { color: t['--os-color-chart-3'], backgroundColor: `color-mix(in oklab, ${t['--os-color-chart-3']} 14%, ${t['--os-color-bg-surface']})` },
  c4: { color: t['--os-color-chart-4'], backgroundColor: `color-mix(in oklab, ${t['--os-color-chart-4']} 14%, ${t['--os-color-bg-surface']})` },
  c5: { color: t['--os-color-chart-5'], backgroundColor: `color-mix(in oklab, ${t['--os-color-chart-5']} 14%, ${t['--os-color-bg-surface']})` },
  dot: {
    position: 'absolute', insetBlockEnd: `calc(${t['--os-space-0-5']} * -1)`, insetInlineEnd: `calc(${t['--os-space-0-5']} * -1)`, display: 'flex', borderRadius: t['--os-radius-full'],
    borderWidth: t['--os-stroke-2'], borderStyle: 'solid', borderColor: t['--os-color-bg-surface'],
    backgroundColor: t['--os-color-bg-surface'],
  },

  identity: { display: 'flex', alignItems: 'center', gap: t['--os-space-3'], minWidth: 0 },
  identitySm: { gap: t['--os-space-2'] },
  text: { display: 'grid', gap: t['--os-space-0-5'], minWidth: 0, flex: '1 1 auto' },
  name: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  model: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'],
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  end: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], flexShrink: 0, marginInlineStart: 'auto' },
});

const colors = { 1: s.c1, 2: s.c2, 3: s.c3, 4: s.c4, 5: s.c5 } as const;
const iconPx: Record<AgentGlyphSize, number> = { xs: 12, sm: 14, md: 16, lg: 20 };

export type AgentGlyphProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> & {
  ref?: Ref<HTMLSpanElement>;
  /** The agent's name. Its first letter shows when there is no `icon`; it is the accessible name unless `decorative`. */
  name: string;
  /** A glyph from the icon set instead of the initial. */
  icon?: IconName;
  /** A chart color, 1 to 5, when several agents share a view. Default neutral. */
  color?: AgentColor;
  /** 20, 24, 32 or 40 px. Default `sm`. */
  size?: AgentGlyphSize;
  /** A state dot at the bottom end. */
  state?: AgentState;
  /** Hides the tile from assistive tech when the name is written next to it. */
  decorative?: boolean;
};

/** An agent's tile: a rounded square with an initial or a glyph. */
export function AgentGlyph({ name, icon, color, size = 'sm', state, decorative = false, className, style, ref, ...props }: AgentGlyphProps) {
  const label = state ? `${name}, ${agentStateLabels[state].toLowerCase()}` : name;
  return (
    <span
      ref={ref}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative ? true : undefined}
      {...props}
      {...withStyles(stylex.props(s.glyph, s[size], color !== undefined && colors[color]), className, style)}
    >
      {icon ? <Icon name={icon} size={iconPx[size]} /> : name.trim().charAt(0).toUpperCase()}
      {state && <span {...stylex.props(s.dot)}><StatusDot state={state} size={size === 'lg' ? 'md' : 'sm'} /></span>}
    </span>
  );
}

export type AgentIdentityProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> & {
  ref?: Ref<HTMLDivElement>;
  name: string;
  /** The model or role under the name: "Large model", "Researcher". */
  model?: ReactNode;
  icon?: IconName;
  color?: AgentColor;
  /** `sm` sets a 24 px tile beside one line; `md` (default) a 32 px tile beside the name and model. */
  size?: 'sm' | 'md';
  /** Puts a state dot on the tile. */
  state?: AgentState;
  /** Trailing content: a StatusBadge, a cost, a menu. */
  end?: ReactNode;
};

/** An agent's tile, name and model on one row. */
export function AgentIdentity({ name, model, icon, color, size = 'md', state, end, className, style, ref, ...props }: AgentIdentityProps) {
  return (
    <div ref={ref} {...props} {...withStyles(stylex.props(s.identity, size === 'sm' && s.identitySm), className, style)}>
      <AgentGlyph name={name} icon={icon} color={color} size={size === 'sm' ? 'sm' : 'md'} state={state} decorative />
      <span {...stylex.props(s.text)}>
        <span {...stylex.props(s.name)}>{name}{state && <SrOnly>{`, ${agentStateLabels[state].toLowerCase()}`}</SrOnly>}</span>
        {model && size === 'md' && <span {...stylex.props(s.model)}>{model}</span>}
      </span>
      {end && <span {...stylex.props(s.end)}>{end}</span>}
    </div>
  );
}
