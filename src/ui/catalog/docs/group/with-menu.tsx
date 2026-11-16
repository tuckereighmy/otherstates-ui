import { Button, Group, Icon, Menu, MenuItem, OverlayButton } from '../../../components';

export default function GroupWithMenu() {
  return (
    <Group aria-label="Deploy">
      <Button appearance="tertiary">Deploy</Button>
      <Menu
        aria-label="More deploy options"
        placement="bottom end"
        trigger={
          <OverlayButton aria-label="More deploy options">
            <Icon name="chevron-down" size={16} />
          </OverlayButton>
        }
      >
        <MenuItem>Deploy to staging</MenuItem>
        <MenuItem>Deploy to a preview</MenuItem>
        <MenuItem>Schedule a deploy</MenuItem>
      </Menu>
    </Group>
  );
}
