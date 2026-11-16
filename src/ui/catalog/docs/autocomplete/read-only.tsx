import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const cities = ['Lisbon', 'Porto', 'Faro'].map(city => ({ id: city.toLowerCase(), label: city }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteReadOnly() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Billing city" options={cities} defaultInputValue="Lisbon" isReadOnly />
    </div>
  );
}
