'use client';

import { useState } from 'react';
import { Composer, Icon, type ComposerAttachment } from '../../../components';

const initial: ComposerAttachment[] = [
  { id: 'budget', name: 'Q3 budget.xlsx' },
  { id: 'photos', name: 'Site photos.zip', icon: <Icon name="image" /> },
];

export default function ComposerAttachments() {
  const [files, setFiles] = useState(initial);

  return (
    <Composer
      placeholder="Add a message"
      attachments={files}
      onAttach={() => setFiles(list => [...list, { id: `notes-${list.length}`, name: 'Meeting notes.pdf' }])}
      onRemoveAttachment={id => setFiles(list => list.filter(file => file.id !== id))}
      onSubmit={() => setFiles([])}
    />
  );
}
