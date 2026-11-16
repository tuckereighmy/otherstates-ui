import * as stylex from '@stylexjs/stylex';
import { Icon, Tabs } from '../../../components';

const items = [
  { id: 'files', label: 'Files', icon: <Icon name="folder" size={16} />, content: 'Twelve files, last changed by Omar an hour ago.' },
  { id: 'comments', label: 'Comments', icon: <Icon name="message" size={16} />, content: 'Two open threads waiting on a reply.' },
  { id: 'history', label: 'History', icon: <Icon name="clock" size={16} />, content: 'Every saved version from the past 30 days.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsWithIcons() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="Document" items={items} />
    </div>
  );
}
