import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const languages = ['Danish', 'Dutch', 'English', 'Finnish', 'French', 'German', 'Italian', 'Norwegian', 'Spanish', 'Swedish']
  .map(name => ({ id: name.toLowerCase(), label: name }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxAutoHighlight() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Language" placeholder="Type a language" options={languages} autoHighlight />
    </div>
  );
}
