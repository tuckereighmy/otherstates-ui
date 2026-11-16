import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const members = ['Ada', 'Bruno', 'Chiara', 'Dev', 'Elif', 'Farid', 'Greta', 'Hiro', 'Ines'];

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: tokens['--os-space-4'] },
  area: { width: 200 },
  row: {
    display: 'flex', justifyContent: 'space-between', height: 36, alignItems: 'center', paddingInline: tokens['--os-space-3'],
    fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'],
  },
  meta: { color: tokens['--os-color-fg-muted'] },
});

function Members({ label, names }: { label: string; names: string[] }) {
  return (
    <ScrollArea aria-label={label} maxHeight={156} padding={6} {...stylex.props(s.area)}>
      {names.map(name => (
        <div key={name} {...stylex.props(s.row)}>{name}<span {...stylex.props(s.meta)}>Editor</span></div>
      ))}
    </ScrollArea>
  );
}

export default function ScrollAreaGutter() {
  return (
    <div {...stylex.props(s.root)}>
      <Members label="Design team" names={members.slice(0, 3)} />
      <Members label="Whole workspace" names={members} />
    </div>
  );
}
