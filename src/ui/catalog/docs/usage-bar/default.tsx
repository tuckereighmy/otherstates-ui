import * as stylex from '@stylexjs/stylex';
import { UsageBar } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 340 } });

export default function UsageBarDefault() {
  return (
    <UsageBar
      {...stylex.props(s.box)}
      label="Context window"
      max={200000}
      restLabel="Free"
      segments={[
        { id: 'system', label: 'System prompt', value: 4200 },
        { id: 'tools', label: 'Tools', value: 12800 },
        { id: 'files', label: 'Files', value: 46100 },
        { id: 'chat', label: 'Conversation', value: 98400, detail: 'Compacts first' },
      ]}
    />
  );
}
