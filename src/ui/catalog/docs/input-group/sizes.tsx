import * as stylex from '@stylexjs/stylex';
import { Icon, Input, InputGroup, InputGroupAddon } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sizes = [
  { size: 'xs', label: 'Extra small, 24 px' },
  { size: 'sm', label: 'Small, 32 px' },
  { size: 'md', label: 'Medium, 40 px' },
  { size: 'lg', label: 'Large, 44 px' },
  { size: 'xl', label: 'Extra large, 48 px' },
] as const;

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 320, maxWidth: '100%' },
});

export default function InputGroupSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(({ size, label }) => (
        <InputGroup key={size} size={size}>
          <InputGroupAddon>
            <Icon name="search" />
          </InputGroupAddon>
          <Input aria-label={label} placeholder={label} />
        </InputGroup>
      ))}
    </div>
  );
}
