import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const countries = [
  'Argentina', 'Australia', 'Austria', 'Belgium', 'Brazil', 'Canada', 'Chile', 'Denmark', 'Finland', 'France',
  'Germany', 'Iceland', 'Ireland', 'Italy', 'Japan', 'Kenya', 'Mexico', 'Netherlands', 'Norway', 'Portugal',
].map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SelectSearchable() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox
        inputPlacement="popup"
        label="Country"
        placeholder="Choose a country"
        searchPlaceholder="Search countries"
        options={countries}
      />
    </div>
  );
}
