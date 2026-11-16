import { Breadcrumb } from '../../../components';

export default function BreadcrumbDefault() {
  return (
    <Breadcrumb
      items={[
        { label: 'Projects', href: '#' },
        { label: 'Website refresh', href: '#' },
        { label: 'Settings' },
      ]}
    />
  );
}
