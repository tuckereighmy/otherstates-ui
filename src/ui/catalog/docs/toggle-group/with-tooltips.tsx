import { Icon, ToggleGroup, ToggleGroupItem, Tooltip } from '../../../components';
import type { IconName } from '../../../components';

const marks: { id: string; label: string; icon: IconName }[] = [
  { id: 'bold', label: 'Bold', icon: 'bold' },
  { id: 'italic', label: 'Italic', icon: 'italic' },
  { id: 'underline', label: 'Underline', icon: 'underline' },
];

export default function ToggleGroupWithTooltips() {
  return (
    <ToggleGroup aria-label="Text style">
      {marks.map(mark => (
        <Tooltip
          key={mark.id}
          trigger={
            <ToggleGroupItem id={mark.id} aria-label={mark.label}>
              <Icon name={mark.icon} size={16} />
            </ToggleGroupItem>
          }
        >
          {mark.label}
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}
