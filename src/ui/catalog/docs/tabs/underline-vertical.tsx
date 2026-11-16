import * as stylex from '@stylexjs/stylex';
import { Tabs } from '../../../components';

const items = [
  { id: 'build', label: 'Build', content: 'Install and compile took 48 seconds.' },
  { id: 'tests', label: 'Tests', content: '312 passed, none skipped.' },
  { id: 'deploy', label: 'Deploy', content: 'Live in two regions since 09:40.' },
];

const s = stylex.create({
  frame: { width: '100%', maxWidth: 480 },
});

export default function TabsUnderlineVertical() {
  return (
    <div {...stylex.props(s.frame)}>
      <Tabs variant="underline" orientation="vertical" label="Pipeline" items={items} />
    </div>
  );
}
