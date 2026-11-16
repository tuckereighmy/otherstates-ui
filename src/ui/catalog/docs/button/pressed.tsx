'use client';

import { useState } from 'react';
import { Button, Icon } from '../../../components';

export default function ButtonPressed() {
  const [isWatching, setWatching] = useState(false);

  return (
    <Button
      appearance="tertiary"
      aria-pressed={isWatching}
      leadingIcon={<Icon name="bell" />}
      onClick={() => setWatching(value => !value)}
    >
      Watch deployments
    </Button>
  );
}
