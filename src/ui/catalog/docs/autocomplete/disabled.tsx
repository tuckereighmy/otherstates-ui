import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const domains = ['example.com', 'example.org', 'example.net'].map(domain => ({ id: domain, label: domain }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Domain" options={domains} defaultInputValue="example.com" isDisabled />
    </div>
  );
}
