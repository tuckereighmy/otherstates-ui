import * as stylex from '@stylexjs/stylex';
import { ContextWindow } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function ContextWindowOverLimit() {
  return (
    <ContextWindow
      {...stylex.props(s.box)}
      title="Debugger"
      model="Small model"
      max={128000}
      segments={[
        { id: 'conversation', label: 'Conversation', value: 88600 },
        { id: 'logs', label: 'Pasted logs', value: 34200 },
        { id: 'instructions', label: 'Instructions', value: 5400 },
        { id: 'memory', label: 'Memory', value: 1900 },
      ]}
      reclaim={[{ id: 'conversation', to: 16000 }, { id: 'logs' }]}
    />
  );
}
