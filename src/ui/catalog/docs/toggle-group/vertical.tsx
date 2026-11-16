import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupVertical() {
  return (
    <ToggleGroup
      orientation="vertical"
      aria-label="Panel position"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={['left']}
    >
      <ToggleGroupItem id="left">
        <Icon name="panel-left" size={16} />
        Left
      </ToggleGroupItem>
      <ToggleGroupItem id="right">
        <Icon name="panel-right" size={16} />
        Right
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
