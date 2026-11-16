import * as stylex from '@stylexjs/stylex';
import { Button, Icon, Tooltip } from '../../../components';
import type { IconName } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ toolbar: { display: 'flex', gap: t['--os-space-1'] } });
const tools: { icon: IconName; label: string; keys: string }[] = [
  { icon: 'bold', label: 'Bold', keys: '⌘B' },
  { icon: 'italic', label: 'Italic', keys: '⌘I' },
  { icon: 'underline', label: 'Underline', keys: '⌘U' },
  { icon: 'link', label: 'Add link', keys: '⌘K' },
];

export default function TooltipGrouped() {
  return (
    <div role="toolbar" aria-label="Formatting" {...stylex.props(s.toolbar)}>
      {tools.map(tool => (
        <Tooltip key={tool.icon} trigger={
          <Button appearance="text" size="sm" iconOnly aria-label={tool.label}>
            <Icon name={tool.icon} />
          </Button>
        }>
          {tool.label} · {tool.keys}
        </Tooltip>
      ))}
    </div>
  );
}
