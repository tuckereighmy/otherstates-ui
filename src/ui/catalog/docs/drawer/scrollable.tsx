'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Drawer } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  section: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

const sections = Array.from({ length: 12 }, (_, i) => `Section ${i + 1}. Invoices are issued on the first working day of the month and are due within 30 days. Late invoices are flagged on the project card.`);

export default function DrawerScrollable() {
  return (
    <Drawer
      trigger={<Button appearance="tertiary">Billing terms</Button>}
      title="Billing terms"
      description="Last updated in March."
      footer={close => <Button onClick={close}>Close</Button>}
    >
      {sections.map(text => <p key={text} {...stylex.props(s.section)}>{text}</p>)}
    </Drawer>
  );
}
