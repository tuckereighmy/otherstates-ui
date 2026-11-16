import type { ReactNode } from 'react';
import type { RiskLevel } from './agent-status';

// The rules behind PermissionRules (spec 1.19), kept out of the component so a Server Component can work out a
// tool's rule (presetRule, rulesFor) before handing it to the client.

export type PermissionRule = 'allow' | 'ask' | 'deny';
export type PermissionPreset = 'ask' | 'risky' | 'auto';
export type PermissionTool = {
  id: string;
  /** "Run shell commands". Also names the tool's control for assistive tech. */
  label: string;
  /** What it covers: "npm, git and test scripts in this repository". */
  description?: ReactNode;
  risk: RiskLevel;
};

export const permissionPresets: { value: PermissionPreset; label: string; rule: string }[] = [
  { value: 'ask', label: 'Always ask', rule: 'Every tool asks first.' },
  { value: 'risky', label: 'Ask if risky', rule: 'Low-risk tools run on their own; anything riskier asks first.' },
  { value: 'auto', label: 'Full auto', rule: 'Everything runs on its own, except high-risk tools, which ask first.' },
];

/** The rule a preset gives a tool of this risk. */
export function presetRule(preset: PermissionPreset, risk: RiskLevel): PermissionRule {
  if (preset === 'auto') return risk === 'high' ? 'ask' : 'allow';
  if (preset === 'risky') return risk === 'low' ? 'allow' : 'ask';
  return 'ask';
}

/** Every tool's rule under a preset. */
export function rulesFor(preset: PermissionPreset, tools: PermissionTool[]): Record<string, PermissionRule> {
  return Object.fromEntries(tools.map(tool => [tool.id, presetRule(preset, tool.risk)]));
}
