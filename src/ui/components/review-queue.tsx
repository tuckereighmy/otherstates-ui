'use client';

import * as stylex from '@stylexjs/stylex';
import { useMemo, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { ListBox, ListBoxItem } from 'react-aria-components';
import { tokens as t } from '../tokens.stylex';
import { RiskBadge, type RiskLevel } from './agent-status';
import { Icon } from './Icon';
import { cardStyles as c } from './internal/agent-parts';
import { withStyles } from './internal/class-name';
import { SrOnly } from './internal/sr-only';
import { focusStyles, transitionStyles } from './internal/states';
import { Progress } from './progress';
import { SegmentedControl } from './segmented-control';

// Everything agents finished that a person should look at, oldest first (spec 1.19). The list sits beside
// the selected item, filters cut it to what is risky or what the agent was unsure of, and the count of
// what is reviewed stays in view.

export type ReviewItem = {
  id: string;
  title: ReactNode;
  /** A text version of the title, for typeahead and the accessible name. */
  textValue: string;
  /** "Code change", "Refund", "Contract clause". */
  kind: ReactNode;
  /** "28m". */
  age?: ReactNode;
  risk?: RiskLevel;
  /** The agent flagged its own confidence as low. */
  unsure?: boolean;
  reviewed?: boolean;
};

const s = stylex.create({
  root: { display: 'grid', gap: t['--os-space-4'], minWidth: 0 },
  head: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: t['--os-space-4'] },
  progress: { flex: '1 1 200px', minWidth: 0 },
  panes: { display: 'grid', gap: t['--os-space-4'], gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', alignItems: 'start' },
  list: { display: 'grid', gap: t['--os-space-0-5'], margin: 0, padding: 0, outlineStyle: 'none', minWidth: 0 },
  /** A list row of two lines: 48 tall, 12 in from the side; the open item is the current location (spec 1.8). */
  item: {
    display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', columnGap: t['--os-space-3'],
    boxSizing: 'border-box', minHeight: t['--os-size-xl'], paddingBlock: t['--os-space-1'], paddingInline: t['--os-space-3'],
    borderRadius: t['--os-radius-md'], cursor: 'pointer', outlineStyle: 'none', backgroundColor: 'transparent',
  },
  hover: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  selected: { backgroundColor: t['--os-color-bg-interactive-primary'] },
  selectedHover: { backgroundColor: t['--os-color-bg-interactive-secondary'] },
  titleDone: { color: t['--os-color-fg-muted'], fontWeight: t['--os-font-weight-regular'] },
  meta: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
  end: { display: 'flex', alignItems: 'center', gap: t['--os-space-2'] },
  check: { display: 'flex', color: t['--os-color-fg-success'] },
  empty: { paddingBlock: t['--os-space-2'], paddingInline: t['--os-space-3'] },
  detail: { minWidth: 0 },
});

type Filter = 'all' | 'risky' | 'unsure';

export type ReviewQueueProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ref?: Ref<HTMLDivElement>;
  /** Names the queue: "Review queue". */
  label: string;
  items: ReviewItem[];
  selectedId?: string | null;
  /** Default: the first item not yet reviewed. */
  defaultSelectedId?: string;
  onSelectionChange?: (id: string) => void;
  /** The selected item's detail, beside the list. */
  renderDetail?: (item: ReviewItem) => ReactNode;
};

/** A queue of agent work to review: filters, progress, a list and the selected item. */
export function ReviewQueue({ label, items, selectedId, defaultSelectedId, onSelectionChange, renderDetail, className, style, ref, ...props }: ReviewQueueProps) {
  const [filter, setFilter] = useState<Filter>('all');
  const [own, setOwn] = useState<string | undefined>(defaultSelectedId ?? items.find(item => !item.reviewed)?.id);
  const current = selectedId === undefined ? own : selectedId ?? undefined;
  const visible = useMemo(() => items.filter(item => filter === 'all' || (filter === 'risky' ? item.risk === 'high' : item.unsure)), [items, filter]);
  const reviewed = items.filter(item => item.reviewed).length;
  const selected = items.find(item => item.id === current);
  const count = (f: Filter) => items.filter(item => f === 'all' || (f === 'risky' ? item.risk === 'high' : item.unsure)).length;

  return (
    <div ref={ref} role="region" aria-label={label} {...props} {...withStyles(stylex.props(s.root), className, style)}>
      <div {...stylex.props(s.head)}>
        <SegmentedControl
          label="Show"
          options={[
            { value: 'all', label: `All ${count('all')}` },
            { value: 'risky', label: `High risk ${count('risky')}` },
            { value: 'unsure', label: `Unsure ${count('unsure')}` },
          ]}
          value={filter}
          onChange={value => setFilter(value as Filter)}
        />
        <div {...stylex.props(s.progress)}>
          <Progress label="Reviewed" value={reviewed} maxValue={items.length || 1} valueLabel={`${reviewed} of ${items.length}`} size="sm" showLabel showValue />
        </div>
      </div>
      <div {...stylex.props(s.panes)}>
        <ListBox
          aria-label={label}
          items={visible}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={current ? [current] : []}
          onSelectionChange={keys => {
            const [id] = [...(keys as Set<string>)];
            if (id) { setOwn(id); onSelectionChange?.(id); }
          }}
          renderEmptyState={() => <p {...stylex.props(c.empty, s.empty)}>Nothing to review here.</p>}
          {...stylex.props(s.list)}
        >
          {item => (
            <ListBoxItem
              id={item.id}
              textValue={item.textValue}
              className={({ isSelected, isHovered, isFocusVisible }) => stylex.props(
                s.item, transitionStyles.colors, isHovered && s.hover, isSelected && (isHovered ? s.selectedHover : s.selected),
                isFocusVisible && focusStyles.ringInset,
              ).className ?? ''}
            >
              <span {...stylex.props(c.rowText)}>
                <span {...stylex.props(c.rowTitle, item.reviewed && s.titleDone)}>{item.title}</span>
                <span {...stylex.props(c.meta, s.meta)}>{item.kind}{item.age && <> · {item.age}</>}{item.unsure && <> · Unsure</>}</span>
              </span>
              <span {...stylex.props(s.end)}>
                {item.risk === 'high' && !item.reviewed && <RiskBadge risk="high" appearance="text" />}
                {item.reviewed && <span {...stylex.props(s.check)}><Icon name="check" size={16} /><SrOnly>Reviewed</SrOnly></span>}
              </span>
            </ListBoxItem>
          )}
        </ListBox>
        {selected && renderDetail && <div {...stylex.props(s.detail)}>{renderDetail(selected)}</div>}
      </div>
    </div>
  );
}
