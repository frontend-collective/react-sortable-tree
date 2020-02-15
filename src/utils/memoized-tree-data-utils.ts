import memoize from 'memoize-one';
import {
  insertNode,
  getDescendantCount,
  getFlatDataFromTree,
} from './tree-data-utils';

export const memoizedInsertNode = memoize(insertNode);
export const memoizedGetFlatDataFromTree = memoize(getFlatDataFromTree);
export const memoizedGetDescendantCount = memoize(getDescendantCount);
