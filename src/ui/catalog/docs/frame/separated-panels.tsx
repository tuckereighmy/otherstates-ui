import * as stylex from '@stylexjs/stylex';
import { Frame, FramePanel } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const environments = [
  { name: 'Production', detail: 'Deployed 2 hours ago by Priya' },
  { name: 'Staging', detail: 'Deployed 25 minutes ago by Tomas' },
  { name: 'Preview', detail: 'Four open branches' },
];

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
  name: { fontWeight: tokens['--os-font-weight-medium'] },
  detail: { color: tokens['--os-color-fg-muted'] },
});

export default function FrameSeparatedPanels() {
  return (
    <div {...stylex.props(s.root)}>
      <Frame title="Environments">
        {environments.map(environment => (
          <FramePanel key={environment.name}>
            <div {...stylex.props(s.name)}>{environment.name}</div>
            <div {...stylex.props(s.detail)}>{environment.detail}</div>
          </FramePanel>
        ))}
      </Frame>
    </div>
  );
}
