import * as stylex from '@stylexjs/stylex';
import { Button, Group, GroupText, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const sizes = ['sm', 'md', 'lg'] as const;

const s = stylex.create({
  root: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: tokens['--os-space-4'] },
});

export default function GroupSizes() {
  return (
    <div {...stylex.props(s.root)}>
      {sizes.map(size => (
        <Group key={size} size={size} aria-label={`Zoom, size ${size}`}>
          <Button size={size} appearance="text" iconOnly aria-label="Zoom out">
            <Icon name="minus" />
          </Button>
          <GroupText>100%</GroupText>
          <Button size={size} appearance="text" iconOnly aria-label="Zoom in">
            <Icon name="plus" />
          </Button>
        </Group>
      ))}
    </div>
  );
}
