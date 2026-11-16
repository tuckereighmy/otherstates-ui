'use client';

import { Composer } from '../../../components';

const agenda = 'Agenda for Thursday:\n1. Review the launch checklist\n2. Confirm the room booking\n3. Assign follow-ups\n4. Share the notes';

export default function ComposerMaxRows() {
  return <Composer maxRows={3} defaultValue={agenda} onSubmit={() => {}} />;
}
