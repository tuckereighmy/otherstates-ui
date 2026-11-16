'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type HTMLAttributes, type Ref } from 'react';
import { tokens as t } from '../tokens.stylex';
import { RiskBadge } from './agent-status';
import { cardStyles as c } from './internal/agent-parts';
import { permissionPresets, presetRule, rulesFor, type PermissionPreset, type PermissionRule, type PermissionTool } from './permission-presets';
import { withStyles } from './internal/class-name';
import { SegmentedControl } from './segmented-control';

// What an agent may do, tool by tool (spec 1.19): each tool is allowed (runs without asking), asks first, or
// is denied. Three presets fill the rules in from each tool's risk, and any rule can then be changed. A
// high-risk tool never runs without asking unless a person sets it to Allow themselves.

const s = stylex.create({
  root: { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: t['--os-space-4'], minWidth: 0 },
  presetRow: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: t['--os-space-3'] },
  note: {
    margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-sm'], lineHeight: t['--os-line-height-md'],
    letterSpacing: t['--os-tracking-tight'],
  },
  custom: {
    color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-sm'], letterSpacing: t['--os-tracking-tight'],
  },
  /** A rule is a wash row whose text wraps: 12 all round. */
  row: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: t['--os-space-3'], rowGap: t['--os-space-2'] },
  text: { flex: '1 1 200px' },
  labelRow: { display: 'flex', alignItems: 'baseline', gap: t['--os-space-2'], flexWrap: 'wrap' },
  label: {
    color: t['--os-color-fg-base'], fontSize: t['--os-font-size-sm'], fontWeight: t['--os-font-weight-medium'],
    lineHeight: t['--os-line-height-md'], letterSpacing: t['--os-tracking-tight'],
  },
});

const ruleOptions = [{ value: 'allow', label: 'Allow' }, { value: 'ask', label: 'Ask' }, { value: 'deny', label: 'Deny' }];

export type PermissionRulesProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'defaultValue'> & {
  ref?: Ref<HTMLDivElement>;
  /** Names the rules: "Coder permissions". */
  label: string;
  tools: PermissionTool[];
  /** Each tool's rule, by id (controlled). */
  value?: Record<string, PermissionRule>;
  /** Default: the `risky` preset. */
  defaultValue?: Record<string, PermissionRule>;
  onChange?: (rules: Record<string, PermissionRule>) => void;
  /** Shows the presets above the tools. Default true. */
  showPresets?: boolean;
};

/** Allow, ask or deny for each tool an agent can use, with presets. */
export function PermissionRules({ label, tools, value, defaultValue, onChange, showPresets = true, className, style, ref, ...props }: PermissionRulesProps) {
  const [own, setOwn] = useState<Record<string, PermissionRule>>(() => defaultValue ?? rulesFor('risky', tools));
  const rules = value ?? own;
  const ruleOf = (tool: PermissionTool) => rules[tool.id] ?? presetRule('risky', tool.risk);
  const set = (next: Record<string, PermissionRule>) => { setOwn(next); onChange?.(next); };
  const matched = permissionPresets.find(preset => tools.every(tool => ruleOf(tool) === presetRule(preset.value, tool.risk)));
  const counts = { allow: 0, ask: 0, deny: 0 };
  tools.forEach(tool => { counts[ruleOf(tool)] += 1; });

  return (
    <div ref={ref} role="group" aria-label={label} {...props} {...withStyles(stylex.props(s.root), className, style)}>
      {showPresets && (
        <div {...stylex.props(s.presetRow)}>
          <SegmentedControl
            label="Preset"
            options={permissionPresets.map(({ value: v, label: l }) => ({ value: v, label: l }))}
            value={matched?.value ?? ''}
            onChange={preset => set(rulesFor(preset as PermissionPreset, tools))}
          />
          {!matched && <span {...stylex.props(s.custom)}>Custom</span>}
        </div>
      )}
      <p {...stylex.props(s.note)} aria-live="polite">
        {matched ? `${matched.rule} ` : ''}{counts.allow} run on their own, {counts.ask} ask first{counts.deny ? `, ${counts.deny} denied` : ''}.
      </p>
      <ul {...stylex.props(c.washList)}>
        {tools.map(tool => (
          <li key={tool.id} {...stylex.props(c.wash, c.washRich, s.row)}>
            <span {...stylex.props(c.rowText, s.text)}>
              <span {...stylex.props(s.labelRow)}>
                <span {...stylex.props(s.label)}>{tool.label}</span>
                {tool.risk !== 'low' && <RiskBadge risk={tool.risk} appearance="text" />}
              </span>
              {tool.description && <span {...stylex.props(c.meta)}>{tool.description}</span>}
            </span>
            <SegmentedControl
              label={`${tool.label}: permission`}
              size="xs"
              options={ruleOptions}
              value={ruleOf(tool)}
              onChange={rule => set({ ...rules, [tool.id]: rule as PermissionRule })}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
