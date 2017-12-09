import {
  insertNode,
  getDescendantCount,
  getFlatDataFromTree,
} from './tree-data-utils';

const memoize = f => {
  let savedArgsArray = [];
  let savedKeysArray = [];
  let savedResult = null;

  return args => {
    const keysArray = Object.keys(args).sort();
    const argsArray = keysArray.map(key => args[key]);

    // If the arguments for the last insert operation are different than this time,
    // recalculate the result
    if (
      argsArray.length !== savedArgsArray.length ||
      argsArray.some((arg, index) => arg !== savedArgsArray[index]) ||
      keysArray.some((key, index) => key !== savedKeysArray[index])
    ) {
      savedArgsArray = argsArray;
      savedKeysArray = keysArray;
      savedResult = f(args);
    }

    return savedResult;
  };
};

export const memoizedInsertNode = memoize(insertNode);
export const memoizedGetFlatDataFromTree = memoize(getFlatDataFromTree);
export const memoizedGetDescendantCount = memoize(getDescendantCount);
