import type { ReactNode } from 'react';

// Every glyph sits on a 24px grid with about 2px of optical padding and is drawn
// from lines, arcs, circles and rounded rectangles. Stroke, caps and joins are
// set once on the <svg>, so a glyph only ever describes its geometry. Solid dots
// (more, drag-handle, list, tag) are the one exception: they carry their own fill,
// and still take the stroke, so they thicken with strokeWidth like every line does.
// The three dots of "more" stand alone, so they are drawn a touch larger than dots
// that sit in a group or beside a line. Diagonals run at 45 degrees wherever the
// glyph allows it (chevrons, arrowheads, ticks, crosses).
// Glyphs that answer to two names (an older name and the name the spec uses) are drawn once here.
const checkCircle = <><circle cx="12" cy="12" r="9" /><path d="m8 12.25 2.5 2.5 5.5-5.5" /></>;
const xCircle = <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>;
const alertCircle = <><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></>;
const alertTriangle = <><path d="M10.27 4.69A2 2 0 0 1 13.73 4.69L20.98 17.25A2 2 0 0 1 19.25 20.25L4.75 20.25A2 2 0 0 1 3.02 17.25Z" /><path d="M12 9.25v4M12 16.5h.01" /></>;
const helpCircle = <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.75a2.5 2.5 0 1 1 2.5 2.5v1.5M12 16.75h.01" /></>;
const upDown = <path d="M8 19V5M4.5 8.5 8 5l3.5 3.5M16 5v14M12.5 15.5 16 19l3.5-3.5" />;
const gripVertical = <><circle cx="9" cy="6" r=".5" fill="currentColor" /><circle cx="15" cy="6" r=".5" fill="currentColor" /><circle cx="9" cy="12" r=".5" fill="currentColor" /><circle cx="15" cy="12" r=".5" fill="currentColor" /><circle cx="9" cy="18" r=".5" fill="currentColor" /><circle cx="15" cy="18" r=".5" fill="currentColor" /></>;
const pencil = <><path d="M4 20L5 16L16.15 4.85A1.2 1.2 0 0 1 17.85 4.85L19.15 6.15A1.2 1.2 0 0 1 19.15 7.85L8 19Z" /><path d="m14.5 6.5 3 3" /></>;

const paths = {
  // The original eleven. Their geometry is frozen: other components rely on it.
  chevron: <path d="m6 9 6 6 6-6" />,
  arrow: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></>,
  moon: <path d="M20 15a8 8 0 0 1-11-11A8.5 8.5 0 1 0 20 15Z" />,
  user: <><circle cx="12" cy="8" r="3" /><path d="M5 20v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></>,
  button: <><rect x="3" y="7" width="18" height="10" rx="5" /><path d="M9 12h6" /></>,
  input: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 9v6m4-3h6" /></>,
  dropdown: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 12h4m3-1 2 2 2-2" /></>,

  // Arrows and chevrons
  'arrow-left': <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
  'arrow-right': <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  'arrow-up': <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>,
  'arrow-down': <><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>,
  'chevron-left': <path d="m15 6-6 6 6 6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'chevron-up': <path d="m6 15 6-6 6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevrons-up-down': <><path d="m8 9 4-4 4 4" /><path d="m8 15 4 4 4-4" /></>,
  'chevrons-left': <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" />,
  'chevrons-right': <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />,
  'external-link': <><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /><path d="M14 4h6v6M20 4l-9 9" /></>,
  maximize: <path d="M14 4h6v6M20 4l-6 6M10 20H4v-6M4 20l6-6" />,
  minimize: <path d="M20 10h-6V4M14 10l6-6M4 14h6v6M10 14l-6 6" />,
  refresh: <><path d="M3.5 12a8.5 8.5 0 0 1 16-4M19.5 3.5V8H15" /><path d="M20.5 12a8.5 8.5 0 0 1-16 4M4.5 20.5V16H9" /></>,
  undo: <><path d="M8 5 4 9l4 4" /><path d="M4 9h11a5 5 0 0 1 0 10h-4" /></>,
  redo: <><path d="m16 5 4 4-4 4" /><path d="M20 9H9a5 5 0 0 0 0 10h4" /></>,
  'log-out': <><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" /><path d="M10 12h10M16 8l4 4-4 4" /></>,

  // Actions
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m16 16 4.5 4.5" /></>,
  filter: <path d="M4 5h16l-6 7.5V19l-4-2v-4.5L4 5Z" />,
  sort: upDown,
  'arrow-up-down': upDown,
  'more-horizontal': <><circle cx="5" cy="12" r=".75" fill="currentColor" /><circle cx="12" cy="12" r=".75" fill="currentColor" /><circle cx="19" cy="12" r=".75" fill="currentColor" /></>,
  'more-vertical': <><circle cx="12" cy="5" r=".75" fill="currentColor" /><circle cx="12" cy="12" r=".75" fill="currentColor" /><circle cx="12" cy="19" r=".75" fill="currentColor" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  'drag-handle': gripVertical,
  'grip-vertical': gripVertical,
  'grip-horizontal': <><circle cx="6" cy="9" r=".5" fill="currentColor" /><circle cx="12" cy="9" r=".5" fill="currentColor" /><circle cx="18" cy="9" r=".5" fill="currentColor" /><circle cx="6" cy="15" r=".5" fill="currentColor" /><circle cx="12" cy="15" r=".5" fill="currentColor" /><circle cx="18" cy="15" r=".5" fill="currentColor" /></>,
  link: <><path d="M11.68 6.31L13.24 4.75A4.25 4.25 0 0 1 19.25 10.76L16.7 13.31A4.25 4.25 0 0 1 10.3 12.86" /><path d="M12.32 17.69L10.76 19.25A4.25 4.25 0 0 1 4.75 13.24L7.3 10.69A4.25 4.25 0 0 1 13.7 11.14" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M6 15a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2" /></>,
  clipboard: <><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /></>,
  download: <><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
  upload: <><path d="M12 15V4M7.5 8.5 12 4l4.5 4.5" /><path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" /></>,
  share: <><circle cx="18" cy="5.5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="18.5" r="2.5" /><path d="M8.2 10.81L15.8 6.69M8.2 13.19L15.8 17.31" /></>,
  trash: <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /><path d="M5.5 7L6.36 18.15A2 2 0 0 0 8.35 20L15.65 20A2 2 0 0 0 17.64 18.15L18.5 7" /><path d="M10 11v5M14 11v5" /></>,
  edit: pencil,
  pencil,
  send: <><path d="M4 5 20.5 12 4 19l3-7-3-7Z" /><path d="M7 12h6.5" /></>,
  paperclip: <path d="M12.34 4.48L4.56 12.26A4.25 4.25 0 0 0 10.57 18.27L19.98 8.87A2.4 2.4 0 0 0 16.58 5.47L9.09 12.97" />,

  // Status
  'check-circle': checkCircle,
  'circle-check': checkCircle,
  'x-circle': xCircle,
  'circle-x': xCircle,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  'alert-circle': alertCircle,
  'circle-alert': alertCircle,
  'alert-triangle': alertTriangle,
  'triangle-alert': alertTriangle,
  'help-circle': helpCircle,
  'circle-help': helpCircle,
  loader: <path d="M21 12a9 9 0 1 1-9-9" />,

  // Objects
  eye: <><path d="M2.5 12A10.52 10.52 0 0 1 21.5 12A10.52 10.52 0 0 1 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  'eye-off': <><path d="M14.34 17.74A10.52 10.52 0 0 1 2.5 12A10.52 10.52 0 0 1 5.15 8.54" /><path d="M9.66 6.26A10.52 10.52 0 0 1 21.5 12A10.52 10.52 0 0 1 18.85 15.46" /><path d="M12.17 15A3 3 0 0 1 9 11.83" /><path d="M4 4 20 20" /></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  unlock: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.46-2" /></>,
  settings: <><path d="M10.15 5.56L10.42 3.04A9.1 9.1 0 0 1 13.58 3.04L13.85 5.56A6.7 6.7 0 0 1 16.65 7.18L18.97 6.15A9.1 9.1 0 0 1 20.55 8.89L18.5 10.38A6.7 6.7 0 0 1 18.5 13.62L20.55 15.11A9.1 9.1 0 0 1 18.97 17.85L16.65 16.82A6.7 6.7 0 0 1 13.85 18.44L13.58 20.96A9.1 9.1 0 0 1 10.42 20.96L10.15 18.44A6.7 6.7 0 0 1 7.35 16.82L5.03 17.85A9.1 9.1 0 0 1 3.45 15.11L5.5 13.62A6.7 6.7 0 0 1 5.5 10.38L3.45 8.89A9.1 9.1 0 0 1 5.03 6.15L7.35 7.18A6.7 6.7 0 0 1 10.15 5.56Z" /><circle cx="12" cy="12" r="3" /></>,
  sliders: <><circle cx="15" cy="7" r="2.5" /><circle cx="9" cy="17" r="2.5" /><path d="M4 7h8.5M17.5 7H20M4 17h2.5M11.5 17H20" /></>,
  bell: <><path d="M6 9a6 6 0 0 1 12 0c0 4 1 6 2 8H4c1-2 2-4 2-8Z" /><path d="M10 20a2.3 2.3 0 0 0 4 0" /></>,
  calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 10h16M8 3v4M16 3v4" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.5Z" /><path d="M9.5 20v-6h5v6" /></>,
  inbox: <><path d="M3.5 13L6.01 6.3A2 2 0 0 1 7.89 5L16.11 5A2 2 0 0 1 17.99 6.3L20.5 13L20.5 17A2 2 0 0 1 18.5 19L5.5 19A2 2 0 0 1 3.5 17Z" /><path d="M3.5 13H8l1.5 2.5h5L16 13h4.5" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7.5 9 6 9-6" /></>,
  message: <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4V6Z" />,
  image: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 16-5-5-9 9" /></>,
  file: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v4a1 1 0 0 0 1 1h4" /></>,
  folder: <path d="M3 7a2 2 0 0 1 2-2h4.5l2 2.5H19a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  star: <path d="M12 3.41L14.59 9.35L21.04 9.97L16.18 14.27L17.58 20.59L12 17.31L6.42 20.59L7.82 14.27L2.96 9.97L9.41 9.35Z" />,
  heart: <path d="M12 20.25L4.28 11.99A4.75 4.75 0 1 1 12 6.63A4.75 4.75 0 1 1 19.72 11.99Z" />,
  // A raised thumb on its cuff: the cuff a 3-wide rounded bar, the hand one path with a rounded tip.
  'thumbs-up': <><path d="M7.5 10.5v9H5a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 5 10.5Z" /><path d="M7.5 10.5L11.25 4a1.75 1.75 0 0 1 3.25 1V9h4.25a1.75 1.75 0 0 1 1.72 2.07l-1.3 6.9a1.9 1.9 0 0 1-1.87 1.53H7.5" /></>,
  'thumbs-down': <g transform="matrix(1 0 0 -1 0 24)"><path d="M7.5 10.5v9H5a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 5 10.5Z" /><path d="M7.5 10.5L11.25 4a1.75 1.75 0 0 1 3.25 1V9h4.25a1.75 1.75 0 0 1 1.72 2.07l-1.3 6.9a1.9 1.9 0 0 1-1.87 1.53H7.5" /></g>,
  bookmark: <path d="M6 6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14.5l-6-4-6 4V6Z" />,
  tag: <><path d="M3.5 5A1.5 1.5 0 0 1 5 3.5L11.09 3.5A1 1 0 0 1 11.79 3.79L19.92 11.92A2 2 0 0 1 19.92 14.74L14.74 19.92A2 2 0 0 1 11.92 19.92L3.79 11.79A1 1 0 0 1 3.5 11.09Z" /><circle cx="8" cy="8" r=".5" fill="currentColor" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><path d="M15.8 5.1a3 3 0 0 1 0 5.8M17.5 14.03a4 4 0 0 1 3.5 3.97v2" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M12 16v4M8 20h8" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a12.1 12.1 0 0 1 0 18 12.1 12.1 0 0 1 0-18Z" /></>,
  'credit-card': <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  zap: <path d="M13.5 3 5.5 13.5h6l-1 7.5 8-10.5h-6l1-7.5Z" />,
  sparkle: <><path d="M11 5Q13.2 10.8 19 13Q13.2 15.2 11 21Q8.8 15.2 3 13Q8.8 10.8 11 5Z" /><path d="M19 3v4M17 5h4" /></>,

  // Keyboard and code
  command: <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z" />,
  keyboard: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7.5 10h.01M10.5 10h.01M13.5 10h.01M16.5 10h.01M8.5 14h7" /></>,
  code: <path d="m7 8-4 4 4 4M17 8l4 4-4 4M14 5l-4 14" />,
  terminal: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="m7 9 3 3-3 3M13 15h4" /></>,
  'at-sign': <><circle cx="12" cy="12" r="3.5" /><path d="M15.5 8.5V13a2.5 2.5 0 0 0 5 0v-1a8.5 8.5 0 1 0-4 7.2" /></>,
  hash: <path d="M5 9h15M4 15h15M10 4 8 20M16 4l-2 16" />,

  // Media
  play: <path d="M8 5v14l11-7L8 5Z" />,
  pause: <><rect x="6.5" y="5" width="4" height="14" rx="1" /><rect x="13.5" y="5" width="4" height="14" rx="1" /></>,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4" /></>,
  volume: <><path d="M3.5 9.5H7l4.5-4v13l-4.5-4H3.5v-5Z" /><path d="M15.2 8.8a4.5 4.5 0 0 1 0 6.4M18 6a8.5 8.5 0 0 1 0 12" /></>,

  // Text and layout
  bold: <path d="M7 5h5.5a3.5 3.5 0 0 1 0 7H7V5ZM7 12h6.5a3.5 3.5 0 0 1 0 7H7v-7Z" />,
  italic: <path d="M10 5h7M7 19h7M13.5 5l-3 14" />,
  underline: <path d="M7 4v7a5 5 0 0 0 10 0V4M5 20h14" />,
  strikethrough: <><path d="M15.05 6.65A3.6 3.5 0 1 0 12 12A3.6 3.5 0 1 1 8.95 17.35" /><path d="M4 12h16" /></>,
  'align-left': <path d="M4 6h16M4 10h10M4 14h16M4 18h10" />,
  'align-center': <path d="M4 6h16M7 10h10M4 14h16M7 18h10" />,
  'align-right': <path d="M4 6h16M10 10h10M4 14h16M10 18h10" />,
  'align-justify': <path d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
  list: <><circle cx="4.5" cy="7" r=".5" fill="currentColor" /><circle cx="4.5" cy="12" r=".5" fill="currentColor" /><circle cx="4.5" cy="17" r=".5" fill="currentColor" /><path d="M9 7h11M9 12h11M9 17h11" /></>,
  'panel-left': <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16" /></>,
  'panel-right': <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M15 4v16" /></>,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export const iconNames: IconName[] = (Object.keys(paths) as IconName[]).sort();

export type IconProps = {
  name: IconName;
  /** Width and height in px. */
  size?: number;
  /** Stroke width in grid units (the grid is 24 units wide). */
  strokeWidth?: number;
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  title?: string;
};

export function Icon({name, size = 20, strokeWidth = 1.7, title}: IconProps) {
  return (
    <svg
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
