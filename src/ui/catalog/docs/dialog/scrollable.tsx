'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Dialog } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  note: { margin: 0, color: tokens['--os-color-fg-muted'] },
});

const notes = [
  'Projects open twice as fast in large workspaces, because lists now load in pages.',
  'Invoices can be exported as one archive, with a summary sheet for each month.',
  'Comments keep their place when a file is renamed or moved to another folder.',
  'Each deployment shows the change that triggered it and who approved it.',
  'Team settings include a default time zone for due dates and reminders.',
  'Search matches note titles before their contents, so the right note comes first.',
  'Archived projects can be restored for 30 days from the project list.',
  'Keyboard focus returns to the list when a dialog or sheet closes.',
  'Members can leave a workspace from their profile without asking an owner.',
  'Exports include the name of the person who ran them and the time they finished.',
  'The activity feed groups changes made within a minute into a single entry.',
  'Billing emails go to every workspace owner instead of the first one only.',
  'Shared links can expire after a day, a week or a month.',
  'Notes keep their formatting when pasted into a project description.',
];

export default function DialogScrollable() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">What’s new</Button>}
      title="What’s new in 4.2"
      description="Fourteen changes since the last release."
      footer={close => <Button onClick={close}>Got it</Button>}
    >
      {notes.map(note => <p key={note} {...stylex.props(s.note)}>{note}</p>)}
    </Dialog>
  );
}
