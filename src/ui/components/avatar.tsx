'use client';

import * as stylex from '@stylexjs/stylex';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, ComponentPropsWithRef, Ref } from 'react';
import { GradientAvatar } from '@outpacelabs/avatars';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { focusStyles } from './internal/states';

// Avatar (DESIGN_SPEC 2.2 Avatar): a lone avatar has no ring; the 2px surface ring belongs to
// AvatarGroup members, where it separates overlapping faces. Diameters sit on an 8px scale
// (24 / 32 / 40 / 48 / 64 / 80; the first four equal control heights) and initials are about 0.4 x the
// diameter, on the type scale (12 / 13 / 16 / 18 / 22 / 29). The fallback fill is bg-muted.
// AvatarGroup: faces overlap by a fifth of their diameter (8px at md) and lift
// on hover with the small-object spring. Its name tip follows the Tooltip spec (1.9, 2.2 Tooltip):
// radius md, 32 tall, padding 12, 12/16 500, the contrast fill, 160ms in and 120ms out; under reduced
// motion it only fades.

const reduce = '@media (prefers-reduced-motion: reduce)';

const s = stylex.create({
  avatar: {
    boxSizing: 'border-box',
    verticalAlign: 'top',
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    backgroundColor: t['--os-color-bg-muted'],
    color: t['--os-color-fg-base'],
    fontFamily: t['--os-font-family'],
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: 1,
    userSelect: 'none',
  },
  avatarImage: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarMesh: { display: 'grid', placeItems: 'center', width: '100%', height: '100%', overflow: 'hidden' },
  // With a status dot, the outer box carries the name and the dot sits outside the clipped face.
  withStatus: { position: 'relative', display: 'inline-flex', verticalAlign: 'top', flexShrink: 0 },
  dot: {
    position: 'absolute',
    boxSizing: 'border-box',
    borderRadius: t['--os-radius-full'],
    boxShadow: `0 0 0 2px ${t['--os-color-bg-surface']}`,
  },
  dotGeometry: (size: number, offset: number) => ({ width: size, height: size, insetBlockEnd: offset, insetInlineEnd: offset }),
  online: { backgroundColor: t['--os-color-fg-success'] },
  away: { backgroundColor: t['--os-color-fg-warning'] },
  busy: { backgroundColor: t['--os-color-fg-error'] },
  offline: { backgroundColor: t['--os-color-border-control'] },
});

/** Diameter and initial per size: 0.4 x the diameter on the type scale; tracking 0 at 12, tight to 18, -0.02em above. */
const sizeStyles = stylex.create({
  xs: { width: 24, height: 24, fontSize: t['--os-font-size-xs'], letterSpacing: 0 },
  sm: { width: 32, height: 32, fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'] },
  md: { width: 40, height: 40, fontSize: t['--os-font-size-body'], letterSpacing: t['--os-tracking-tight'] },
  lg: { width: 48, height: 48, fontSize: t['--os-font-size-lg'], letterSpacing: t['--os-tracking-tight'] },
  xl: { width: 64, height: 64, fontSize: t['--os-font-size-xl'], letterSpacing: '-0.02em' },
  '2xl': { width: 80, height: 80, fontSize: t['--os-font-size-2xl'], letterSpacing: '-0.02em' },
});

const radii = stylex.create({
  full: { borderRadius: t['--os-radius-full'] },
  sm: { borderRadius: t['--os-radius-sm'] },
  md: { borderRadius: t['--os-radius-md'] },
  lg: { borderRadius: t['--os-radius-lg'] },
  xl: { borderRadius: t['--os-radius-xl'] },
});

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
/** The pre-1.2 names, accepted as aliases of `sm`, `md` and `lg`. */
export type AvatarLegacySize = 'small' | 'medium' | 'large';
export type AvatarShape = 'circle' | 'square';
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline';

type AvatarMetrics = { diameter: number; square: keyof typeof radii; dot: number };

/** Diameters in px (match `sizeStyles`), for the gradient, the fallback glyph and the status dot. */
const metrics: Record<AvatarSize, AvatarMetrics> = {
  xs: { diameter: 24, square: 'sm', dot: 6 },
  sm: { diameter: 32, square: 'sm', dot: 8 },
  md: { diameter: 40, square: 'md', dot: 10 },
  lg: { diameter: 48, square: 'md', dot: 12 },
  xl: { diameter: 64, square: 'lg', dot: 14 },
  '2xl': { diameter: 80, square: 'xl', dot: 16 },
};

const legacySizes: Record<AvatarLegacySize, AvatarSize> = { small: 'sm', medium: 'md', large: 'lg' };
const statusLabels: Record<AvatarStatus, string> = { online: 'online', away: 'away', busy: 'busy', offline: 'offline' };

function normalizeAvatarSize(size: AvatarSize | AvatarLegacySize | undefined): AvatarSize {
  if (size === undefined) return 'md';
  return size in legacySizes ? legacySizes[size as AvatarLegacySize] : size as AvatarSize;
}

function merge(sx: { className?: string; style?: CSSProperties }, className?: string, style?: CSSProperties) {
  return {
    className: [sx.className, className].filter(Boolean).join(' ') || undefined,
    style: sx.style || style ? { ...sx.style, ...style } : undefined,
  };
}

export type AvatarProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** The person's name. It is the accessible name and the source of the initial. */
  name?: string;
  /** Image URL. The fallback shows while it is missing or if it fails to load. */
  src?: string;
  /** 24, 32, 40, 48, 64 or 80 px. Default `md` (40). */
  size?: AvatarSize | AvatarLegacySize;
  /** `circle` (default) or `square`, whose radius follows the size. */
  shape?: AvatarShape;
  /** What shows without an image: the first initial, a person glyph, or a gradient seeded by `name`. */
  fallback?: 'initial' | 'icon' | 'gradient';
  /** A presence dot at the bottom end. Its label is added to the accessible name. */
  status?: AvatarStatus;
  /** Replaces the status word in the accessible name ("online", "away", "busy", "offline"). */
  statusLabel?: string;
  /** Hides the avatar from assistive tech when a visible name sits next to it. */
  decorative?: boolean;
  /** Colors for the `gradient` fallback. */
  colors?: string[];
};

export function Avatar({
  name, src, size: sizeProp, shape = 'circle', fallback = 'initial', status, statusLabel, decorative = false, colors,
  className, style, ...props
}: AvatarProps) {
  const [failed, setFailed] = useState<string>();
  const size = normalizeAvatarSize(sizeProp);
  const m = metrics[size];
  const initial = Array.from(name?.trim() ?? '')[0]?.toLocaleUpperCase();
  const label = name || 'Profile avatar';
  const a11y = decorative
    ? { 'aria-hidden': true as const }
    : { role: 'img', 'aria-label': status ? `${label}, ${statusLabel ?? statusLabels[status]}` : label };
  const face = stylex.props(s.avatar, sizeStyles[size], radii[shape === 'square' ? m.square : 'full']);
  const content = src && failed !== src
    ? <img src={src} alt="" onError={() => setFailed(src)} {...stylex.props(s.avatarImage)} />
    : fallback === 'gradient'
      ? <span {...stylex.props(s.avatarMesh)}><GradientAvatar seed={name ?? 'Otherstates'} size={m.diameter} radius={0} colors={colors} /></span>
      : fallback === 'initial' && initial ? initial : <Icon name="user" size={m.diameter / 2} />;

  if (!status) {
    return <span {...a11y} {...props} {...merge(face, className, style)}>{content}</span>;
  }

  // The dot's center sits on the edge: 45 degrees round a circle, on the corner's curve for a square.
  const edge = shape === 'square' ? 0.06 : 0.146;
  const offset = Math.round(m.diameter * edge - m.dot / 2);
  return (
    <span {...a11y} {...props} {...merge(stylex.props(s.withStatus), className, style)}>
      <span {...face}>{content}</span>
      <span aria-hidden="true" {...stylex.props(s.dot, s.dotGeometry(m.dot, offset), s[status])} />
    </span>
  );
}

const g = stylex.create({
  // The block-start padding leaves room for the hover lift.
  group: { display: 'inline-flex', alignItems: 'center', paddingBlockStart: t['--os-space-2'], isolation: 'isolate', position: 'relative', maxWidth: '100%' },
  member: {
    position: 'relative',
    display: 'flex',
    flexShrink: 0,
    boxShadow: `0 0 0 2px ${t['--os-color-bg-surface']}`,
    transitionProperty: 'translate, scale',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  depth: (zIndex: number) => ({ zIndex }),
  lift: (lift: number, scale: number) => ({
    translate: { default: `0 ${lift}px`, [reduce]: '0 0' },
    scale: { default: String(scale), [reduce]: '1' },
  }),
  // Entering the group, the faces lift on the small-object spring: one overshoot, no second swing.
  entering: { transitionTimingFunction: t['--os-ease-spring'] },
  count: {
    boxSizing: 'border-box',
    display: 'inline-grid',
    placeItems: 'center',
    backgroundColor: t['--os-color-bg-muted'],
    color: t['--os-color-fg-muted'],
    fontFamily: t['--os-font-family'],
    fontWeight: t['--os-font-weight-medium'],
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
    userSelect: 'none',
  },
  tip: {
    position: 'absolute',
    insetBlockEnd: `calc(100% + ${t['--os-space-0-5']})`,
    insetInlineStart: 0,
    boxSizing: 'border-box',
    height: t['--os-size-sm'],
    paddingInline: t['--os-space-3'],
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    overflow: 'hidden',
    borderRadius: t['--os-radius-md'],
    color: t['--os-color-fg-on-contrast'],
    backgroundColor: t['--os-color-bg-contrast'],
    boxShadow: t['--os-shadow-popup'],
    fontFamily: t['--os-font-family'],
    fontSize: t['--os-font-size-xs'],
    fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-xs'],
    letterSpacing: 0,
    whiteSpace: 'nowrap',
    pointerEvents: 'none',
    transformOrigin: '50% 100%',
    transitionProperty: { default: 'translate, width, opacity, transform', [reduce]: 'opacity' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  tipPosition: (x: number, width: number, visible: boolean) => ({
    translate: `${x}px 0`,
    width,
    opacity: visible ? 1 : 0,
    transform: { default: visible ? 'none' : 'translateY(2px) scale(.96)', [reduce]: 'none' },
    transitionDuration: { default: visible ? t['--os-motion-hover'] : t['--os-motion-press'], [reduce]: t['--os-motion-press'] },
  }),
  tipText: { flexShrink: 0 },
});

/** Each face overlaps the one before by about a fifth of its diameter, on the spacing scale. */
const overlapStyles = stylex.create({
  xs: { marginInlineStart: `calc(-1 * ${t['--os-space-1']})` },
  sm: { marginInlineStart: `calc(-1 * ${t['--os-space-1-5']})` },
  md: { marginInlineStart: `calc(-1 * ${t['--os-space-2']})` },
  lg: { marginInlineStart: `calc(-1 * ${t['--os-space-2']})` },
  xl: { marginInlineStart: `calc(-1 * ${t['--os-space-3']})` },
  '2xl': { marginInlineStart: `calc(-1 * ${t['--os-space-4']})` },
});

/** The "+N" count: the initial's size up to 16. */
const countTextStyles = stylex.create({
  xs: { fontSize: t['--os-font-size-xs'], letterSpacing: 0 },
  sm: { fontSize: t['--os-font-size-caption'], letterSpacing: t['--os-tracking-tight'] },
  md: { fontSize: t['--os-font-size-body'], letterSpacing: t['--os-tracking-tight'] },
  lg: { fontSize: t['--os-font-size-body'], letterSpacing: t['--os-tracking-tight'] },
  xl: { fontSize: t['--os-font-size-body'], letterSpacing: t['--os-tracking-tight'] },
  '2xl': { fontSize: t['--os-font-size-body'], letterSpacing: t['--os-tracking-tight'] },
});

type GroupMember = { key: string; label: string; tip: string; size: AvatarSize; shape: AvatarShape; item?: AvatarProps; count?: number };

export type AvatarGroupProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** The people, in order. Each takes the Avatar props. */
  items: AvatarProps[];
  /** Names the group for assistive tech. Default "People". */
  label?: string;
  /** Shows at most this many faces, then a "+N" count for the rest. */
  max?: number;
  /** One size for every face, overriding each item's own. Default each item's size, or `md`. */
  size?: AvatarSize | AvatarLegacySize;
  /** Later faces overlap earlier ones. Default true; set false to stack the first face on top. */
  lastOnTop?: boolean;
};

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T | null }).current = value;
}

/** Overlapping portraits, each overlapping the one before by a fifth of its diameter (8px at md). Each
 * portrait is keyboard reachable; its accessible name is present at rest. */
export function AvatarGroup({ items, label = 'People', max, size: sizeProp, lastOnTop = true, className, style, ref, onMouseLeave, ...props }: AvatarGroupProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [entering, setEntering] = useState(false);
  const [last, setLast] = useState(0);
  const [tip, setTip] = useState({ x: 0, width: 0 });
  const root = useRef<HTMLDivElement | null>(null);
  const text = useRef<HTMLSpanElement>(null);
  const setRoot = useCallback((node: HTMLDivElement | null) => { root.current = node; assignRef(ref, node); }, [ref]);

  const shown = max !== undefined && max >= 0 && max < items.length ? items.slice(0, max) : items;
  const hidden = items.slice(shown.length);
  const members: GroupMember[] = shown.map((item, index) => {
    const name = item.name ?? 'Profile avatar';
    return { key: `${name}-${index}`, label: name, tip: name, size: normalizeAvatarSize(sizeProp ?? item.size), shape: item.shape ?? 'circle', item };
  });
  if (hidden.length) {
    const names = hidden.map(item => item.name).filter(Boolean).join(', ');
    members.push({
      key: 'more', label: names ? `${hidden.length} more: ${names}` : `${hidden.length} more`, tip: `${hidden.length} more`,
      size: normalizeAvatarSize(sizeProp ?? shown[shown.length - 1]?.size ?? items[0]?.size), shape: 'circle', count: hidden.length,
    });
  }

  const active = hovered ?? focused;
  const current = Math.min(active ?? last, Math.max(0, members.length - 1));
  useLayoutEffect(() => {
    if (active !== null) setLast(active);
    const member = root.current?.querySelectorAll<HTMLElement>('[data-avatar-member]')[current];
    if (!member || !text.current) return;
    const update = () => {
      // The text plus the tip's 12px inline padding on each side.
      const width = Math.ceil(text.current!.offsetWidth) + 24;
      setTip({ x: member.offsetLeft + member.offsetWidth / 2 - width / 2, width });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(member);
    observer.observe(text.current);
    return () => observer.disconnect();
  }, [active, current, items, max, sizeProp]);

  return (
    <div
      ref={setRoot}
      role="group"
      aria-label={label}
      {...props}
      {...merge(stylex.props(g.group), className, style)}
      onMouseLeave={event => { setHovered(null); setEntering(true); onMouseLeave?.(event); }}
    >
      {members.map((member, index) => {
        const m = metrics[member.size];
        const radius = radii[member.shape === 'square' ? m.square : 'full'];
        const z = active === index ? members.length + 1 : lastOnTop ? index + 1 : members.length - index;
        return (
          <span
            key={member.key}
            data-avatar-member
            role="img"
            aria-label={member.label}
            tabIndex={0}
            onMouseEnter={() => { setEntering(active === null); setHovered(index); }}
            onFocus={() => { setEntering(active === null); setFocused(index); }}
            onBlur={() => setFocused(null)}
            {...stylex.props(
              g.member, radius, index > 0 && overlapStyles[member.size], g.depth(z),
              g.lift(active === null ? 0 : -4 * Math.pow(.45, Math.abs(index - active)), active === index ? 1.05 : 1),
              entering && g.entering,
              focusStyles.ringVisible,
            )}
          >
            {member.item
              ? <Avatar {...member.item} size={member.size} decorative />
              : <span aria-hidden="true" {...stylex.props(g.count, radius, sizeStyles[member.size], countTextStyles[member.size])}>+{member.count}</span>}
          </span>
        );
      })}
      <span aria-hidden="true" {...stylex.props(g.tip, g.tipPosition(tip.x, tip.width, active !== null))}>
        <span ref={text} {...stylex.props(g.tipText)}>{members[current]?.tip ?? 'Profile avatar'}</span>
      </span>
    </div>
  );
}
