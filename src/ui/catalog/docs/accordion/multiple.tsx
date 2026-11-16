import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionMultiple() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup allowsMultipleExpanded defaultExpandedKeys={['trial', 'seats']}>
        <Accordion id="trial" title="How long is the trial?">
          Fourteen days with every feature. No card is needed to start.
        </Accordion>
        <Accordion id="seats" title="Do guests count as seats?">
          No. Guests are free and can be invited to as many projects as you like.
        </Accordion>
        <Accordion id="cancel" title="Can I cancel at any time?">
          Yes. Your plan stays active until the end of the billing period.
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
