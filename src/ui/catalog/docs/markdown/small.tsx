import * as stylex from '@stylexjs/stylex';
import { Markdown } from '../../../components';

const s = stylex.create({ box: { width: '100%', maxWidth: 360, marginInline: 'auto' } });

export default function MarkdownSmall() {
  return <Markdown {...stylex.props(s.box)} size="sm">{'**Next steps**\n\n1. Deploy to staging\n2. Check an empty cart\n3. Ship to production'}</Markdown>;
}
