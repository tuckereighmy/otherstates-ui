'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Dialog } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = [
  { size: 'sm', label: 'Small', width: 320 },
  { size: 'md', label: 'Medium', width: 400 },
  { size: 'lg', label: 'Large', width: 560 },
] as const;

export default function DialogSizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(({ size, label, width }) => (
        <Dialog
          key={size}
          size={size}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} dialog`}
          description={`This window is ${width}px wide, or the viewport less 32px on small screens.`}
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
