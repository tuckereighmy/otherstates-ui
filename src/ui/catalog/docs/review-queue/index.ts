import { defineDoc } from '../types';
import Default from './default';
import defaultCode from './default.tsx?raw';

export default defineDoc({
  id: "review-queue",
  title: "Review queue",
  category: 'Agents',
  description: "Work through what agents finished: filter it, pick an item and review it beside the list.",
  source: ["components/review-queue.tsx", "components/agent-status.tsx", "components/badge.tsx", "components/Icon.tsx", "components/internal/agent-parts.tsx", "components/internal/choice.tsx", "components/internal/class-name.ts", "components/internal/control.ts", "components/internal/platform.ts", "components/internal/size.ts", "components/internal/spring.ts", "components/internal/sr-only.tsx", "components/internal/states.ts", "components/internal/surface.ts", "components/progress.tsx", "components/segmented-control.tsx", "tokens.stylex.ts"],
  exports: ["ReviewQueue", "ReviewItem"],
  usage: `import { ReviewQueue } from '@/ui/components';

<ReviewQueue label="Review queue" items={items} renderDetail={item => <Detail item={item} />} />`,
  examples: [
    { id: "default", title: "Default", Component: Default, code: defaultCode, align: "stretch", minHeight: 460 },
  ],
  api: [
    {
      name: "ReviewQueue",
      description: "A queue of agent work to review: filters, progress, a list and the selected item.",
      extends: "<div> attributes",
      props: [
        { name: "label", type: "string", required: true, description: "Names the region and the list." },
        { name: "items", type: "ReviewItem[]", required: true, description: "Each item: `id`, `title`, `textValue`, `kind`, `age`, `risk`, `unsure` and `reviewed`." },
        { name: "selectedId", type: "string | null", description: "The selected item (controlled)." },
        { name: "defaultSelectedId", type: "string", description: "Default: the first item not yet reviewed." },
        { name: "onSelectionChange", type: "(id: string) => void", description: "Called when the selection changes." },
        { name: "renderDetail", type: "(item: ReviewItem) => ReactNode", description: "The selected item's detail, beside the list." },
      ],
    },
  ],
  accessibility: [
    "The list is a single-select listbox: the arrow keys move, typing jumps to an item by its `textValue`.",
    "Reviewed items say \"Reviewed\" to assistive tech, not just with a check.",
    "The filters are a segmented control, and progress is a progress bar with \"3 of 5\" as its value text.",
    "The detail pane moves under the list on narrow screens.",
  ],
});
