'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Icon } from './Icon';
import { withStyles } from './internal/class-name';

// One call an agent made to a tool, shown exactly (spec 1.19): the tool, the literal input (a command, a
// query, a path), what came back and, when it failed, the error and a retry. Nothing is summarized away,
// because this is what a person reads to trust a run or to find where it went wrong.

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-2'], minWidth: 0 },
  // A literal block is a wash: 8 above and below, 12 in from the side, 13/18 text.
  block: {
    position: 'relative', margin: 0, minWidth: 0, borderRadius: t['--os-radius-md'], backgroundColor: t['--os-color-bg-muted'],
    paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-3'],
    fontFamily: t['--os-font-family'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'], fontVariantNumeric: 'tabular-nums',
    color: t['--os-color-fg-base'], whiteSpace: 'pre-wrap', overflowWrap: 'anywhere',
  },
  input: { paddingInlineEnd: t['--os-space-10'] },
  /** Eight lines of output, then it scrolls. */
  output: {
    maxHeight: `calc(${t['--os-line-height-sm']} * 8 + ${t['--os-space-2']} * 2)`, overflow: 'auto', color: t['--os-color-fg-muted'],
  },
  outputOpen: { maxHeight: 'none' },
  label: {
    display: 'flex', alignItems: 'center', gap: t['--os-space-2'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], lineHeight: t['--os-line-height-xs'], fontWeight: t['--os-font-weight-medium'],
  },
  tool: { color: t['--os-color-fg-base'] },
  copy: { position: 'absolute', insetBlockStart: t['--os-space-1'], insetInlineEnd: t['--os-space-1'] },
  more: { justifySelf: 'start' },
  error: {
    display: 'flex', alignItems: 'flex-start', gap: t['--os-space-2'], borderRadius: t['--os-radius-md'],
    backgroundColor: t['--os-color-bg-error'], color: t['--os-color-fg-error'], paddingBlock: t['--os-space-2'],
    paddingInline: t['--os-space-3'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'],
  },
  /** The icon's box is the text's first line, so the two center on each other. */
  errorIcon: { display: 'flex', alignItems: 'center', flexShrink: 0, height: t['--os-line-height-sm'] },
  errorText: { flex: '1 1 auto', minWidth: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' },
});

export type ToolCallProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** The tool: "bash", "read_file", "search". */
  tool: string;
  /** The literal input, exactly as the agent sent it. */
  input?: string;
  /** What the tool returned. Long output scrolls, with a button to show all of it. */
  output?: string;
  /** Why the call failed. Shown in the error color with `onRetry`. */
  error?: ReactNode;
  /** Adds Retry to a failed call. */
  onRetry?: () => void;
  /** Names the input: "Command", "Query", "Path". Default "Input". */
  inputLabel?: string;
  /** Extra content after the output, such as FileChanges. */
  children?: ReactNode;
};

/** One tool call: the tool, its literal input, its output and any error. */
export function ToolCall({ tool, input, output, error, onRetry, inputLabel = 'Input', children, className, style, ref, ...props }: ToolCallProps) {
  const [copied, setCopied] = useState(false);
  const [all, setAll] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const lines = output ? output.split('\n').length : 0;
  const copy = () => {
    if (!input) return;
    void navigator.clipboard?.writeText(input).then(() => {
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div ref={ref} {...props} {...withStyles(stylex.props(s.root), className, style)}>
      {input !== undefined && (
        <>
          <span {...stylex.props(s.label)}>{tool && <span {...stylex.props(s.tool)}>{tool}</span>}{inputLabel}</span>
          <pre {...stylex.props(s.block, s.input)}>
            {input}
            <span {...stylex.props(s.copy)}>
              <Button size="xs" appearance="text" iconOnly aria-label={copied ? 'Copied' : `Copy ${inputLabel.toLowerCase()}`} onClick={copy}>
                <Icon name={copied ? 'check' : 'copy'} />
              </Button>
            </span>
          </pre>
        </>
      )}
      {input === undefined && <span {...stylex.props(s.label)}><span {...stylex.props(s.tool)}>{tool}</span></span>}
      {output !== undefined && (
        <>
          <span {...stylex.props(s.label)}>Output</span>
          <pre tabIndex={0} aria-label={`${tool} output`} {...stylex.props(s.block, s.output, all && s.outputOpen)}>{output || 'No output.'}</pre>
          {lines > 8 && (
            <span {...stylex.props(s.more)}>
              <Button size="xs" appearance="text" onClick={() => setAll(!all)}>{all ? 'Show less' : `Show all ${lines} lines`}</Button>
            </span>
          )}
        </>
      )}
      {error && (
        <div role="alert" {...stylex.props(s.error)}>
          <span {...stylex.props(s.errorIcon)}><Icon name="x-circle" size={16} /></span>
          <span {...stylex.props(s.errorText)}>{error}</span>
          {onRetry && <Button size="xs" appearance="secondary" onClick={onRetry}>Retry</Button>}
        </div>
      )}
      {children}
    </div>
  );
}
