import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'overview', label: 'Overview', content: 'Four milestones, two of them on track for the March release.' },
  { id: 'activity', label: 'Activity', content: 'Mira closed three issues and opened a review this morning.' },
  { id: 'settings', label: 'Settings', content: 'Visibility, members and notification rules for this project.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsDefault() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs label="Project" items={items} />
    </div>
  );
}
