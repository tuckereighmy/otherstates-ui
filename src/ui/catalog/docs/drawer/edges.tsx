'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Drawer } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const edges = [
  { edge: 'top', label: 'Top' },
  { edge: 'right', label: 'Right' },
  { edge: 'bottom', label: 'Bottom' },
  { edge: 'left', label: 'Left' },
] as const;

export default function DrawerEdges() {
  return (
    <div {...stylex.props(s.row)}>
      {edges.map(({ edge, label }) => (
        <Drawer
          key={edge}
          edge={edge}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} drawer`}
          description="Swipe toward the edge, press Escape or press outside to close."
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
