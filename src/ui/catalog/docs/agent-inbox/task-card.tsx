import * as stylex from '@stylexjs/stylex';
import { AgentTaskCard, Button, Step, Steps } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 380 } });

export default function AgentInboxTaskCard() {
  return (
    <AgentTaskCard
      {...stylex.props(s.box)}
      task={{
        id: 'migrate', title: 'Split the users table', state: 'needs-input', elapsed: '6m 12s',
        agent: { name: 'Data agent', icon: 'layers' },
        detail: (
          <Steps aria-label="Steps so far" density="compact">
            <Step state="done" title="Read the schema" meta="1.4s" />
            <Step state="done" title="Dry run on staging" meta="2m" />
            <Step state="needs-input" title="Run on production" />
          </Steps>
        ),
      }}
      actions={<><Button size="sm" appearance="secondary">Reject</Button><Button size="sm">Approve</Button></>}
    />
  );
}
