import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const words = [
  'Account', 'Activity', 'Address', 'Agenda', 'Alert', 'Analytics', 'Approval', 'Archive', 'Asset', 'Audit',
  'Backup', 'Balance', 'Billing', 'Board', 'Budget', 'Calendar', 'Campaign', 'Channel', 'Checklist', 'Client',
].map(word => ({ id: word.toLowerCase(), label: word }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteLimit() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Keyword" placeholder="Type a keyword" description="Shows the first five matches." options={words} limit={5} />
    </div>
  );
}
