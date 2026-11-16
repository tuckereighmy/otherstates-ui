import * as stylex from '@stylexjs/stylex';
import { Accordion, AccordionGroup } from '../../../components';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
});

export default function AccordionCard() {
  return (
    <div {...stylex.props(s.root)}>
      <AccordionGroup appearance="card" defaultExpandedKeys={['domain']}>
        <Accordion id="domain" title="Connect a custom domain">
          Add a CNAME record that points to your project, then verify it here.
        </Accordion>
        <Accordion id="ssl" title="Certificates">
          Certificates are issued and renewed for every verified domain.
        </Accordion>
        <Accordion id="redirects" title="Redirects">
          Send old paths to new ones with permanent or temporary redirects.
        </Accordion>
      </AccordionGroup>
    </div>
  );
}
