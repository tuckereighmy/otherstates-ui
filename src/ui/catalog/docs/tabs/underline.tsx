import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'general', label: 'General', content: 'Workspace name, address and default language.' },
  { id: 'members', label: 'Members', content: 'Eight people, two of them admins.' },
  { id: 'billing', label: 'Billing', content: 'Next invoice on the 1st, paid by card.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsUnderline() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs variant="underline" label="Workspace settings" items={items} />
    </div>
  );
}
