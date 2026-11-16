import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const commands = ['Archive note', 'Assign to me', 'Copy link', 'Duplicate note', 'Move to project', 'Pin to top']
  .map(command => ({ id: command.toLowerCase().replace(/ /g, '-'), label: command }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteInlineComplete() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Action" placeholder="Type an action" options={commands} inlineComplete />
    </div>
  );
}
