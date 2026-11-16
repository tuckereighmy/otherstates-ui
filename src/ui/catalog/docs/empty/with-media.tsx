import * as stylex from '@stylexjs/stylex';
import { AvatarGroup, Button, Empty } from '../../../components';

const s = stylex.create({
  root: { width: 380, maxWidth: '100%' },
});

export default function EmptyWithMedia() {
  return (
    <div {...stylex.props(s.root)}>
      <Empty
        media={
          <AvatarGroup
            label="Suggested teammates"
            size="sm"
            items={[
              { name: 'Ines Okafor', fallback: 'gradient' },
              { name: 'Tomas Berg', fallback: 'gradient' },
              { name: 'Mei Tanaka', fallback: 'gradient' },
            ]}
          />
        }
        heading="Invite your team"
        description="Projects are better with a few more people."
        action={
          <>
            <Button appearance="tertiary" size="sm">Copy invite link</Button>
            <Button size="sm">Invite</Button>
          </>
        }
      />
    </div>
  );
}
