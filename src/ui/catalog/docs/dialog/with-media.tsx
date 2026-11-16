'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Dialog, Icon } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  art: {
    display: 'grid', placeItems: 'center', width: '100%', height: '100%',
    backgroundColor: tokens['--os-color-bg-muted'], color: tokens['--os-color-fg-muted'],
  },
});

export default function DialogWithMedia() {
  return (
    <Dialog
      trigger={<Button appearance="tertiary">Send invite</Button>}
      title="Invite sent"
      description="Jonas will get an email with a link to join the workspace."
      media={{ placement: 'thumbnail', content: <div {...stylex.props(s.art)}><Icon name="mail" size={40} /></div> }}
      footer={close => <Button onClick={close}>Done</Button>}
    />
  );
}
