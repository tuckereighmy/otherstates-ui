import * as stylex from '@stylexjs/stylex';
import { Select } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const currencies = [
  { id: 'eur', label: 'Euro' },
  { id: 'usd', label: 'US dollar' },
  { id: 'gbp', label: 'Pound sterling' },
];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], width: 280, maxWidth: '100%' },
});

export default function SelectReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Select label="Billing currency" options={currencies} defaultValue="eur" isReadOnly />
      <Select
        appearance="field"
        label="Billing currency"
        description="Set when the workspace was created."
        options={currencies}
        defaultValue="eur"
        isReadOnly
      />
    </div>
  );
}
