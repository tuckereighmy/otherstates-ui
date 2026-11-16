'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Button, Icon, Switch, Tooltip } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({ column: { display: 'grid', justifyItems: 'center', gap: t['--os-space-4'] } });

export default function TooltipControlled() {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  return (
    <div {...stylex.props(s.column)}>
      <Tooltip
        isOpen={open}
        onOpenChange={setOpen}
        isDisabled={!enabled}
        trigger={
          <Button appearance="secondary" leadingIcon={<Icon name="upload" />}>
            Publish
          </Button>
        }
      >
        Publishes to everyone on the team
      </Tooltip>
      <Switch label="Show tooltips" isSelected={enabled} onChange={setEnabled} />
    </div>
  );
}
