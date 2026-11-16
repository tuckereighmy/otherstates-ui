'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Card, Field, Input } from '../../../components';
import { tokens } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 400, maxWidth: '100%' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: tokens['--os-space-2'], flexGrow: 1 },
});

export default function CardWithForm() {
  return (
    <form {...stylex.props(s.root)} onSubmit={event => event.preventDefault()}>
      <Card
        variant="outline"
        heading="Workspace name"
        description="Shown in the sidebar and in email notifications."
        footer={
          <div {...stylex.props(s.actions)}>
            <Button type="reset" size="sm" appearance="text">Reset</Button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        }
      >
        <Field label="Name">
          <Input name="workspace" defaultValue="Linden studio" />
        </Field>
      </Card>
    </form>
  );
}
