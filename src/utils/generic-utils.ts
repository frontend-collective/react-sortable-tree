export function slideRows<T>(
  rows: T[],
  fromIndex: number,
  toIndex: number,
  count = 1
): T[] {
  const rowsWithoutMoved = [
    ...rows.slice(0, fromIndex),
    ...rows.slice(fromIndex + count),
  ];

  return [
    ...rowsWithoutMoved.slice(0, toIndex),
    ...rows.slice(fromIndex, fromIndex + count),
    ...rowsWithoutMoved.slice(toIndex),
  ];
}
