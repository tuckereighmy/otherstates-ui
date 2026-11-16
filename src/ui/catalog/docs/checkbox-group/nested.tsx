'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../../../components';

const s = stylex.create({
  // os-allow raw-space: lines children up under the parent's label (18px box + 12px gap), not a layout space
  indent: { paddingInlineStart: 30 },
  // os-allow raw-space: two levels of the same label indent
  nestedIndent: { paddingInlineStart: 60 },
});

const mobile = ['ios', 'android'];
const all = ['web', ...mobile, 'desktop'];

export default function CheckboxGroupNested() {
  const [value, setValue] = useState(['ios']);
  const count = (ids: string[]) => ids.filter(id => value.includes(id)).length;
  const toggle = (ids: string[], on: boolean) =>
    setValue(on ? [...new Set([...value, ...ids])] : value.filter(id => !ids.includes(id)));
  const parentState = (ids: string[]) => ({
    isSelected: count(ids) === ids.length,
    isIndeterminate: count(ids) > 0 && count(ids) < ids.length,
    onChange: (on: boolean) => toggle(ids, on),
  });

  return (
    <CheckboxGroup label="Release to" value={value} onChange={setValue}>
      <Checkbox label="All platforms" {...parentState(all)} />
      <Checkbox value="web" label="Web" {...stylex.props(s.indent)} />
      <Checkbox label="Mobile" {...parentState(mobile)} {...stylex.props(s.indent)} />
      <Checkbox value="ios" label="iOS" {...stylex.props(s.nestedIndent)} />
      <Checkbox value="android" label="Android" {...stylex.props(s.nestedIndent)} />
      <Checkbox value="desktop" label="Desktop" {...stylex.props(s.indent)} />
    </CheckboxGroup>
  );
}
