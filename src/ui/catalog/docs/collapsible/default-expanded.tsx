import * as stylex from '@stylexjs/stylex';
import { Collapsible } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function CollapsibleDefaultExpanded() {
  return (
    <div {...stylex.props(s.root)}>
      <Collapsible title="Billing contact" defaultExpanded>
        Invoices go to Maya. Change the contact from the Billing page.
      </Collapsible>
    </div>
  );
}
