import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const fruits = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Cherry', 'Fig', 'Grape', 'Lemon', 'Mango', 'Peach']
  .map(fruit => ({ id: fruit.toLowerCase(), label: fruit }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteAutoHighlight() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Snack" placeholder="Type a fruit" options={fruits} autoHighlight />
    </div>
  );
}
