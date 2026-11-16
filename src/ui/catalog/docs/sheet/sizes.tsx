'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Sheet } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  row: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: t['--os-space-2'] },
});

const sizes = [
  { size: 'sm', label: 'Small', width: 320 },
  { size: 'md', label: 'Medium', width: 384 },
  { size: 'lg', label: 'Large', width: 480 },
] as const;

export default function SheetSizes() {
  return (
    <div {...stylex.props(s.row)}>
      {sizes.map(({ size, label, width }) => (
        <Sheet
          key={size}
          size={size}
          trigger={<Button appearance="tertiary">{label}</Button>}
          title={`${label} sheet`}
          description={`This sheet is ${width}px wide, or the full viewport on small screens.`}
          footer={close => <Button onClick={close}>Done</Button>}
        />
      ))}
    </div>
  );
}
