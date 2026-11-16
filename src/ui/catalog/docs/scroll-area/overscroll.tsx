import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const steps = ['Draft', 'Review', 'Legal check', 'Design pass', 'Translation', 'Scheduled', 'Published', 'Archived'];

const modes = [
  { overscroll: 'contain', label: 'Stops at the end' },
  { overscroll: 'auto', label: 'Then scrolls the page' },
] as const;

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: tokens['--os-space-4'] },
  area: { width: 200 },
  label: { margin: 0, paddingInline: tokens['--os-space-3'], paddingBlock: tokens['--os-space-1'], color: tokens['--os-color-fg-muted'], fontSize: tokens['--os-font-size-xs'], lineHeight: tokens['--os-line-height-xs'] },
  row: { display: 'flex', alignItems: 'center', height: 36, paddingInline: tokens['--os-space-3'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
});

export default function ScrollAreaOverscroll() {
  return (
    <div {...stylex.props(s.root)}>
      {modes.map(({ overscroll, label }) => (
        <ScrollArea key={overscroll} aria-label={label} overscroll={overscroll} maxHeight={150} padding={6} {...stylex.props(s.area)}>
          <p {...stylex.props(s.label)}>{label}</p>
          {steps.map(step => <div key={step} {...stylex.props(s.row)}>{step}</div>)}
        </ScrollArea>
      ))}
    </div>
  );
}
