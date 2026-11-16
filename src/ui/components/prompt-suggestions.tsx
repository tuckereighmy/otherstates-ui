'use client';

import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { Button } from './button';
import { Icon, type IconName } from './Icon';
import { withStyles } from './internal/class-name';

// Ways to start an empty conversation (spec 1.20): up to four short prompts as secondary buttons, centered
// under the composer. Choosing one sends it or fills the composer with it.

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'], margin: 0, padding: 0, listStyleType: 'none' },
  start: { justifyContent: 'flex-start' },
});

export type PromptSuggestion = {
  id: string;
  /** What the button says: "Fix a failing test". */
  label: string;
  /** What is sent. Default: the label. */
  prompt?: string;
  icon?: IconName;
};

export type PromptSuggestionsProps = Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'onSelect'> & {
  ref?: Ref<HTMLUListElement>;
  suggestions: PromptSuggestion[];
  /** Receives the suggestion's prompt. */
  onSelect: (prompt: string) => void;
  /** Default `center`. */
  align?: 'center' | 'start';
  /** Names the list. Default "Suggestions". */
  'aria-label'?: string;
};

/** Short prompts that start a conversation. */
export function PromptSuggestions({ suggestions, onSelect, align = 'center', className, style, ref, ...props }: PromptSuggestionsProps) {
  return (
    <ul ref={ref} aria-label="Suggestions" {...props} {...withStyles(stylex.props(s.row, align === 'start' && s.start), className, style)}>
      {suggestions.map(item => (
        <li key={item.id}>
          <Button size="sm" appearance="secondary" leadingIcon={item.icon ? <Icon name={item.icon} /> : undefined} onClick={() => onSelect(item.prompt ?? item.label)}>
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}
