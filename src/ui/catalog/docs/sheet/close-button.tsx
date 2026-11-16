import * as stylex from '@stylexjs/stylex';
import { Button, Sheet } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  entry: { display: 'grid', gap: tokens['--os-space-0-5'], margin: 0 },
  time: { fontSize: tokens['--os-font-size-caption'], lineHeight: tokens['--os-line-height-sm'], color: tokens['--os-color-fg-muted'] },
});

const activity = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  text: ['Lena deployed the billing service', 'Omar commented on Invoice 1042', 'Priya renamed Roadmap notes', 'Theo invited two members'][i % 4],
  time: `${(i + 1) * 7} minutes ago`,
}));

export default function SheetCloseButton() {
  return (
    <Sheet trigger={<Button appearance="tertiary">Activity</Button>} title="Activity" showCloseButton>
      {activity.map(item => (
        <p key={item.id} {...stylex.props(s.entry)}>
          {item.text}
          <span {...stylex.props(s.time)}>{item.time}</span>
        </p>
      ))}
    </Sheet>
  );
}
