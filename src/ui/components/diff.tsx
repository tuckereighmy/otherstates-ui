import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';
import { SrOnly } from './internal/sr-only';

// What an agent changed (spec 1.19). Additions are green and removals red, as everywhere else; the signs
// (+ and −) repeat the color so the change reads without it.

const s = stylex.create({
  stat: {
    display: 'inline-flex', alignItems: 'baseline', gap: t['--os-space-1-5'], flexShrink: 0,
    fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums',
    fontWeight: t['--os-font-weight-medium'],
  },
  added: { color: t['--os-color-fg-success'] },
  removed: { color: t['--os-color-fg-error'] },

  files: { listStyleType: 'none', margin: 0, padding: 0, display: 'grid' },
  file: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: t['--os-size-sm'], minWidth: 0 },
  fileIcon: { display: 'flex', flexShrink: 0, color: t['--os-color-fg-subtle'] },
  path: {
    flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
  dir: { color: t['--os-color-fg-subtle'] },
  base: { color: t['--os-color-fg-base'] },
  tag: { flexShrink: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'] },

  // A code frame: the add and remove tints are made for bg-surface, so the frame keeps its surface and hairline
  // (spec 1.5, opt-in outline) rather than sitting on a wash. 13/18 rows, 4 above and below.
  view: {
    margin: 0, overflow: 'auto', borderRadius: t['--os-radius-md'], borderWidth: t['--os-stroke'], borderStyle: 'solid',
    borderColor: t['--os-color-border-subtle'], backgroundColor: t['--os-color-bg-surface'],
    paddingBlock: t['--os-space-1'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    fontVariantNumeric: 'tabular-nums',
  },
  viewHead: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], paddingInline: t['--os-space-3'], minHeight: t['--os-size-sm'],
    marginBlockStart: `calc(${t['--os-space-1']} * -1)`, marginBlockEnd: t['--os-space-1'],
    borderBottomWidth: t['--os-stroke'], borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-subtle'],
    color: t['--os-color-fg-base'], fontWeight: t['--os-font-weight-medium'], letterSpacing: t['--os-tracking-tight'],
  },
  line: { display: 'grid', gridTemplateColumns: 'auto 16px minmax(0, 1fr)', columnGap: t['--os-space-2'], paddingInlineEnd: t['--os-space-3'], minWidth: 'max-content' },
  lineAdd: { backgroundColor: t['--os-color-bg-success'] },
  lineRemove: { backgroundColor: t['--os-color-bg-error'] },
  number: { minWidth: t['--os-space-8'], paddingInlineStart: t['--os-space-3'], textAlign: 'end', color: t['--os-color-fg-subtle'], userSelect: 'none' },
  noNumber: { width: t['--os-space-1'], paddingInlineStart: 0, minWidth: 0 },
  sign: { textAlign: 'center', userSelect: 'none', color: t['--os-color-fg-subtle'] },
  text: { whiteSpace: 'pre', color: t['--os-color-fg-base'] },
  textRemove: { color: t['--os-color-fg-muted'] },
});

export type DiffStatProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  ref?: Ref<HTMLSpanElement>;
  added: number;
  removed: number;
};

/** "+18 −3": lines added and removed. */
export function DiffStat({ added, removed, className, style, ref, ...props }: DiffStatProps) {
  return (
    <span ref={ref} {...props} {...withStyles(stylex.props(s.stat), className, style)}>
      <span aria-hidden {...stylex.props(s.added)}>+{added}</span>
      <span aria-hidden {...stylex.props(s.removed)}>−{removed}</span>
      <SrOnly>{`${added} lines added, ${removed} removed`}</SrOnly>
    </span>
  );
}

export type FileChangesProps = Omit<HTMLAttributes<HTMLUListElement>, 'children'> & {
  ref?: Ref<HTMLUListElement>;
  'aria-label'?: string;
  children: ReactNode;
};

/** A list of changed files. */
export function FileChanges({ children, className, style, ref, ...props }: FileChangesProps) {
  return <ul ref={ref} {...props} {...withStyles(stylex.props(s.files), className, style)}>{children}</ul>;
}

export type FileChangeKind = 'added' | 'modified' | 'deleted' | 'renamed';

export type FileChangeProps = Omit<HTMLAttributes<HTMLLIElement>, 'children'> & {
  ref?: Ref<HTMLLIElement>;
  /** "src/checkout/cart.ts". The folder is set in a quieter color than the file name. */
  path: string;
  added?: number;
  removed?: number;
  /** Shows "New", "Deleted" or "Renamed" before the counts. `modified` shows nothing. */
  kind?: FileChangeKind;
  /** Trailing content after the counts. */
  end?: ReactNode;
};

const kindWords: Partial<Record<FileChangeKind, string>> = { added: 'New', deleted: 'Deleted', renamed: 'Renamed' };

/** One changed file: its path and its line counts. */
export function FileChange({ path, added, removed, kind = 'modified', end, className, style, ref, ...props }: FileChangeProps) {
  const cut = path.lastIndexOf('/') + 1;
  return (
    <li ref={ref} {...props} {...withStyles(stylex.props(s.file), className, style)}>
      <span {...stylex.props(s.fileIcon)}><Icon name="file" size={16} /></span>
      <span {...stylex.props(s.path)} title={path}>
        <span {...stylex.props(s.dir)}>{path.slice(0, cut)}</span>
        <span {...stylex.props(s.base)}>{path.slice(cut)}</span>
      </span>
      {kindWords[kind] && <span {...stylex.props(s.tag)}>{kindWords[kind]}</span>}
      {added !== undefined && removed !== undefined && <DiffStat added={added} removed={removed} />}
      {end}
    </li>
  );
}

export type DiffLine = {
  type: 'add' | 'remove' | 'context';
  text: string;
  /** The line number in the new file (or the old one for a removed line). */
  number?: number;
};

export type DiffViewProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  lines: DiffLine[];
  /** A header row, usually the file path. */
  heading?: ReactNode;
  /** Names the block for assistive tech when there is no heading. */
  'aria-label'?: string;
};

/** Changed lines with their signs and numbers. Long lines scroll sideways. */
export function DiffView({ lines, heading, className, style, ref, ...props }: DiffViewProps) {
  const numbered = lines.some(line => line.number !== undefined);
  return (
    <div ref={ref} role="group" {...props} {...withStyles(stylex.props(s.view), className, style)}>
      {heading && <div {...stylex.props(s.viewHead)}>{heading}</div>}
      {lines.map((line, index) => (
        <div key={index} {...stylex.props(s.line, line.type === 'add' && s.lineAdd, line.type === 'remove' && s.lineRemove)}>
          <span aria-hidden {...stylex.props(s.number, !numbered && s.noNumber)}>{line.number}</span>
          <span aria-hidden {...stylex.props(s.sign, line.type === 'add' && s.added, line.type === 'remove' && s.removed)}>
            {line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ''}
          </span>
          <span {...stylex.props(s.text, line.type === 'remove' && s.textRemove)}>
            {line.type !== 'context' && <SrOnly>{line.type === 'add' ? 'Added: ' : 'Removed: '}</SrOnly>}
            {line.text || ' '}
          </span>
        </div>
      ))}
    </div>
  );
}
