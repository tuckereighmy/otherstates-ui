import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';
import Marker from './marker';
import markerCode from './marker.tsx?raw';

export default defineDoc({
  id: "checkpoints",
  title: "Checkpoints",
  category: 'Agents',
  description: "Let a person go back to before an agent step, after saying exactly what that undoes.",
  source: ["components/checkpoints.tsx", "components/agent-format.ts", "components/alert-dialog.tsx", "components/button.tsx", "components/card.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/class-name.ts", "components/internal/overlay.tsx", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/states.ts", "components/internal/surface.ts", "tokens.stylex.ts"],
  exports: ["CheckpointList", "CheckpointMarker", "Checkpoint", "describeUndo"],
  usage: `import { CheckpointList } from '@/ui/components';

<CheckpointList checkpoints={checkpoints} onRestore={restore} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, minHeight: 360 },
    { id: "marker", title: "In a thread", description: "`CheckpointMarker` sits between two messages: a hairline, the label and Restore, which asks first.", Component: Marker, code: markerCode, align: "stretch", minHeight: 220 },
  ],
  api: [
    {
      name: "CheckpointList",
      description: "A run's restore points, oldest first; the last is the present.",
      extends: "Card props (without heading, description, action, footer)",
      props: [
        { name: "checkpoints", type: "Checkpoint[]", required: true, description: "Each checkpoint: `id`, `label`, `textLabel`, `time` and `undoes` (`files`, `messages`)." },
        { name: "onRestore", type: "(id: string) => void | Promise<unknown>", required: true, description: "Restores after the person confirms. Return a promise to keep the dialog open until it settles." },
        { name: "title", type: "ReactNode", default: "'Checkpoints'", description: "The card title." },
      ],
    },
    {
      name: "CheckpointMarker",
      description: "A restore point between two messages in a thread.",
      extends: "<div> attributes",
      props: [
        { name: "checkpoint", type: "Checkpoint", required: true, description: "The restore point." },
        { name: "onRestore", type: "(id: string) => void | Promise<unknown>", description: "Adds Restore, after a confirmation." },
      ],
    },
  ],
  accessibility: [
    "Restore always opens an alert dialog that says what it undoes; nothing is lost on one click.",
    "Each Restore button is named after its checkpoint (\"Restore to Before ...\").",
    "The present checkpoint is marked `aria-current` and has no Restore.",
    "A marker is a named group, so its Restore button stays reachable.",
  ],
});
