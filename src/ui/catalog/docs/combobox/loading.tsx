import * as stylex from '@stylexjs/stylex';
import { Combobox } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function ComboboxLoading() {
  return (
    <div {...stylex.props(s.root)}>
      <Combobox label="Repository" placeholder="Choose a repository" options={[]} isLoading loadingMessage="Loading repositories…" />
    </div>
  );
}
