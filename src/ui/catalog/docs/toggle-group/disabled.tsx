import { Icon, ToggleGroup, ToggleGroupItem } from '../../../components';

export default function ToggleGroupDisabled() {
  return (
    <ToggleGroup isDisabled aria-label="Text style" defaultSelectedKeys={['bold']}>
      <ToggleGroupItem id="bold" aria-label="Bold">
        <Icon name="bold" size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem id="italic" aria-label="Italic">
        <Icon name="italic" size={16} />
      </ToggleGroupItem>
      <ToggleGroupItem id="underline" aria-label="Underline">
        <Icon name="underline" size={16} />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
