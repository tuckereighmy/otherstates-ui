import * as stylex from '@stylexjs/stylex';
import { Autocomplete, Icon } from '../../../components';

const pages = ['Getting started', 'Billing settings', 'Team members', 'Integrations', 'Security']
  .map(page => ({ id: page.toLowerCase().replace(/ /g, '-'), label: page }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteStartAddon() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Search help" hideLabel placeholder="Search help" options={pages} startAddon={<Icon name="search" size={16} />} />
    </div>
  );
}
