import * as stylex from '@stylexjs/stylex';
import { Pagination } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], justifyItems: 'center' },
});

export default function PaginationSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Pagination key={size} aria-label={`Pages, size ${size}`} size={size} totalPages={3} defaultPage={2} />
      ))}
    </div>
  );
}
