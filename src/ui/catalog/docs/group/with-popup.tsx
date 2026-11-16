'use client';

import { Button, Group, OverlayButton, Popover } from '../../../components';

export default function GroupWithPopup() {
  return (
    <Group aria-label="Post">
      <Button appearance="tertiary">Preview</Button>
      <Popover
        trigger={<OverlayButton>Schedule</OverlayButton>}
        title="Schedule post"
        description="It goes live for everyone in the workspace."
        placement="bottom end"
      >
        {close => (
          <Button size="sm" onClick={close}>
            Tomorrow at 9:00
          </Button>
        )}
      </Popover>
    </Group>
  );
}
