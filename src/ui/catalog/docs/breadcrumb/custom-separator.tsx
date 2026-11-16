import { Breadcrumb, Icon } from '../../../components';

export default function BreadcrumbCustomSeparator() {
  return (
    <Breadcrumb
      separator={<Icon name="chevron-right" />}
      items={[
        { label: 'Workspace', href: '#' },
        { label: 'Billing', href: '#' },
        { label: 'Invoices' },
      ]}
    />
  );
}
