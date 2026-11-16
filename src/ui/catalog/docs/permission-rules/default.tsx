import * as stylex from '@stylexjs/stylex';
import { Card, PermissionRules, type PermissionTool } from '../../../components';

const tools: PermissionTool[] = [
  { id: 'read', label: 'Read files', description: 'Anything in this repository', risk: 'low' },
  { id: 'search', label: 'Search the web', risk: 'low' },
  { id: 'edit', label: 'Edit files', description: 'Changes stay local until you commit', risk: 'medium' },
  { id: 'bash', label: 'Run shell commands', description: 'npm, git and test scripts', risk: 'medium' },
  { id: 'push', label: 'Push to the remote', risk: 'high' },
  { id: 'deploy', label: 'Deploy to production', risk: 'high' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 600, marginInline: 'auto' } });

export default function PermissionRulesDefault() {
  return (
    <Card heading="Coder" description="What it may do without asking you." {...stylex.props(s.box)}>
      <PermissionRules label="Coder permissions" tools={tools} />
    </Card>
  );
}
