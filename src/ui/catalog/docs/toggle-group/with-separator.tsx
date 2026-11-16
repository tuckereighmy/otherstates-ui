import { Icon, ToggleGroup, ToggleGroupItem, ToggleGroupSeparator } from '../../../components';

export default function ToggleGroupWithSeparator() {
  return (
    <ToggleGroup aria-label="Formatting" defaultSelectedKeys={['bold', 'list']}>
      <ToggleGroupItem id="bold" aria-label="Bold"><Icon name="bold" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic"><Icon name="italic" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline"><Icon name="underline" size={16} /></ToggleGroupItem>
      <ToggleGroupSeparator />
      <ToggleGroupItem id="list" aria-label="Bulleted list"><Icon name="list" size={16} /></ToggleGroupItem>
      <ToggleGroupItem id="code" aria-label="Code"><Icon name="code" size={16} /></ToggleGroupItem>
    </ToggleGroup>
  );
}
