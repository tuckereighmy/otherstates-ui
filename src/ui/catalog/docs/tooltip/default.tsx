import { Button, Icon, Tooltip } from '../../../components';

export default function TooltipDefault() {
  return (
    <Tooltip
      trigger={
        <Button appearance="secondary" iconOnly aria-label="Copy link">
          <Icon name="link" />
        </Button>
      }
    >
      Copy link
    </Tooltip>
  );
}
