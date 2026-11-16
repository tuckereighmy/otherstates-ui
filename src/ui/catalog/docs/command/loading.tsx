'use client';

import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Command, MenuItem } from '../../../components';

const s = stylex.create({ frame: { width: 'min(100%, 420px)' } });
const customers = ['Aiko Tanaka', 'Bruno Silva', 'Chiara Rossi', 'Dev Patel', 'Elif Kaya'];

export default function CommandLoading() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const id = setTimeout(() => {
      setResults(customers.filter(name => name.toLowerCase().includes(query.toLowerCase())));
      setLoading(false);
    }, 700);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <div {...stylex.props(s.frame)}>
      <Command standalone footer={null} placeholder="Search customers…" inputValue={query} onInputChange={setQuery} isLoading={loading} loadingLabel="Searching…">
        {results.map(name => <MenuItem key={name} id={name}>{name}</MenuItem>)}
      </Command>
    </div>
  );
}
