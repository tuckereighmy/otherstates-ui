'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { AgentGlyph } from './agent-identity';
import { RiskBadge, type RiskLevel } from './agent-status';
import type { ApprovalAgent } from './approval-card';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { Icon } from './Icon';
import { cardStyles as c, decisionKeys, useShortcutNames } from './internal/agent-parts';
import { focusStyles, transitionStyles } from './internal/states';

// An agent stops on a question only a person can answer (spec 1.19). The question is the hero; the options
// are wash rows, numbered, and the number is also the key that picks it. The agent's own pick is marked in
// words. An option can open a follow-up question under it, so a decision can be a short tree.

const s = stylex.create({
  group: { display: 'grid', gap: t['--os-space-1'] },
  groupLabel: {
    display: 'grid', gap: t['--os-space-0-5'], color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'],
    lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'], marginBlockEnd: t['--os-space-1'],
  },
  groupQuestion: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'],
  },
  /** An option is a wash row (12 all round); hover steps it up once, the chosen one is a surface with a ring. */
  option: {
    display: 'grid', gridTemplateColumns: '20px minmax(0, 1fr)', columnGap: t['--os-space-3'], alignItems: 'start',
    cursor: 'pointer', outlineStyle: 'none', boxShadow: 'none',
  },
  optionHover: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  selected: { backgroundColor: t['--os-color-bg-surface'], boxShadow: `inset 0 0 0 1.5px ${t['--os-color-fg-base']}` },
  disabled: { cursor: 'default', backgroundColor: t['--os-color-bg-disabled'] },
  textDisabled: { color: t['--os-color-fg-disabled'] },
  key: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: t['--os-radius-xs'],
    backgroundColor: t['--os-color-bg-surface'], color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-xs'],
    fontWeight: t['--os-font-weight-medium'], fontVariantNumeric: 'tabular-nums', lineHeight: 1,
  },
  keyOn: { backgroundColor: t['--os-color-fg-base'], color: t['--os-color-bg-surface'] },
  label: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: t['--os-space-2'], color: t['--os-color-fg-base'],
    fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  pick: {
    display: 'inline-flex', alignItems: 'center', gap: t['--os-space-1'], color: t['--os-color-fg-muted'],
    fontSize: t['--os-font-size-xs'], fontWeight: t['--os-font-weight-medium'], lineHeight: t['--os-line-height-xs'], letterSpacing: 0,
  },
  description: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], lineHeight: t['--os-line-height-sm'],
    letterSpacing: t['--os-tracking-tight'],
  },
  followUp: {
    display: 'grid', gap: t['--os-space-1'], marginInlineStart: t['--os-space-3'], paddingInlineStart: t['--os-space-5'],
    borderInlineStartWidth: t['--os-stroke-2'], borderInlineStartStyle: 'solid', borderInlineStartColor: t['--os-color-border-subtle'],
  },
});

export type DecisionOption = {
  id: string;
  label: ReactNode;
  /** What choosing it means, including the cost or the risk. */
  description?: ReactNode;
  /** The agent's own pick. Marked "Agent's pick". */
  recommended?: boolean;
  isDisabled?: boolean;
  /** A question that follows when this option is chosen. */
  followUp?: { question: ReactNode; options: DecisionOption[] };
};

export type DecisionCardProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'onChange' | 'onSubmit'> & {
  /** The question: "Which queue should the import service use?" */
  question: ReactNode;
  /** What the agent knows: the situation, numbers, constraints. */
  context?: ReactNode;
  agent?: ApprovalAgent;
  risk?: RiskLevel;
  options: DecisionOption[];
  /** The chosen option ids, one per level of the tree (controlled). */
  value?: string[];
  /** Default: the recommended path, if any. */
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  /** Receives the chosen ids, one per level. */
  onSubmit?: (value: string[]) => void;
  /** Adds a secondary button that sets the question aside ("Later"). */
  onLater?: () => void;
  /** Default "Decide". */
  submitLabel?: string;
  /** Default "Later". */
  laterLabel?: string;
  /** Where this question sits in a queue: "1 of 3". */
  position?: ReactNode;
  /** More content under the options. */
  children?: ReactNode;
  /** Listens for Mod+Enter, Escape and the number keys while focus is inside. Default true. */
  shortcuts?: boolean;
};

function chain(options: DecisionOption[], value: string[]) {
  const levels: { question?: ReactNode; options: DecisionOption[]; chosen?: string }[] = [{ options, chosen: value[0] }];
  for (let depth = 0; depth < value.length; depth++) {
    const option = levels[depth].options.find(item => item.id === value[depth]);
    if (!option?.followUp) break;
    levels.push({ question: option.followUp.question, options: option.followUp.options, chosen: value[depth + 1] });
  }
  return levels;
}

function initial(options: DecisionOption[]): string[] {
  const pick = options.find(option => option.recommended);
  return pick ? [pick.id, ...(pick.followUp ? initial(pick.followUp.options) : [])] : [];
}

/** A question for a person: the options as numbered rows, the agent's pick and follow-ups. */
export function DecisionCard({
  question, context, agent, risk, options, value, defaultValue, onChange, onSubmit, onLater, submitLabel = 'Decide',
  laterLabel = 'Later', position, children, shortcuts = true, onKeyDown, size = 'sm', ...props
}: DecisionCardProps) {
  const [own, setOwn] = useState<string[]>(() => defaultValue ?? initial(options));
  const current = value ?? own;
  const levels = chain(options, current);
  const complete = levels.every(level => level.chosen !== undefined);
  const names = useShortcutNames();
  const set = (depth: number, id: string) => {
    const option = levels[depth].options.find(item => item.id === id);
    if (!option || option.isDisabled) return;
    const next = [...current.slice(0, depth), id, ...(option.followUp ? initial(option.followUp.options) : [])];
    setOwn(next);
    onChange?.(next);
  };
  const submit = () => { if (complete) onSubmit?.(current); };
  const keys = decisionKeys(onSubmit && submit, onLater, shortcuts);
  /** 1–9 pick a top-level option, unless focus is in a text field. */
  const numberKeys = (event: KeyboardEvent) => {
    if (!shortcuts || event.metaKey || event.ctrlKey || event.altKey) return;
    if ((event.target as HTMLElement).closest('input, textarea, [contenteditable="true"]')) return;
    const n = Number.parseInt(event.key, 10);
    if (n >= 1 && n <= options.length) { event.preventDefault(); set(0, options[n - 1].id); }
  };

  const group = (level: (typeof levels)[number], depth: number) => (
    <RadioGroup
      key={depth}
      aria-label={depth === 0 ? 'Options' : undefined}
      value={level.chosen ?? null}
      onChange={id => set(depth, id)}
      {...stylex.props(s.group)}
    >
      {depth > 0 && (
        <span {...stylex.props(s.groupLabel)}>
          <span {...stylex.props(s.groupQuestion)}>{level.question}</span>
          <span>After {levels[depth - 1].options.find(option => option.id === levels[depth - 1].chosen)?.label}</span>
        </span>
      )}
      {level.options.map((option, index) => (
        <Radio
          key={option.id}
          value={option.id}
          isDisabled={option.isDisabled}
          className={({ isSelected, isHovered, isFocusVisible, isDisabled }) => stylex.props(
            c.wash, c.washRich, s.option, transitionStyles.colors, isHovered && !isSelected && !isDisabled && s.optionHover,
            isSelected && s.selected, isDisabled && s.disabled, isFocusVisible && focusStyles.ring,
          ).className ?? ''}
        >
          {({ isSelected, isDisabled }) => (
            <>
              <span aria-hidden {...stylex.props(s.key, isSelected && s.keyOn, isDisabled && s.textDisabled)}>{depth === 0 ? index + 1 : isSelected && <Icon name="check" size={12} strokeWidth={2.4} />}</span>
              <span {...stylex.props(c.rowText)}>
                <span {...stylex.props(s.label, isDisabled && s.textDisabled)}>
                  {option.label}
                  {option.recommended && <span {...stylex.props(s.pick, isDisabled && s.textDisabled)}><Icon name="sparkle" size={12} />Agent's pick</span>}
                </span>
                {option.description && <span {...stylex.props(s.description, isDisabled && s.textDisabled)}>{option.description}</span>}
              </span>
            </>
          )}
        </Radio>
      ))}
    </RadioGroup>
  );

  return (
    <Card
      size={size}
      aria-label={typeof question === 'string' ? question : undefined}
      onKeyDown={event => { onKeyDown?.(event); keys(event); numberKeys(event); }}
      {...props}
    >
      <div {...stylex.props(c.stack)}>
        {(agent || risk || position) && (
          <div {...stylex.props(c.head)}>
            {agent && <AgentGlyph name={agent.name} icon={agent.icon} color={agent.color} size="md" decorative />}
            {agent && <span {...stylex.props(c.headText)}><span {...stylex.props(c.eyebrow)}><span {...stylex.props(c.strong)}>{agent.name}</span> is waiting on you</span></span>}
            <span {...stylex.props(c.headEnd)}>
              {risk && <RiskBadge risk={risk} appearance="text" />}
              {position && <span {...stylex.props(c.unit)}>{position}</span>}
            </span>
          </div>
        )}
        <div {...stylex.props(c.titleBlock)}>
          <p {...stylex.props(c.title)}>{question}</p>
          {context && <p {...stylex.props(c.lead)}>{context}</p>}
        </div>
        {levels.map((level, depth) => depth === 0 ? group(level, depth) : <div key={depth} {...stylex.props(s.followUp)}>{group(level, depth)}</div>)}
        {children}
        {(onSubmit || onLater) && (
          <div {...stylex.props(c.actionsFill)}>
            {onLater && <Button size="sm" appearance="secondary" aria-keyshortcuts={shortcuts ? names.dismiss : undefined} onClick={onLater}>{laterLabel}</Button>}
            {onSubmit && <Button size="sm" isDisabled={!complete} aria-keyshortcuts={shortcuts ? names.primary : undefined} onClick={submit}>{submitLabel}</Button>}
          </div>
        )}
      </div>
    </Card>
  );
}
