'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Empty, Icon } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function EmptyNoResults() {
  const [query, setQuery] = useState('quarterly report');

  return (
    <div {...stylex.props(s.root)}>
      <Empty
        icon={<Icon name="search" />}
        heading={query ? `No results for “${query}”` : 'Search your notes'}
        description={query ? 'Check the spelling or try fewer words.' : 'Type a word from the title or body.'}
        action={
          query ? (
            <Button appearance="secondary" size="sm" onClick={() => setQuery('')}>
              Clear search
            </Button>
          ) : null
        }
      />
    </div>
  );
}
