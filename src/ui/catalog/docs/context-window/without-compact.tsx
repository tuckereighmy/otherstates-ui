import * as stylex from '@stylexjs/stylex';
import { ContextWindow } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360 } });

export default function ContextWindowReadOnly() {
  return (
    <ContextWindow
      {...stylex.props(s.box)}
      title="Researcher"
      model="Standard model"
      max={128000}
      segments={[
        { id: 'sources', label: 'Sources', value: 61200 },
        { id: 'notes', label: 'Notes', value: 9800 },
        { id: 'system', label: 'Instructions', value: 3100 },
      ]}
    />
  );
}
