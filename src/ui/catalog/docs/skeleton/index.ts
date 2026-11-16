import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Shapes from './shapes';
import shapesCode from './shapes.tsx?raw';
import TextLines from './text-lines';
import textLinesCode from './text-lines.tsx?raw';
import CustomSize from './custom-size';
import customSizeCode from './custom-size.tsx?raw';
import LoadingList from './loading-list';
import loadingListCode from './loading-list.tsx?raw';
import Reveal from './reveal';
import revealCode from './reveal.tsx?raw';

export default defineDoc({
  id: 'skeleton',
  title: 'Skeleton',
  category: 'Feedback',
  description: 'Reserve space while content loads.',
  source: ['components/skeleton.tsx', 'tokens.stylex.ts'],
  exports: ['Skeleton', 'SkeletonReveal'],
  usage: `import { Skeleton } from '@/ui/components';

<div aria-busy="true">
  <Skeleton shape="circle" />
  <Skeleton width="40%" />
  <Skeleton lines={2} />
</div>`,
  examples: [
    { id: 'default', title: 'Default', Component: Default, code: defaultCode, stage: 'canvas' },
    {
      id: 'shapes',
      title: 'Shapes',
      description: 'Images, circles, text lines and pills: the placeholders on their own, before any content arrives.',
      Component: Shapes,
      code: shapesCode,
      stage: 'canvas',
      minHeight: 400,
    },
    {
      id: 'text-lines',
      title: 'Text lines',
      description: '`lines` draws a paragraph: 14px bars on 20px lines, the last one shorter.',
      Component: TextLines,
      code: textLinesCode,
      stage: 'canvas',
    },
    {
      id: 'custom-size',
      title: 'Width, height and radius',
      description: 'Any width and height in px or CSS units, and a radius token or px value.',
      Component: CustomSize,
      code: customSizeCode,
      stage: 'canvas',
      minHeight: 320,
    },
    {
      id: 'loading-list',
      title: 'Swap for content',
      description: 'Render placeholders in place of the content and mark the container `aria-busy` until it arrives.',
      Component: LoadingList,
      code: loadingListCode,
      stage: 'canvas',
    },
    {
      id: 'reveal',
      title: 'Reveal content',
      description: '`SkeletonReveal` keeps the real content in layout and grows each bar into it when `ready` turns true.',
      Component: Reveal,
      code: revealCode,
      minHeight: 320,
    },
  ],
  api: [
    {
      name: 'Skeleton',
      description: 'A breathing placeholder in the track color. Hidden from assistive tech.',
      extends: '<span> attributes',
      props: [
        { name: 'shape', type: "'rectangle' | 'circle' | 'image'", default: "'rectangle'", description: 'A block or text line, a circle, or a fluid image box with an aspect ratio.' },
        { name: 'width', type: 'number | string', default: "'100%'", description: 'Width in px or any CSS length. A circle defaults to its `size`.' },
        { name: 'height', type: 'number | string', description: 'Height in px or any CSS length. Without it a rectangle is one 20px text line drawn as a 14px bar.' },
        { name: 'radius', type: "'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | number", default: "'sm'", description: 'A radius token or px value. Circles are `full`.' },
        { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: 'Circle diameter, matching Avatar: 24, 32, 44, 48, 64 or 80 px. The old rectangle presets (`display`, `heading`, `body`, `button`) still work but are deprecated.' },
        { name: 'ratio', type: "'1:1' | '3:2' | '2:3' | '4:3' | '3:4' | '5:4' | '4:5' | '16:9' | '9:16'", default: "'16:9'", description: 'Aspect ratio of an `image` placeholder.' },
        { name: 'lines', type: 'number', description: 'Draws this many text lines; the last of several is 60% wide.' },
      ],
    },
    {
      name: 'SkeletonReveal',
      description: 'Holds real content in place while placeholder bars cover it, then grows the bars into the content and fades them.',
      extends: '<div> attributes',
      props: [
        { name: 'ready', type: 'boolean', required: true, description: 'Set to true when the content has loaded.' },
        { name: 'children', type: 'ReactNode', required: true, description: 'The real content. It keeps its layout while hidden, so nothing shifts.' },
        { name: 'blocks', type: '{ width: number | string; height: number | string; top?: number; radius?: number | string }[]', default: "[{ width: '100%', height: 14, top: 3 }]", description: 'Bars over the content box; the radius defaults to `radius-sm`.' },
        { name: 'order', type: 'number', default: '0', description: 'Step in a staged reveal; each step waits `stagger` ms.' },
        { name: 'stagger', type: 'number', default: '160', description: 'Delay between reveal steps in ms.' },
        { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretches the wrapper to its container instead of fitting the content.' },
      ],
    },
  ],
  accessibility: [
    'Placeholders are `aria-hidden`. Set `aria-busy="true"` on the region that is loading and remove it when the content arrives.',
    'If loading takes more than a moment, add a visually hidden status message such as "Loading notes".',
    'SkeletonReveal marks its wrapper `aria-busy` and makes the hidden content `inert` until `ready`, so nothing unseen takes focus.',
    'Under reduced motion the fill stops breathing, and SkeletonReveal only fades.',
  ],
});
