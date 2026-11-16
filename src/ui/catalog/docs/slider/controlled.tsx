'use client';

import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import { Slider } from '../../../components';

const s = stylex.create({
  root: { width: 280, maxWidth: '100%' },
});

export default function SliderControlled() {
  const [seconds, setSeconds] = useState(30);
  const [saved, setSaved] = useState(30);

  return (
    <div {...stylex.props(s.root)}>
      <Slider
        label="Autosave every"
        value={seconds}
        onChange={value => typeof value === 'number' && setSeconds(value)}
        onChangeEnd={value => typeof value === 'number' && setSaved(value)}
        minValue={5}
        maxValue={120}
        step={5}
        formatOptions={{ style: 'unit', unit: 'second' }}
        description={`Saved setting: ${saved} seconds.`}
      />
    </div>
  );
}
