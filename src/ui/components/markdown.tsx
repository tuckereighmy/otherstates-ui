'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';
import { focusStyles } from './internal/states';

// An assistant's reply as prose (spec 1.20). A small Markdown reader written for chat: paragraphs, headings,
// lists, quotes, rules, tables, fenced code, inline code, bold, italic, strike and links. It builds React
// elements, never HTML strings, so nothing in a reply can inject markup. It reads text that is still
// streaming: an unclosed code fence is shown as code, an unclosed ** as plain text.

const s = stylex.create({
  // Inline code steps one size down the type scale from the prose around it: 14 in 16px text, 13 in 14px.
  prose: {
    display: 'grid', gap: t['--os-space-4'], minWidth: 0, color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], letterSpacing: t['--os-tracking-tight'],
    overflowWrap: 'anywhere', '--os-markdown-code-size': t['--os-font-size-sm'],
  },
  compact: {
    fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'], gap: t['--os-space-3'],
    '--os-markdown-code-size': t['--os-font-size-caption'],
  },
  p: { margin: 0 },
  h1: { margin: 0, fontSize: t['--os-font-size-lg'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-semibold'], letterSpacing: t['--os-tracking-tight'] },
  h2: { margin: 0, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-semibold'], letterSpacing: t['--os-tracking-tight'] },
  h3: { margin: 0, fontSize: t['--os-font-size-body'], lineHeight: t['--os-line-height-lg'], fontWeight: t['--os-font-weight-medium'] },
  list: { margin: 0, paddingInlineStart: t['--os-space-5'], display: 'grid', gap: t['--os-space-1-5'] },
  // Set, not left to the browser: a global reset (Tailwind's preflight) clears list markers.
  bullets: { listStyleType: 'disc' },
  numbers: { listStyleType: 'decimal' },
  item: { paddingInlineStart: t['--os-space-1'], '::marker': { color: t['--os-color-fg-subtle'] } },
  quote: {
    margin: 0, paddingInlineStart: t['--os-space-4'], color: t['--os-color-fg-muted'],
    borderInlineStartWidth: t['--os-stroke-2'], borderInlineStartStyle: 'solid', borderInlineStartColor: t['--os-color-border-muted'],
  },
  rule: { margin: 0, height: t['--os-stroke'], borderWidth: 0, backgroundColor: t['--os-color-border-subtle'] },
  code: {
    paddingBlock: t['--os-space-0-5'], paddingInline: t['--os-space-1'], borderRadius: t['--os-radius-xs'], backgroundColor: t['--os-color-bg-muted'],
    fontFamily: t['--os-font-family'], fontSize: `var(--os-markdown-code-size, ${t['--os-font-size-sm']})`, fontVariantNumeric: 'tabular-nums',
  },
  link: {
    color: t['--os-color-fg-link'], textDecorationLine: 'underline', textUnderlineOffset: '0.2em',
    textDecorationColor: 'currentColor',
    outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineOffset: 2, outlineColor: t['--os-color-focus-ring'],
    borderRadius: t['--os-radius-xs'],
  },
  strong: { fontWeight: t['--os-font-weight-semibold'] },
  block: { minWidth: 0, borderRadius: t['--os-radius-md'], backgroundColor: t['--os-color-bg-muted'], overflow: 'hidden' },
  blockHead: {
    // A 36px row; the xs Copy button sits 6 from the top and the end, so it reads concentric with the block.
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], minHeight: 36, paddingInlineStart: t['--os-space-3'], paddingInlineEnd: t['--os-space-1-5'],
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0,
  },
  blockLang: { flex: '1 1 auto' },
  pre: {
    margin: 0, overflowX: 'auto', paddingBlockStart: 0, paddingBlockEnd: t['--os-space-3'], paddingInline: t['--os-space-3'],
    // 13/18, the same literal rows as ToolCall and DiffView.
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    fontVariantNumeric: 'tabular-nums', whiteSpace: 'pre', color: t['--os-color-fg-base'],
    // The keyboard ring is drawn inset (the block clips), so its lower corners follow the block's.
    borderEndStartRadius: t['--os-radius-md'], borderEndEndRadius: t['--os-radius-md'],
  },
  inherit: { fontFamily: 'inherit', fontSize: 'inherit' },
  tableWrap: { overflowX: 'auto', minWidth: 0 },
  table: { borderCollapse: 'collapse', width: '100%', fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'] },
  th: {
    textAlign: 'start', paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-3'], fontWeight: t['--os-font-weight-medium'],
    color: t['--os-color-fg-muted'], borderBottomWidth: t['--os-stroke'], borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-muted'],
  },
  td: {
    paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-3'], verticalAlign: 'top',
    borderBottomWidth: t['--os-stroke'], borderBottomStyle: 'solid', borderBottomColor: t['--os-color-border-subtle'],
  },
  edge: { paddingInlineStart: 0 },
});

/** A fenced code block: the language and Copy on top, the code below, scrolling sideways. */
export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = () => void navigator.clipboard?.writeText(code).then(() => {
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1600);
  });
  return (
    <div {...stylex.props(s.block)}>
      <div {...stylex.props(s.blockHead)}>
        <span {...stylex.props(s.blockLang)}>{language || 'Code'}</span>
        <Button size="xs" appearance="text" leadingIcon={<Icon name={copied ? 'check' : 'copy'} />} onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
      </div>
      <pre tabIndex={0} aria-label={`${language || 'Code'} block`} {...stylex.props(s.pre, focusStyles.ringInsetVisible)}><code {...stylex.props(s.inherit)}>{code}</code></pre>
    </div>
  );
}

const safeHref = (href: string) => /^(https?:|mailto:|#|\/)/i.test(href.trim()) ? href.trim() : undefined;

/** Inline Markdown: code, links, bold, italic and strike. Unclosed marks stay as text. */
function inline(text: string, key = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /(`+)([^`]+?)\1|\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|~~([^~]+)~~|\*([^*\s][^*]*)\*|_([^_\s][^_]*)_/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) out.push(text.slice(last, match.index));
    const k = `${key}-${n++}`;
    if (match[2] !== undefined) out.push(<code key={k} {...stylex.props(s.code)}>{match[2]}</code>);
    else if (match[3] !== undefined) {
      const href = safeHref(match[4]);
      out.push(href
        ? <a key={k} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer noopener" {...stylex.props(s.link)}>{inline(match[3], k)}</a>
        : <span key={k}>{match[3]}</span>);
    }
    else if (match[5] !== undefined || match[6] !== undefined) out.push(<strong key={k} {...stylex.props(s.strong)}>{inline(match[5] ?? match[6], k)}</strong>);
    else if (match[7] !== undefined) out.push(<s key={k}>{inline(match[7], k)}</s>);
    else out.push(<em key={k}>{inline(match[8] ?? match[9], k)}</em>);
    last = pattern.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const cells = (row: string) => row.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());

/** Splits Markdown into React blocks. */
function blocks(source: string): ReactNode[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const out: ReactNode[] = [];
  let i = 0;
  const key = () => `b${out.length}`;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = /^\s*(```|~~~)\s*([\w+-]*)/.exec(line);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith(fence[1])) body.push(lines[i++]);
      i++;
      out.push(<CodeBlock key={key()} code={body.join('\n')} language={fence[2] || undefined} />);
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const Tag = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      out.push(<Tag key={key()} {...stylex.props(level === 1 ? s.h1 : level === 2 ? s.h2 : s.h3)}>{inline(heading[2], key())}</Tag>);
      i++;
      continue;
    }
    if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) { out.push(<hr key={key()} {...stylex.props(s.rule)} />); i++; continue; }
    if (/^\s*>/.test(line)) {
      const body: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) body.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(<blockquote key={key()} {...stylex.props(s.quote)}>{blocks(body.join('\n'))}</blockquote>);
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1])) {
      const head = cells(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      const k = key();
      out.push(
        <div key={k} {...stylex.props(s.tableWrap)}>
          <table {...stylex.props(s.table)}>
            <thead><tr>{head.map((cell, c) => <th key={c} {...stylex.props(s.th, c === 0 && s.edge)}>{inline(cell, `${k}h${c}`)}</th>)}</tr></thead>
            <tbody>{rows.map((row, r) => <tr key={r}>{head.map((_, c) => <td key={c} {...stylex.props(s.td, c === 0 && s.edge)}>{inline(row[c] ?? '', `${k}${r}${c}`)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      );
      continue;
    }
    const bullet = /^\s*([-*+]|\d+[.)])\s+/;
    if (bullet.test(line)) {
      const ordered = /^\s*\d/.test(line);
      const items: string[] = [];
      while (i < lines.length && (bullet.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (bullet.test(lines[i])) items.push(lines[i].replace(bullet, ''));
        else items[items.length - 1] += ` ${lines[i].trim()}`;
        i++;
      }
      const List = ordered ? 'ol' : 'ul';
      const k = key();
      out.push(<List key={k} {...stylex.props(s.list, ordered ? s.numbers : s.bullets)}>{items.map((item, n) => <li key={n} {...stylex.props(s.item)}>{inline(item, `${k}${n}`)}</li>)}</List>);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^\s*(```|~~~|#{1,6}\s|>|[-*+]\s|\d+[.)]\s|\|)/.test(lines[i])) para.push(lines[i++]);
    if (!para.length) para.push(lines[i++]);
    const k = key();
    out.push(<p key={k} {...stylex.props(s.p)}>{inline(para.join(' '), k)}</p>);
  }
  return out;
}

export type MarkdownProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** The Markdown text. It may be partial while it streams. */
  children: string;
  /** 14/20 text and 12 px between blocks, for side panels and cards. Default 16/24 and 16. */
  size?: 'md' | 'sm';
};

/** Markdown as prose in the system's type, built as React elements. */
export function Markdown({ children, size = 'md', className, style, ref, ...props }: MarkdownProps) {
  return <div ref={ref} {...props} {...withStyles(stylex.props(s.prose, size === 'sm' && s.compact), className, style)}>{blocks(children)}</div>;
}
