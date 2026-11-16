'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Composer, type ComposerQueued } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  column: { display: 'grid', gap: t['--os-space-3'], width: '100%', maxWidth: 440 },
  log: { margin: 0, color: t['--os-color-fg-muted'], fontSize: t['--os-font-size-caption'] },
});

export default function ComposerRunControls() {
  const [running, setRunning] = useState(true);
  const [queued, setQueued] = useState<ComposerQueued[]>([{ id: 'q1', text: 'Then update the changelog' }]);
  const [log, setLog] = useState('The agent is running.');
  return (
    <div {...stylex.props(s.column)}>
      <Composer
        fullWidth
        status={running ? 'streaming' : 'idle'}
        placeholder={running ? 'Steer the agent, or queue what is next…' : 'Ask anything…'}
        onSubmit={message => { setLog(`Sent: ${message}`); setRunning(true); }}
        onSteer={message => setLog(`Steered with: ${message}`)}
        onQueue={message => setQueued(all => [...all, { id: String(Date.now()), text: message }])}
        queued={queued}
        onRemoveQueued={id => setQueued(all => all.filter(item => item.id !== id))}
        onSendQueuedNow={id => { setLog(`Steered with: ${queued.find(item => item.id === id)?.text}`); setQueued(all => all.filter(item => item.id !== id)); }}
        onStop={() => { setRunning(false); setLog('Stopped.'); }}
      />
      <p role="status" {...stylex.props(s.log)}>{log}</p>
      {!running && <Button size="sm" appearance="secondary" onClick={() => setRunning(true)}>Start the run again</Button>}
    </div>
  );
}
