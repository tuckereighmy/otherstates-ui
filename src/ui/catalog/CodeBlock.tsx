import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { tokenize } from './highlight';
import { DocsIcon } from './icons';
import { useScrollsSideways } from './useScrollable';

export type CodeLanguage = 'tsx' | 'text';

export type CodeBlockProps = {
  code: string;
  /** 'tsx' colors TypeScript and TSX. 'text' is for paths, commands and CSS. Default 'tsx'. */
  language?: CodeLanguage;
  /** Names the scrolling block for assistive tech: "Fieldset usage", "Files to copy". */
  label?: string;
};

// Files longer than this start collapsed, showing the first lines under an Expand control.
const collapseAbove = 24;
const copiedFor = 1500;

type CopyState = 'idle' | 'copied' | 'selected';

export function CodeBlock({ code, language = 'tsx', label = 'Code' }: CodeBlockProps) {
  const source = code.replace(/\s+$/, '');
  const tokens = useMemo(() => (language === 'tsx' ? tokenize(source) : null), [language, source]);
  const long = useMemo(() => source.split('\n').length > collapseAbove, [source]);
  const [expanded, setExpanded] = useState(false);
  const [copy, setCopy] = useState<CopyState>('idle');
  const blockRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const scrolls = useScrollsSideways(preRef);
  const timer = useRef<number | undefined>(undefined);
  const regionId = useId();
  const collapsed = long && !expanded;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function toggle() {
    setExpanded(!expanded);
    // Collapsing a long file from its end would leave the reader far below it. Bring it back.
    if (expanded) requestAnimationFrame(() => blockRef.current?.scrollIntoView({ block: 'nearest' }));
  }

  async function copyCode() {
    let next: CopyState = 'copied';
    try {
      await navigator.clipboard.writeText(source);
    } catch {
      // No clipboard permission (an insecure origin, an embedded frame): select the code instead.
      const selection = window.getSelection();
      if (codeRef.current && selection) {
        const range = document.createRange();
        range.selectNodeContents(codeRef.current);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      next = 'selected';
    }
    setCopy(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopy('idle'), copiedFor);
  }

  return (
    <div className="docs-code" ref={blockRef} data-collapsed={collapsed || undefined}>
      {/* Focusable while it scrolls sideways, so the keyboard can scroll it; otherwise it is not a
          tab stop. A named group, not a region: a page of examples should not fill the landmark
          list with code blocks. */}
      <pre id={regionId} ref={preRef} tabIndex={scrolls ? 0 : undefined} role="group" aria-label={label}>
        <code ref={codeRef}>
          {tokens
            ? tokens.map((token, index) => (token.type === 'plain' ? token.text : <span key={index} className={`docs-tok-${token.type}`}>{token.text}</span>))
            : source}
        </code>
      </pre>
      <button type="button" className="docs-code-copy" data-state={copy} onClick={copyCode} aria-label={copy === 'idle' ? 'Copy code' : undefined}>
        <DocsIcon name={copy === 'copied' ? 'check' : 'copy'} size={14} />
        {copy === 'copied' && <span>Copied</span>}
        {copy === 'selected' && <span>Selected</span>}
      </button>
      <span className="docs-sr" role="status">
        {copy === 'copied' ? 'Code copied.' : copy === 'selected' ? 'Code selected. Use your copy shortcut.' : ''}
      </span>
      {long && (
        <div className="docs-code-more">
          <button type="button" className="docs-code-toggle" aria-expanded={expanded} aria-controls={regionId} onClick={toggle}>
            {expanded ? 'Collapse' : 'Expand'}
            <DocsIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
