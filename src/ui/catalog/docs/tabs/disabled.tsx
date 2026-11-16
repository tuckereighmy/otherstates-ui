import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'draft', label: 'Draft', content: 'The invoice is still editable.' },
  { id: 'sent', label: 'Sent', content: 'Delivered to the client on Monday.' },
  { id: 'refunds', label: 'Refunds', content: 'No refunds yet.', disabled: true },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsDisabled() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="Invoice" items={items} />
    </div>
  );
}
