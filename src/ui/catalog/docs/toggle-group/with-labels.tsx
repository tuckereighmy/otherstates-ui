import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupWithLabels() {
  return (
    <ToggleGroup
      aria-label="Layout"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={['list']}
    >
      <ToggleGroupItem id="list">
        <Icon name="list" size={16} />
        List
      </ToggleGroupItem>
      <ToggleGroupItem id="board">
        <Icon name="grid" size={16} />
        Board
      </ToggleGroupItem>
      <ToggleGroupItem id="calendar">
        <Icon name="calendar" size={16} />
        Calendar
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
