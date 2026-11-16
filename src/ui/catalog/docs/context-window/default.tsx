import * as stylex from '@stylexjs/stylex';
import { ContextWindow } from '../../../components';

const segments = [
  { id: 'conversation', label: 'Conversation', value: 102400 },
  { id: 'files', label: 'Open files', value: 51800 },
  { id: 'tools', label: 'Tool results', value: 18900 },
  { id: 'instructions', label: 'Instructions', value: 6200 },
  { id: 'memory', label: 'Memory', value: 2700 },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function ContextWindowDefault() {
  return (
    <ContextWindow
      {...stylex.props(s.box)}
      model="Large model"
      max={200000}
      segments={segments}
      reclaim={[
        { id: 'conversation', to: 22000, action: 'Summarize' },
        { id: 'files', action: 'Close' },
        { id: 'tools', action: 'Clear' },
      ]}
    />
  );
}
