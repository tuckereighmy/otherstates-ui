import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'profile', label: 'Profile', content: 'Your name, photo and the time zone used for reminders.' },
  { id: 'security', label: 'Security', content: 'Password, passkeys and the devices that are signed in.' },
  { id: 'alerts', label: 'Alerts', content: 'Choose which updates reach you by email.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsVertical() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs orientation="vertical" label="Account" items={items} />
    </div>
  );
}
