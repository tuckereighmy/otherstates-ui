'use client';

import { useState } from 'react';
import { Button } from '../../../components';

export default function ButtonLoading() {
  const [isPublishing, setPublishing] = useState(false);

  function publish() {
    setPublishing(true);
    window.setTimeout(() => setPublishing(false), 2000);
  }

  return (
    <Button isLoading={isPublishing} onClick={publish}>
      Publish release
    </Button>
  );
}
