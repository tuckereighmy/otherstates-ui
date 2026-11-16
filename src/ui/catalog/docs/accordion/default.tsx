import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionDefault() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup defaultExpandedKeys={['access']}>
        <Accordion id="access" title="Who can see a workspace?">
          Only the people you invite. Guests see just the projects you share.
        </Accordion>
        <Accordion id="roles" title="Can roles be changed later?">
          Owners and admins can change any role from the Members page.
        </Accordion>
        <Accordion id="archive" title="Where do archived files go?">
          They move to the Archive, stay searchable, and can be restored.
        </Accordion>
        <Accordion id="export" title="How do I export my data?">
          Request an export in Settings and a download link arrives by email.
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
