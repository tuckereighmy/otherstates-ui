import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const environments = [
  { id: 'production', label: 'Production' },
  { id: 'staging', label: 'Staging' },
  { id: 'preview', label: 'Preview', disabled: true },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function ComboboxDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Environment" options={environments} defaultSelectedKey="production" isDisabled />
      <Combobox label="Environment with a locked option" placeholder="Choose an environment" options={environments} />
    </div>
  );
}
