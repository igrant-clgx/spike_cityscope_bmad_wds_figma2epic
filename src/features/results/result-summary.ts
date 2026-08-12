/**
 * Pure summary-line builder for the result card. Independent of MUI/react so it
 * is exhaustively unit-testable. Renders the scope as "<type> · <items>", where
 * items are comma-joined; when there are no items the separator is omitted so no
 * dangling "·" is shown.
 */

const SEPARATOR = ' \u00b7 ';

export function buildSummaryLine(typeLabel: string, itemLabels: string[]): string {
  const type = typeLabel.trim();
  const items = itemLabels.map((s) => s.trim()).filter(Boolean);
  if (items.length === 0) {
    return type;
  }
  if (type.length === 0) {
    return items.join(', ');
  }
  return `${type}${SEPARATOR}${items.join(', ')}`;
}
