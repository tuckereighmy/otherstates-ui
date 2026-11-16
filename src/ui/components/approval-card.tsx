'use client';

import * as stylex from '@stylexjs/stylex';
import { useState, type ReactNode } from 'react';
import { AgentGlyph, type AgentColor } from './agent-identity';
import { RiskBadge, type RiskLevel } from './agent-status';
import { Button } from './button';
import { Card, type CardProps } from './card';
import { Icon, type IconName } from './Icon';
import { cardStyles as c, decisionKeys, DetailTiles, useShortcutNames, type DetailItem } from './internal/agent-parts';
import { SegmentedControl } from './segmented-control';
import { ToolCall } from './tool-call';

// An agent asks before it acts (spec 1.19). One card, read top to bottom: who asks and how risky it is,
// what will happen, the figures that matter as tiles, then the decision. Mod+Enter approves and Escape
// denies while focus is inside the card.

export type ApprovalAgent = { name: string; icon?: IconName; color?: AgentColor };
export type ApprovalScope = { id: string; label: string };
export type ApprovalStatus = 'pending' | 'approved' | 'denied';

export type ApprovalCardProps = Omit<CardProps, 'heading' | 'description' | 'action' | 'footer' | 'children' | 'title'> & {
  /** What will happen, as a short action: "Send the October newsletter". */
  title: ReactNode;
  /** Why, or for whom: one or two sentences. */
  description?: ReactNode;
  /** The agent asking, in the head row. */
  agent?: ApprovalAgent;
  /** The words after the agent's name. Default "asks". */
  askVerb?: ReactNode;
  risk?: RiskLevel;
  /**
   * Exactly what will run, as the agent will send it: a shell command, a query, a request body. Shown in
   * full with a copy button, because a person should approve the literal action, not a summary of it.
   */
  command?: string;
  /** The tool that runs `command`: "bash", "sql". */
  tool?: string;
  /** Names `command`. Default "Command". */
  commandLabel?: string;
  /** The figures that matter, as tiles: recipients, amounts, targets, times. Two or three read best. */
  details?: DetailItem[];
  /** More content under the tiles, such as FileChanges or a DiffView. */
  children?: ReactNode;
  /** Choices for how long the approval lasts ("Just once", "For 1 hour", "Always"). */
  scopes?: ApprovalScope[];
  scope?: string;
  defaultScope?: string;
  onScopeChange?: (scope: string) => void;
  /** Default "Approve". */
  approveLabel?: string;
  /** Default "Deny". */
  denyLabel?: string;
  /** Receives the chosen scope when there are `scopes`. */
  onApprove?: (scope?: string) => void;
  onDeny?: () => void;
  /** `approved` or `denied` replaces the buttons with the outcome. Default `pending`. */
  status?: ApprovalStatus;
  /** Replaces the outcome line, for example "Approved by Mia · 9:02". */
  statusLabel?: ReactNode;
  /** Shows the approve button as loading while the action starts. */
  isApproving?: boolean;
  /** Listens for Mod+Enter and Escape while focus is inside. Default true. */
  shortcuts?: boolean;
};

/** An agent's request for permission: who asks, what will happen, the figures and one decision. */
export function ApprovalCard({
  title, description, agent, askVerb = 'asks', risk, command, tool, commandLabel = 'Command', details, children, scopes, scope, defaultScope,
  onScopeChange, approveLabel = 'Approve', denyLabel = 'Deny', onApprove, onDeny, status = 'pending', statusLabel,
  isApproving = false, shortcuts = true, onKeyDown, size = 'sm', ...props
}: ApprovalCardProps) {
  const [ownScope, setOwnScope] = useState(defaultScope ?? scopes?.[0]?.id);
  const current = scope ?? ownScope;
  const pending = status === 'pending';
  const approve = () => { if (!isApproving) onApprove?.(scopes ? current : undefined); };
  const keys = decisionKeys(onApprove && approve, onDeny, pending && shortcuts);
  const names = useShortcutNames();

  return (
    <Card size={size} aria-label={typeof title === 'string' ? title : undefined} onKeyDown={event => { onKeyDown?.(event); keys(event); }} {...props}>
      <div {...stylex.props(c.stack)}>
        {(agent || risk) && (
          <div {...stylex.props(c.head)}>
            {agent && <AgentGlyph name={agent.name} icon={agent.icon} color={agent.color} size="md" decorative />}
            {agent && <span {...stylex.props(c.headText)}><span {...stylex.props(c.eyebrow)}><span {...stylex.props(c.strong)}>{agent.name}</span> {askVerb}</span></span>}
            {risk && <span {...stylex.props(c.headEnd)}><RiskBadge risk={risk} appearance="text" /></span>}
          </div>
        )}
        <div {...stylex.props(c.titleBlock)}>
          <p {...stylex.props(c.title)}>{title}</p>
          {description && <p {...stylex.props(c.lead)}>{description}</p>}
        </div>
        {command !== undefined && <ToolCall tool={tool ?? ''} input={command} inputLabel={commandLabel} />}
        {details && details.length > 0 && <DetailTiles items={details} />}
        {children}
        {scopes && pending && (
          <SegmentedControl
            label="Allow for"
            options={scopes.map(option => ({ value: option.id, label: option.label }))}
            value={current}
            onChange={value => { setOwnScope(value); onScopeChange?.(value); }}
          />
        )}
        {pending ? (onApprove || onDeny) && (
          <div {...stylex.props(c.actionsFill)}>
            {onDeny && <Button size="sm" appearance="secondary" aria-keyshortcuts={shortcuts ? names.dismiss : undefined} onClick={onDeny}>{denyLabel}</Button>}
            {onApprove && <Button size="sm" isLoading={isApproving} aria-keyshortcuts={shortcuts ? names.primary : undefined} onClick={approve}>{approveLabel}</Button>}
          </div>
        ) : (
          <div role="status" {...stylex.props(c.outcome)}>
            <span {...stylex.props(c.outcomeIcon, status === 'approved' ? c.approved : c.denied)}>
              <Icon name={status === 'approved' ? 'check-circle' : 'x-circle'} size={16} />
            </span>
            {statusLabel ?? (status === 'approved' ? 'Approved' : 'Denied')}
          </div>
        )}
      </div>
    </Card>
  );
}
