import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionDisabled() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup>
        <Accordion id="usage" title="Usage this month">1,240 build minutes of the 3,000 included.</Accordion>
        <Accordion id="invoices" title="Invoices">Download any invoice from the last two years.</Accordion>
        <Accordion id="tax" title="Tax details" isDisabled>Only owners can view tax details.</Accordion>
      </AccordionGroup>
    </div>
  );
}
