'use client';

import * as stylex from '@stylexjs/stylex';
import { CheckpointList, type Checkpoint } from '../../../components';

const checkpoints: Checkpoint[] = [
  { id: 'c1', label: 'Before "Read the bug report"', time: '2:02 PM', undoes: { files: 4, messages: 6 } },
  { id: 'c2', label: 'Before "Guard the empty cart"', time: '2:09 PM', undoes: { files: 3, messages: 3 } },
  { id: 'c3', label: 'Before "Update the pricing copy"', time: '2:14 PM', undoes: { files: 1, messages: 1 } },
  { id: 'c4', label: 'Latest', time: '2:16 PM' },
];

const s = stylex.create({ box: { width: '100%', maxWidth: 440 } });

export default function CheckpointsDefault() {
  return <CheckpointList {...stylex.props(s.box)} checkpoints={checkpoints} onRestore={() => {}} />;
}
