import * as stylex from '@stylexjs/stylex';
import { Autocomplete } from '../../../components';

const tags = ['Planning', 'Retrospective', 'Roadmap'].map(tag => ({ id: tag.toLowerCase(), label: tag }));

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteInvalid() {
  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete
        label="Tag"
        options={tags}
        defaultInputValue="Planing"
        description="Tags come from your workspace."
        errorMessage="Choose one of the existing tags."
        isInvalid
      />
    </div>
  );
}
