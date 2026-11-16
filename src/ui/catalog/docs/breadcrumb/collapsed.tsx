import { Breadcrumb } from '../../../components';

export default function BreadcrumbCollapsed() {
  return (
    <Breadcrumb
      maxItems={3}
      items={[
        { label: 'Workspace', href: '#' },
        { label: 'Clients', href: '#' },
        { label: 'Riverside clinic', href: '#' },
        { label: 'Contracts', href: '#' },
        { label: '2026', href: '#' },
        { label: 'Service agreement' },
      ]}
    />
  );
}
