'use client';

import { Composer } from '../../../components';

const mentions = [
  { id: 'maya', label: 'Maya Chen', description: 'Design' },
  { id: 'omar', label: 'Omar Haddad', description: 'Engineering' },
  { id: 'lena', label: 'Lena Fischer', description: 'Finance' },
];

const commands = [
  { id: 'summarize', label: '/summarize', description: 'Summarize the thread' },
  { id: 'todo', label: '/todo', description: 'Turn the message into a task' },
  { id: 'remind', label: '/remind', description: 'Set a reminder for later' },
];

export default function ComposerMentionsAndCommands() {
  return <Composer placeholder="Try @ or /" mentions={mentions} commands={commands} onSubmit={() => {}} />;
}
