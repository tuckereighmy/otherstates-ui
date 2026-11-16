import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const searches = ['Open invoices', 'Overdue invoices', 'Paid this month', 'Drafts'].map(search => ({ id: search.toLowerCase().replace(/ /g, '-'), label: search }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteClearButton() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Search invoices" options={searches} defaultInputValue="Overdue invoices" isClearable />
    </div>
  );
}
