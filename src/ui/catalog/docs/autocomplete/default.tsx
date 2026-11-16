import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Lisbon', 'Madrid', 'Oslo', 'Prague', 'Vienna']
  .map(city => ({ id: city.toLowerCase(), label: city }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Office" placeholder="Search cities" options={cities} />
    </div>
  );
}
