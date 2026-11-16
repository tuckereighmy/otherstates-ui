import * as stylex from '@stylexjs/stylex';
import { AccordionGroup, AccordionItem, AccordionPanel, AccordionTrigger, Badge } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  trigger: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
  list: { margin: 0, paddingInlineStart: t['--os-space-5'], listStyleType: 'disc' },
});

export default function AccordionCustomContent() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup headingLevel={2} defaultExpandedKeys={['review']}>
        <AccordionItem id="review">
          <AccordionTrigger>
            <span {...stylex.props(s.trigger)}>In review <Badge variant="secondary" size="sm">3</Badge></span>
          </AccordionTrigger>
          <AccordionPanel>
            <ul {...stylex.props(s.list)}>
              <li>Pricing page copy</li>
              <li>Onboarding checklist</li>
              <li>Invoice email template</li>
            </ul>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem id="done">
          <AccordionTrigger>
            <span {...stylex.props(s.trigger)}>Done <Badge variant="secondary" size="sm">12</Badge></span>
          </AccordionTrigger>
          <AccordionPanel>Twelve tasks were closed this week.</AccordionPanel>
        </AccordionItem>
      </AccordionGroup>
    </div>
  );
}
