import * as stylex from '@stylexjs/stylex';
import { Icon, Select } from '../../../components';

const timezones = [
  { id: 'utc', label: 'Coordinated Universal Time' },
  { id: 'cet', label: 'Central European Time' },
  { id: 'est', label: 'Eastern Time' },
  { id: 'pst', label: 'Pacific Time' },
];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectWithIcon() {
  return (
    <div {...stylex.props(s.root)}>
      <Select
        appearance="field"
        label="Time zone"
        startAddon={<Icon name="globe" size={16} />}
        options={timezones}
        defaultValue="cet"
      />
    </div>
  );
}
