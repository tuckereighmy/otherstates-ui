import * as stylex from '@stylexjs/stylex';
import { Switch } from '../../../components';

const s = stylex.create({
  root: { width: 340, maxWidth: '100%' },
});

export default function SwitchWithDescription() {
  return (
    <div {...stylex.props(s.root)}>
      <Switch
        label="Auto-merge"
        description="Merge pull requests once every check passes."
        defaultSelected
      />
    </div>
  );
}
