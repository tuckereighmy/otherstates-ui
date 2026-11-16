import { Badge, Icon } from '../../../components';

export default function BadgeWithLink() {
  return (
    <Badge href="#" variant="outline" icon={<Icon name="tag" />}>
      Release 2.4
    </Badge>
  );
}
