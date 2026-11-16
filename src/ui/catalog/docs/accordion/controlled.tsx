'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Accordion, AccordionGroup, Button } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const sections = ['schedule', 'alerts', 'retention'];

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-3'], width: 360, maxWidth: '100%' },
  actions: { display: 'flex', gap: t['--os-space-2'] },
});

export default function AccordionControlled() {
  const [expandedKeys, setExpandedKeys] = useState(new Set<string | number>(['schedule']));

  return (
    <div {...stylex.props(s.root)}>
      <div {...stylex.props(s.actions)}>
        <Button appearance="tertiary" size="sm" onClick={() => setExpandedKeys(new Set(sections))}>Expand all</Button>
        <Button appearance="tertiary" size="sm" onClick={() => setExpandedKeys(new Set())}>Collapse all</Button>
      </div>
      <AccordionGroup allowsMultipleExpanded expandedKeys={expandedKeys} onExpandedChange={setExpandedKeys}>
        <Accordion id="schedule" title="Backup schedule">Every night at 02:00 in the workspace time zone.</Accordion>
        <Accordion id="alerts" title="Failure alerts">Owners get an email when a backup fails twice in a row.</Accordion>
        <Accordion id="retention" title="Retention">Daily backups are kept for 30 days, monthly ones for a year.</Accordion>
      </AccordionGroup>
    </div>
  );
}
