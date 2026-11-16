'use client';

import * as stylex from '@stylexjs/stylex';
import { Field, Input } from '../../../components';

const s = stylex.create({
  root: { width: 320, maxWidth: '100%' },
});

export default function FieldRequired() {
  return (
    <div {...stylex.props(s.root)}>
      <Field
        label="Project name"
        description="Shown in the sidebar and on invoices."
        isRequired
        errorMessage={({ validationDetails }) => validationDetails.valueMissing && 'Enter a project name.'}
      >
        <Input name="project" placeholder="Untitled project" />
      </Field>
    </div>
  );
}
