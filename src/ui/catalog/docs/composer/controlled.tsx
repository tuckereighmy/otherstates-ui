'use client';

import { useState } from 'react';
import { Composer } from '../../../components';

export default function ComposerControlled() {
  const [text, setText] = useState('');

  return (
    <Composer
      value={text}
      onChange={setText}
      description={`${text.length} characters`}
      onSubmit={() => setText('')}
    />
  );
}
