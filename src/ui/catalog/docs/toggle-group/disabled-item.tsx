import { ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupDisabledItem() {
  return (
    <ToggleGroup
      aria-label="Report period"
      selectionMode="single"
      disallowEmptySelection
      defaultSelectedKeys={['month']}
    >
      <ToggleGroupItem id="week">Week</ToggleGroupItem>
      <ToggleGroupItem id="month">Month</ToggleGroupItem>
      <ToggleGroupItem id="quarter">Quarter</ToggleGroupItem>
      <ToggleGroupItem id="year" isDisabled>Year</ToggleGroupItem>
    </ToggleGroup>
  );
}
