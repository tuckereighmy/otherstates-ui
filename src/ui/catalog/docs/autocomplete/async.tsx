'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Autocomplete } from '../../../components';

const directory = ['Ada', 'Alma', 'Arlo', 'Bea', 'Cyrus', 'Dalia', 'Elio', 'Freya', 'Gus', 'Hana', 'Ines', 'Jun'];

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function AutocompleteAsync() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const matches = directory.filter(name => name.toLowerCase().includes(query.toLowerCase()));
      setResults(matches.map(name => ({ id: name.toLowerCase(), label: name })));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div {...stylex.props(s.root)}>
      <Autocomplete label="Invite" placeholder="Search the directory" options={results} isLoading={loading}
        inputValue={query} onInputChange={setQuery} emptyMessage="No one by that name" />
    </div>
  );
}
