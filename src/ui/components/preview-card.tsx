'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { Link, Popover as AriaPopover, PreviewTrigger } from 'react-aria-components';
import { motion, useSurfaceSpring } from './internal/spring';
import { Avatar, type AvatarProps } from './avatar';
import { Button } from './button';
import { withClassName } from './internal/class-name';
import { focusStyles } from './internal/states';
import { popupPlacement, overlayStyles, type OpenProps, type PlacementProps, type PortalProps } from './internal/overlay';
import { tokens as t } from '../tokens.stylex';

// PreviewCard (DESIGN_SPEC 1.9, 2.2 PreviewCard): a link that shows a content popup on hover or
// focus. Spec 1.9 surface, 256 wide by default (the popover width), padding 16, 6px from the link,
// the anchored entry and the shared exit.
// PeoplePreview: one shared card that follows the pointer across the faces, with a face lift, staged
// rows and the surface springs, on the standard geometry: up to 320 wide, a 48px row (control xl) with
// 32px faces 8 from its edge, and the card as a spec 1.9 content popup (radius lg, padding 16) 8 below
// it, with a Button sm to follow.

const reduce = '@media (prefers-reduced-motion: reduce)';
const coarse = '@media (pointer: coarse)';

const s = stylex.create({
  preview: { padding: t['--os-space-4'] },
  previewLink: {
    color: t['--os-color-fg-link'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    cursor: 'pointer', textUnderlineOffset: 3, textDecoration: 'underline', borderRadius: t['--os-radius-xs'],
    outlineStyle: 'none',
  },
});

export type PreviewCardProps = OpenProps & PortalProps & PlacementProps & {
  /** Where the link goes. The card previews it. */
  href: string;
  /** The link text. */
  trigger: ReactNode;
  /** The card content. Keep it non-interactive: the card opens on hover and cannot take focus. */
  children: ReactNode;
  /** Milliseconds of hover before the card opens. Focus opens it at once. */
  delay?: number;
  /** Milliseconds before it closes after the pointer leaves. */
  closeDelay?: number;
  /** Never show the card; the link still works. */
  isDisabled?: boolean;
  /** Card width in px or any CSS length. Default 256, the spec 1.9 popover width. */
  width?: number | string;
  /** Shift along the link's edge, in px. */
  crossOffset?: number;
  /** Classes for the card surface. */
  className?: string;
  /** Inline styles for the card surface. */
  style?: CSSProperties;
  /** The card surface element. */
  ref?: Ref<HTMLDivElement>;
};

export function PreviewCard({
  href, trigger, children, placement = 'top', offset = 6, crossOffset, width = 256, portalContainer, className, style, ref, ...props
}: PreviewCardProps) {
  return <PreviewTrigger {...props}>
    <Link href={href} className={({ isFocusVisible }) => stylex.props(s.previewLink, isFocusVisible && focusStyles.ring).className ?? ''}>{trigger}</Link>
    <AriaPopover ref={ref} placement={placement} offset={offset} crossOffset={crossOffset} UNSTABLE_portalContainer={portalContainer}
      style={{ width, ...style }}
      className={({ isExiting, placement: side }) => withClassName(stylex.props(
        overlayStyles.surface, overlayStyles.popup, s.preview, overlayStyles.popupMotion, popupPlacement(side), isExiting && overlayStyles.exit,
      ), className)}>
      {children}
    </AriaPopover>
  </PreviewTrigger>;
}

const profileFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const profileRow = stylex.keyframes({ from: { opacity: 0, translate: '0 4px' }, to: { opacity: 1, translate: '0 0' } });
// The root reserves the row (48) and the card 8 below it (up to 256 tall); closed, the stack drops
// so the row sits in the middle of that space: (312 - 48) / 2.
const profileStyles = stylex.create({
  root: { position: 'relative', width: '100%', maxWidth: 320, height: 312, fontFamily: t['--os-font-family'], color: t['--os-color-fg-base'], textAlign: 'start' },
  stack: {
    position: 'absolute', inset: 0, translate: '0 132px', transitionProperty: 'translate',
    transitionDuration: { default: t['--os-motion-layout'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
    transitionDelay: t['--os-motion-hover'],
  },
  open: { translate: '0 0', transitionDelay: '0ms' },
  /** A 48px row (control xl): the faces sit 8 from its edge, so its radius is concentric with them (16 + 8). */
  box: {
    boxSizing: 'border-box', height: t['--os-size-xl'], paddingInlineStart: t['--os-space-2'], paddingInlineEnd: t['--os-space-4'],
    display: 'flex', alignItems: 'center', gap: t['--os-space-3'], backgroundColor: t['--os-color-bg-surface'], borderRadius: t['--os-radius-xl'],
  },
  faces: { display: 'flex', flexShrink: 0 },
  face: {
    position: 'relative', display: 'block', width: t['--os-size-sm'], height: t['--os-size-sm'], padding: 0, borderRadius: t['--os-radius-full'], backgroundColor: 'transparent', color: 'inherit',
    cursor: 'pointer', WebkitTapHighlightColor: 'transparent', transitionProperty: 'translate, scale',
    transitionDuration: { default: t['--os-motion-popup'], [reduce]: '0ms' }, transitionTimingFunction: t['--os-ease-settle'],
    outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineColor: t['--os-color-focus-ring'], outlineOffset: 2,
    // A 44px touch target on coarse pointers, grown on the block axis only (the faces overlap inline).
    '::after': {
      content: '""', position: 'absolute', insetInlineStart: 0, insetBlockStart: '50%', width: '100%',
      height: { default: '100%', [coarse]: 'max(100%, 44px)' }, transform: 'translateY(-50%)',
    },
  },
  overlap: { marginInlineStart: `calc(-1 * ${t['--os-space-2']})` },
  faceActive: { translate: { default: '0 -2px', [reduce]: '0 0' }, scale: { default: '1.08', [reduce]: '1' } },
  depth: (zIndex: number) => ({ zIndex }),
  say: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  summary: {
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  sub: { fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-muted'] },
  /** Placement of the card, which wears `overlayStyles.surface` (spec 1.9: radius lg, padding 16): 8 below the row. */
  card: {
    position: 'absolute', top: `calc(${t['--os-size-xl']} + ${t['--os-space-2']})`, left: 0, width: '100%', padding: t['--os-space-4'],
    transformOrigin: 'var(--profile-origin, 24px) 0',
    animationName: profileFade, animationDuration: { default: t['--os-motion-hover'], [reduce]: t['--os-motion-press'] },
    animationTimingFunction: t['--os-ease-settle'], outlineStyle: 'none',
  },
  profileMotion: (y: number, scale: number) => ({ transform: `translateY(${y}px) scale(${scale})` }),
  /** The shared exit (spec 1.9): fade and settle to .98 over 160ms, no translate. */
  cardExit: {
    opacity: 0, transform: { default: 'scale(.98)', [reduce]: 'none' }, pointerEvents: 'none', animationName: 'none',
    transitionProperty: 'opacity, transform', transitionDuration: { default: t['--os-motion-hover'], [reduce]: t['--os-motion-press'] },
    transitionTimingFunction: t['--os-ease-exit'],
  },
  row: (order: number) => ({
    animationName: { default: profileRow, [reduce]: 'none' }, animationDuration: t['--os-motion-popup'], animationDelay: `${40 + order * 30}ms`,
    animationTimingFunction: t['--os-ease-settle'], animationFillMode: 'both',
  }),
  origin: (x: number) => ({ '--profile-origin': `${x}px` }),
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'start' },
  identity: { display: 'flex', flexDirection: 'column', marginTop: t['--os-space-3'] },
  name: { fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'] },
  bio: {
    marginBlockStart: t['--os-space-3'], marginBlockEnd: 0, marginInline: 0,
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-muted'],
  },
  counts: { display: 'flex', gap: t['--os-space-4'], marginTop: t['--os-space-3'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'], color: t['--os-color-fg-muted'] },
  number: { color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums' },
  mutual: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], marginTop: t['--os-space-3'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0, color: t['--os-color-fg-muted'] },
  mutualFaces: { display: 'flex', paddingInlineStart: t['--os-space-0-5'] },
  mini: { display: 'flex' },
  miniOverlap: { marginInlineStart: `calc(-1 * ${t['--os-space-1-5']})` },
});

export type PreviewProfile = { id: string; name: string; handle: string; bio: string; avatar?: Omit<AvatarProps, 'name' | 'size'>; followingCount: number; followersCount: number; mutualLabel?: string; mutualAvatars?: AvatarProps[] };
export type PeoplePreviewProps = {
  profiles: PreviewProfile[];
  summary: string;
  caption?: string;
  delay?: number;
  followedIds?: readonly string[];
  defaultFollowedIds?: readonly string[];
  onFollowChange?: (ids: string[]) => void;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
};

/** A shared preview surface. Moving to a neighboring portrait updates content
 * without restarting the hover delay, while focus and touch work immediately. */
export function PeoplePreview({ profiles, summary, caption = 'liked your post', delay = 400, followedIds, defaultFollowedIds = [], onFollowChange, className, style, ref }: PeoplePreviewProps) {
  const [active, setActive] = useState<number | null>(null);
  const [present, setPresent] = useState<number | null>(null);
  const [followed, setFollowed] = useState([...defaultFollowedIds]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const pending = useRef<number | null>(null);
  const clear = () => { if (timer.current) clearTimeout(timer.current); timer.current = null; };
  const reveal = (index: number, immediate = false) => { clear(); pending.current = index; if (immediate || active !== null) setActive(index); else timer.current = setTimeout(() => setActive(index), delay); };
  const close = () => { clear(); pending.current = null; setActive(null); };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    if (active === null) return;
    const dismiss = (event: PointerEvent) => { if (root.current && !root.current.contains(event.target as Node)) { if (timer.current) clearTimeout(timer.current); setActive(null); } };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [active]);
  useEffect(() => {
    if (active !== null) { setPresent(active); return; }
    if (present === null) return;
    const timeout = setTimeout(() => setPresent(null), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : motion.hover);
    return () => clearTimeout(timeout);
  }, [active, present]);
  const profile = present === null ? null : profiles[present];
  const selected = followedIds ?? followed;
  const setRoot = (node: HTMLDivElement | null) => {
    root.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };
  return <div ref={setRoot} style={style} className={withClassName(stylex.props(profileStyles.root), className)}
    onPointerEnter={clear}
    onPointerLeave={event => { if (event.pointerType === 'touch') return; clear(); timer.current = setTimeout(() => setActive(null), motion.hover); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { clear(); timer.current = setTimeout(() => setActive(null), motion.hover); } }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); close(); } }}>
    <div {...stylex.props(profileStyles.stack, active !== null && profileStyles.open)}>
      <div {...stylex.props(profileStyles.box)}>
        <div {...stylex.props(profileStyles.faces)}>
          {profiles.map((person, index) => <button key={person.id} type="button" aria-label={`${person.name}, show profile`} aria-expanded={active === index}
            onPointerEnter={event => { if (event.pointerType !== 'touch') reveal(index); }} onFocus={() => reveal(index, true)} onClick={() => reveal(index, true)}
            {...stylex.props(profileStyles.face, index > 0 && profileStyles.overlap, active === index && profileStyles.faceActive, profileStyles.depth(active === index ? profiles.length + 1 : profiles.length - index))}>
            <Avatar {...person.avatar} name={person.name} size="sm" decorative />
          </button>)}
        </div>
        <div {...stylex.props(profileStyles.say)}><b {...stylex.props(profileStyles.summary)}>{summary}</b><span {...stylex.props(profileStyles.sub)}>{caption}</span></div>
      </div>
      {profile && <ProfileMotionSurface open={active !== null} name={profile.name} origin={24 + (present ?? 0) * 24}><div key={profile.id}>
        <div {...stylex.props(profileStyles.head, profileStyles.row(0))}>
          <Avatar {...profile.avatar} name={profile.name} size="lg" decorative />
          <Button size="sm" appearance={selected.includes(profile.id) ? 'secondary' : 'primary'} aria-pressed={selected.includes(profile.id)} onClick={() => {
            const ids = selected.includes(profile.id) ? selected.filter(id => id !== profile.id) : [...selected, profile.id];
            if (followedIds === undefined) setFollowed([...ids]);
            onFollowChange?.([...ids]);
          }}>{selected.includes(profile.id) ? 'Following' : 'Follow'}</Button>
        </div>
        <div {...stylex.props(profileStyles.identity, profileStyles.row(1))}><b {...stylex.props(profileStyles.name)}>{profile.name}</b><span {...stylex.props(profileStyles.sub)}>{profile.handle}</span></div>
        <p {...stylex.props(profileStyles.bio, profileStyles.row(2))}>{profile.bio}</p>
        <div {...stylex.props(profileStyles.counts, profileStyles.row(3))}>
          <span><b {...stylex.props(profileStyles.number)}>{profile.followingCount.toLocaleString()}</b> Following</span>
          <span><b {...stylex.props(profileStyles.number)}>{(profile.followersCount + (selected.includes(profile.id) ? 1 : 0)).toLocaleString()}</b> Followers</span>
        </div>
        {profile.mutualLabel && <div {...stylex.props(profileStyles.mutual, profileStyles.row(4))}>
          {profile.mutualAvatars?.length && <span {...stylex.props(profileStyles.mutualFaces)}>{profile.mutualAvatars.map((avatar, index) => <span key={index} {...stylex.props(profileStyles.mini, index > 0 && profileStyles.miniOverlap)}><Avatar {...avatar} size="xs" decorative /></span>)}</span>}
          {profile.mutualLabel}
        </div>}
      </div></ProfileMotionSurface>}
    </div>
  </div>;
}

function ProfileMotionSurface({ open, name, origin, children }: { open: boolean; name: string; origin: number; children: ReactNode }) {
  const y = useSurfaceSpring(open ? 0 : -4, -4), scale = useSurfaceSpring(open ? 1 : .96, .96);
  return <div role="group" aria-label={`${name}'s profile`} aria-hidden={!open || undefined} inert={!open || undefined}
    {...stylex.props(overlayStyles.surface, profileStyles.card, profileStyles.origin(origin), profileStyles.profileMotion(y, scale), !open && profileStyles.cardExit)}>{children}</div>;
}
