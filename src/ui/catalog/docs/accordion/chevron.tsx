import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionChevron() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup icon="chevron">
        <Accordion id="profile" title="Profile">Name, photo and the time zone shown to teammates.</Accordion>
        <Accordion id="notifications" title="Notifications">Choose which updates reach you by email.</Accordion>
        <Accordion id="security" title="Security">Passkeys, sessions and two-step sign-in.</Accordion>
      </AccordionGroup>
    </div>
  );
}
