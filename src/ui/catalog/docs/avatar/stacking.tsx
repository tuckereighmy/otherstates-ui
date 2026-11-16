import * as stylex from '@stylexjs/stylex';
import { AvatarGroup } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const people = [
  { name: 'Ines Okafor' },
  { name: 'Tomas Berg' },
  { name: 'Mei Tanaka' },
  { name: 'Rafael Costa' },
];

const s = stylex.create({
  root: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] },
});

export default function AvatarStacking() {
  return (
    <div {...stylex.props(s.root)}>
      <AvatarGroup label="Reviewers" size="sm" items={people} />
      <AvatarGroup label="Approvers" size="sm" items={people} lastOnTop={false} />
    </div>
  );
}
