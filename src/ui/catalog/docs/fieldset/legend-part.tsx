import * as stylex from '@stylexjs/stylex';
import { Badge, Field, Fieldset, FieldsetLegend, Input } from '../../../components';
import { tokens as t } from '../../../tokens.stylex';

const s = stylex.create({
  root: { width: 360, maxWidth: '100%' },
  legend: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
});

export default function FieldsetLegendPart() {
  return (
    <div {...stylex.props(s.root)}>
      <Fieldset description="Used to sign webhook requests.">
        <FieldsetLegend {...stylex.props(s.legend)}>
          Signing secret <Badge variant="secondary" size="sm">Beta</Badge>
        </FieldsetLegend>
        <Field label="Secret">
          <Input name="secret" defaultValue="4f9a 21c7 9be0 1d55" isReadOnly />
        </Field>
      </Fieldset>
    </div>
  );
}
