import * as stylex from '@stylexjs/stylex';
import { Button, Drawer } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  member: { display: 'flex', justifyContent: 'space-between', margin: 0 },
  role: { color: tokens['--os-color-fg-muted'] },
});

const members = ['Lena', 'Omar', 'Priya', 'Theo', 'Jonas', 'Maya', 'Ines', 'Ravi', 'Nora', 'Felix', 'Sana', 'Hugo'];

export default function DrawerSnapPoints() {
  return (
    <Drawer
      snapPoints={[240, '100%']}
      trigger={<Button appearance="tertiary">Members</Button>}
      title="Members"
      description="Opens part way. Swipe up for the full list."
    >
      {members.map((name, i) => (
        <p key={name} {...stylex.props(s.member)}>
          {name}
          <span {...stylex.props(s.role)}>{i < 2 ? 'Owner' : 'Editor'}</span>
        </p>
      ))}
    </Drawer>
  );
}
