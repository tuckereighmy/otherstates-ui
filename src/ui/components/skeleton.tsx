import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ComponentPropsWithRef, ReactNode } from 'react';
import { tokens as t } from '../tokens.stylex';

// Skeleton (DESIGN_SPEC 2.2 Skeleton, 1.10 skeleton breathe, 1.16 no fixed widths).
// A placeholder is fluid: 100% wide and one 20px text line tall unless `width` and `height` say
// otherwise. A text line is a 14px bar centered in the 20px line box, so stacked lines keep the gaps of
// real text. The fill is the track color (bg-muted) breathing toward the surface over 1400ms; under
// reduced motion it holds still. SkeletonReveal stages its bars on the motion, radius and spacing tokens:
// each bar grows into the content's box, then the content rises 8px as it appears.

const reduce = '@media (prefers-reduced-motion: reduce)';
const fill = t['--os-color-bg-muted'];
const fillSoft = `color-mix(in srgb, ${t['--os-color-bg-muted']} 60%, ${t['--os-color-bg-surface']})`;
/** Spec 1.10 "skeleton breathe": the one duration with no motion token, used by Skeleton alone. */
const breatheDuration = '1400ms';

const breathe = stylex.keyframes({
  '0%, 100%': { backgroundColor: fill },
  '50%': { backgroundColor: fillSoft },
});

const s = stylex.create({
  base: {
    display: 'block',
    maxWidth: '100%',
    backgroundColor: fill,
    animationName: { default: breathe, [reduce]: 'none' },
    animationDuration: breatheDuration,
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
  },
  full: { width: '100%' },
  circle: { flexShrink: 0 },
  // A text line: a 20px row holding a 14px bar.
  row: { display: 'flex', alignItems: 'center', width: '100%', maxWidth: '100%', height: t['--os-line-height-md'] },
  bar: { width: '100%', height: 14 },
  lines: { display: 'grid', width: '100%', maxWidth: '100%' },
  lastLine: { width: '60%' },
  ratio: (aspectRatio: string) => ({ aspectRatio }),
  width: (width: number | string) => ({ width }),
  height: (height: number | string) => ({ height }),
  radius: (borderRadius: number | string) => ({ borderRadius }),
});

const radii = stylex.create({
  none: { borderRadius: t['--os-radius-none'] },
  xs: { borderRadius: t['--os-radius-xs'] },
  sm: { borderRadius: t['--os-radius-sm'] },
  md: { borderRadius: t['--os-radius-md'] },
  lg: { borderRadius: t['--os-radius-lg'] },
  xl: { borderRadius: t['--os-radius-xl'] },
  full: { borderRadius: t['--os-radius-full'] },
});

const aspectRatios = ['1:1', '3:2', '2:3', '4:3', '3:4', '5:4', '4:5', '16:9', '9:16'] as const;
export type SkeletonRatio = typeof aspectRatios[number];
export type SkeletonShape = 'rectangle' | 'circle' | 'image';
export type SkeletonRadius = keyof typeof radii;
/** Circle diameters, matching Avatar: 24, 32, 40, 48, 64, 80. */
export type SkeletonCircleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
/** @deprecated Rectangle presets from before `width` and `height`. They set a height (72, 34, 14, 48, 48); the width is 100%, and the two button presets are pills. */
export type SkeletonLegacySize = 'display' | 'heading' | 'body' | 'fullwidthButton' | 'button';

const circleDiameters: Record<SkeletonCircleSize, number> = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, '2xl': 80 };
const legacyHeights: Record<SkeletonLegacySize, number> = { display: 72, heading: 34, body: 14, fullwidthButton: 48, button: 48 };

export type SkeletonProps = Omit<ComponentPropsWithRef<'span'>, 'children'> & {
  /** `rectangle` (default), `circle` or `image`. */
  shape?: SkeletonShape;
  /** Width in px or any CSS length. Default 100%; a circle defaults to its `size`. */
  width?: number | string;
  /** Height in px or any CSS length. Default one 20px text line, drawn as a 14px bar. */
  height?: number | string;
  /** A radius token or px. Default `sm`; circles are `full`. */
  radius?: SkeletonRadius | number;
  /** Circle diameter, or a deprecated rectangle preset. */
  size?: SkeletonCircleSize | SkeletonLegacySize;
  /** Aspect ratio of an `image` placeholder. Default `16:9`. */
  ratio?: SkeletonRatio;
  /** Renders this many text lines; the last of several is 60% wide. */
  lines?: number;
};

function merge(sx: { className?: string; style?: CSSProperties }, className?: string, style?: CSSProperties) {
  return {
    className: [sx.className, className].filter(Boolean).join(' ') || undefined,
    style: sx.style || style ? { ...sx.style, ...style } : undefined,
  };
}

const radiusStyle = (radius: SkeletonRadius | number | undefined, fallback: SkeletonRadius) =>
  typeof radius === 'number' ? s.radius(radius) : radii[radius ?? fallback];

export function Skeleton({ shape = 'rectangle', width, height, radius, size, ratio, lines, className, style, ...props }: SkeletonProps) {
  if (lines !== undefined && lines > 0) {
    const count = Math.max(1, Math.round(lines));
    return (
      <span aria-hidden="true" {...props} {...merge(stylex.props(s.lines, width !== undefined && s.width(width)), className, style)}>
        {Array.from({ length: count }, (_, index) => (
          <span key={index} {...stylex.props(s.row, count > 1 && index === count - 1 && s.lastLine)}>
            <span {...stylex.props(s.base, s.bar, radiusStyle(radius, 'sm'))} />
          </span>
        ))}
      </span>
    );
  }

  if (shape === 'circle') {
    const diameter = circleDiameters[(size ?? 'md') as SkeletonCircleSize] ?? circleDiameters.md;
    return (
      <span aria-hidden="true" {...props} {...merge(stylex.props(s.base, s.circle, s.width(width ?? diameter), s.height(height ?? width ?? diameter), radiusStyle(radius, 'full')), className, style)} />
    );
  }

  if (shape === 'image') {
    const value = ratio ?? '16:9';
    return (
      <span aria-hidden="true" {...props} {...merge(stylex.props(
        s.base, width === undefined ? s.full : s.width(width), height === undefined ? s.ratio(value.replace(':', ' / ')) : s.height(height),
        radiusStyle(radius, value === '4:5' || value === '5:4' ? 'md' : 'sm'),
      ), className, style)} />
    );
  }

  const legacy = size !== undefined && size in legacyHeights ? size as SkeletonLegacySize : undefined;
  const blockHeight = height ?? (legacy ? legacyHeights[legacy] : undefined);
  const pill = legacy === 'button' || legacy === 'fullwidthButton';

  if (blockHeight === undefined) {
    return (
      <span aria-hidden="true" {...props} {...merge(stylex.props(s.row, width !== undefined && s.width(width)), className, style)}>
        <span {...stylex.props(s.base, s.bar, radiusStyle(radius, 'sm'))} />
      </span>
    );
  }

  return (
    <span aria-hidden="true" {...props} {...merge(stylex.props(
      s.base, width === undefined ? s.full : s.width(width), s.height(blockHeight),
      radiusStyle(radius, pill ? 'full' : 'sm'),
    ), className, style)} />
  );
}

const revealStyles = stylex.create({
  root: { position: 'relative', width: 'fit-content', maxWidth: '100%' },
  full: { width: '100%' },
  real: {
    opacity: 0,
    translate: { default: `0 ${t['--os-space-2']}`, [reduce]: '0 0' },
    transitionProperty: 'opacity, translate',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-exit'],
  },
  realReady: (delay: number) => ({
    opacity: 1,
    translate: '0 0',
    transitionProperty: { default: 'opacity, translate', [reduce]: 'opacity' },
    transitionDuration: { default: t['--os-motion-slow'], [reduce]: t['--os-motion-press'] },
    transitionTimingFunction: t['--os-ease-settle'],
    transitionDelay: { default: `${delay + 60}ms`, [reduce]: '0ms' },
  }),
  bar: {
    position: 'absolute',
    left: 0,
    pointerEvents: 'none',
    backgroundColor: fill,
    animationName: { default: breathe, [reduce]: 'none' },
    animationDuration: breatheDuration,
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    transitionProperty: 'opacity',
    transitionDuration: { default: t['--os-motion-hover'], [reduce]: '0ms' },
    transitionTimingFunction: t['--os-ease-settle'],
  },
  geometry: (width: number | string, height: number | string, top: number) => ({ width, height, top }),
  radiusDefault: { borderRadius: t['--os-radius-sm'] },
  radius: (borderRadius: number | string) => ({ borderRadius }),
  // Each bar grows into the real content's box and fades out; under reduced motion it only fades.
  barReady: (delay: number) => ({
    width: '100%',
    height: '100%',
    top: 0,
    opacity: 0,
    transitionProperty: { default: 'top, width, height, opacity, border-radius', [reduce]: 'opacity' },
    transitionDuration: { default: t['--os-motion-slow'], [reduce]: t['--os-motion-press'] },
    transitionTimingFunction: t['--os-ease-settle'],
    transitionDelay: { default: `${delay}ms`, [reduce]: '0ms' },
  }),
});

export type SkeletonRevealBlock = { width: number | string; height: number | string; top?: number; radius?: number | string };

export type SkeletonRevealProps = Omit<ComponentPropsWithRef<'div'>, 'children'> & {
  /** Set to true when the real content has loaded. The placeholders grow into it and fade. */
  ready: boolean;
  /** The real content. It keeps its layout while hidden, so nothing shifts when it appears. */
  children: ReactNode;
  /** Placeholder bars over the content's box: size, offset from the top and radius. Default one 14px line. */
  blocks?: SkeletonRevealBlock[];
  /** Position in a staged reveal; each step waits `stagger` ms. Default 0. */
  order?: number;
  /** Delay between reveal steps in ms. Default 160. */
  stagger?: number;
  /** Stretches the wrapper to its container instead of fitting the content. */
  fullWidth?: boolean;
};

/** Retains the final content's geometry while each placeholder expands into it.
 * The consumer controls readiness; this primitive never invents loading delays. */
export function SkeletonReveal({
  ready, children, blocks = [{ width: '100%', height: 14, top: 3 }], order = 0, stagger = 160, fullWidth = false,
  className, style, ...props
}: SkeletonRevealProps) {
  const delay = Math.max(0, order * stagger);
  return (
    <div aria-busy={!ready} {...props} {...merge(stylex.props(revealStyles.root, fullWidth && revealStyles.full), className, style)}>
      <div aria-hidden={!ready || undefined} inert={!ready || undefined} {...stylex.props(revealStyles.real, ready && revealStyles.realReady(delay))}>{children}</div>
      {blocks.map((block, index) => (
        <span
          key={index}
          aria-hidden="true"
          {...stylex.props(
            revealStyles.bar,
            revealStyles.geometry(block.width, block.height, block.top ?? 0),
            block.radius === undefined ? revealStyles.radiusDefault : revealStyles.radius(block.radius),
            ready && revealStyles.barReady(delay),
          )}
        />
      ))}
    </div>
  );
}
