'use client';

import * as stylex from '@stylexjs/stylex';
import { Command, Icon } from '../../../components';

const s = stylex.create({ frame: { width: 'min(100%, 420px)' } });

export default function CommandStandalone() {
  return (
    <div {...stylex.props(s.frame)}>
      <Command
        standalone
        footer={null}
        placeholder="Filter files…"
        actions={[
          { id: 'brief', label: 'Project brief', icon: <Icon name="file" size={16} />, onAction: () => {} },
          { id: 'budget', label: 'Budget 2027', icon: <Icon name="file" size={16} />, onAction: () => {} },
          { id: 'research', label: 'User research', icon: <Icon name="folder" size={16} />, onAction: () => {} },
          { id: 'assets', label: 'Brand assets', icon: <Icon name="image" size={16} />, onAction: () => {} },
        ]}
      />
    </div>
  );
}
