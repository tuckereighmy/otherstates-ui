import { useMemo } from 'react';
import { Badge, Table, TableBody, TableCell, TableColumnHeader, TableHead, TableRow } from '../../components';
import { RULES, summarize, type AuditKind, type AuditRow } from '../../customize';
import { Heading } from '../PageParts';
import { useRecipe } from './RecipeProvider';

// "Checked for you": the worst case of each audit group, per scheme, from summarize().

const path = 'docs/customize';
const kindById = new Map<string, AuditKind>(RULES.map(rule => [rule.id, rule.kind]));

function reading(row: AuditRow): string {
  switch (kindById.get(row.id)) {
    case 'order': return row.ok ? 'In order' : 'Out of order';
    case 'corners': return row.ok ? 'Nested radii follow' : 'Nested radii break';
    case 'distinct': return row.ok ? 'Distinct' : 'Too close';
    default: return Number.isFinite(row.value) ? `${row.value.toFixed(2)}:1` : 'Not measured';
  }
}

function Result({ row }: { row: AuditRow | null }) {
  if (!row) return <span className="cz-muted">Not used</span>;
  const badge = row.ok
    ? <Badge size="sm" variant="success">Pass</Badge>
    : row.gating
      ? <Badge size="sm" variant="error">Fails</Badge>
      : <Badge size="sm" variant="secondary">As shipped</Badge>;
  return (
    <span className="cz-result">
      <span className="cz-num">{reading(row)}</span>
      {badge}
    </span>
  );
}

export function AuditTable() {
  const { theme } = useRecipe();
  const rows = useMemo(() => summarize(theme), [theme]);
  const adjusted = theme.adjustments.filter(a => a.visible);
  const adjustedIn = (scheme: 'light' | 'dark') => adjusted.find(a => a.scheme === scheme);

  return (
    <>
      <Heading level={2} id="checked-for-you" path={path}>Checked for you</Heading>
      <p>
        Every combination is measured before it reaches the screen. Each row shows the closest call in its group: contrast against
        the surface the color is meant for, the order of surfaces, and the corner ladder.
      </p>
      <div className="cz-audit" data-docs-raw="">
        <Table aria-label="Checks for this theme" density="compact">
          <TableHead>
            <TableRow>
              <TableColumnHeader>Check</TableColumnHeader>
              <TableColumnHeader>Light</TableColumnHeader>
              <TableColumnHeader>Dark</TableColumnHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.group}>
                <TableCell>{row.group}</TableCell>
                <TableCell><Result row={row.light} /></TableCell>
                <TableCell><Result row={row.dark} /></TableCell>
              </TableRow>
            ))}
            {adjusted.length > 0 && (
              <TableRow>
                <TableCell>Accent adjusted</TableCell>
                {(['light', 'dark'] as const).map(scheme => {
                  const change = adjustedIn(scheme);
                  return (
                    <TableCell key={scheme}>
                      {change
                        ? <span className="cz-result"><span className="cz-num">{change.from} → {change.to}</span><Badge size="sm" variant="info">Adjusted</Badge></span>
                        : <span className="cz-muted">Unchanged</span>}
                    </TableCell>
                  );
                })}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
