import { Breadcrumb, Icon } from '../../../components';

export default function BreadcrumbWithIcons() {
  return (
    <Breadcrumb
      items={[
        { label: 'Home', href: '#', icon: <Icon name="home" /> },
        { label: 'Shared files', href: '#', icon: <Icon name="folder" /> },
        { label: 'Floor plan.pdf', icon: <Icon name="file" /> },
      ]}
    />
  );
}
