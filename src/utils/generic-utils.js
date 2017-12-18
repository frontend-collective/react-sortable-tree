/* eslint-disable import/prefer-default-export */

export function slideRows(rows, fromIndex, toIndex, count = 1) {
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

export function pathIncludes(path, parentPath) {
  if(!parentPath || parentPath == []) {
    return true;
  }
  else {
    const parentIndex = parentPath[parentPath.length - 1];
    return path.includes(parentIndex);
  }
}