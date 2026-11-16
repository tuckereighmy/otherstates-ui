import * as stylex from '@stylexjs/stylex';
import { ScrollArea } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const notes = [
  'The launch review moves to Thursday so the support team can read the draft first.',
  'Pricing pages stay as they are until the new plans are approved.',
  'Onboarding emails go out in three steps instead of five.',
  'The mobile menu gets a search field at the top.',
  'Exports older than 30 days are removed automatically from now on.',
  'Next check-in is on the first Monday of the month.',
];

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
  text: { display: 'grid', gap: tokens['--os-space-3'], fontSize: tokens['--os-font-size-sm'], lineHeight: tokens['--os-line-height-md'] },
  note: { margin: 0 },
});

export default function ScrollAreaFade() {
  return (
    <div {...stylex.props(s.root)}>
      <ScrollArea aria-label="Meeting notes" fade maxHeight={180} padding={16}>
        <div {...stylex.props(s.text)}>
          {notes.map(note => <p key={note} {...stylex.props(s.note)}>{note}</p>)}
        </div>
      </ScrollArea>
    </div>
  );
}
