import * as stylex from '@stylexjs/stylex';
import { Markdown } from '../../../components';

const reply = `The empty cart crashed because \`summary()\` read \`cart.total\` first.

**Fixed by**
- returning an empty summary for an empty cart
- adding two tests

\`\`\`ts
if (!cart || cart.items.length === 0) return emptySummary;
\`\`\`

| Check | Result |
| --- | --- |
| Unit tests | 214 passed |
| Type check | Clean |`;

const s = stylex.create({ box: { width: '100%', maxWidth: 560, marginInline: 'auto' } });

export default function MarkdownDefault() {
  return <Markdown {...stylex.props(s.box)}>{reply}</Markdown>;
}
