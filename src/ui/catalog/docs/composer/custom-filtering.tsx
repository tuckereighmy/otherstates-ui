'use client';

import { Composer } from '../../../components';

const people = [
  { id: 'maya', label: 'Maya Chen', description: 'Design' },
  { id: 'theo', label: 'Theo Park', description: 'Design' },
  { id: 'omar', label: 'Omar Haddad', description: 'Engineering' },
  { id: 'lena', label: 'Lena Fischer', description: 'Finance' },
];

export default function ComposerCustomFiltering() {
  return (
    <Composer
      placeholder="Try @design"
      mentions={people}
      filter={(person, query) => `${person.label} ${person.description}`.toLowerCase().includes(query.toLowerCase())}
      onSubmit={() => {}}
    />
  );
}
