import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const timezones = [
  'Auckland', 'Berlin', 'Buenos Aires', 'Cairo', 'Chicago', 'Denver', 'Dubai', 'Helsinki', 'Jakarta', 'Lagos',
  'Lima', 'Lisbon', 'Mumbai', 'Nairobi', 'Seoul', 'Singapore', 'Sydney', 'Toronto', 'Vancouver', 'Warsaw',
].map(city => ({ id: city.toLowerCase().replace(' ', '-'), label: city }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxPopupInput() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        inputPlacement="popup"
        label="Time zone"
        placeholder="Choose a city"
        searchPlaceholder="Search cities"
        options={timezones}
      />
    </div>
  );
}
