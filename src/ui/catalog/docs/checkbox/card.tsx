import * as stylex from '@stylexjs/stylex';
import { Checkbox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-2'], width: 360, maxWidth: '100%' },
});

export default function CheckboxCard() {
  return (
    <div {...stylex.props(s.column)}>
      <Checkbox
        variant="card"
        label="Preview deployments"
        description="Build every pull request on its own URL."
        defaultSelected
      />
      <Checkbox
        variant="card"
        label="Nightly backups"
        description="Keep a copy of the database for 30 days."
      />
    </div>
  );
}
