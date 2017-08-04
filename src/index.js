import SortableTree, {
  SortableTreeWithoutDndContext,
} from './react-sortable-tree';

export * from './utils/default-handlers';
export * from './utils/tree-data-utils';
export default SortableTree;

// Export the tree component without the react-dnd DragDropContext,
// for when component is used with other components using react-dnd.
// see: https://github.com/gaearon/react-dnd/issues/186
export { SortableTreeWithoutDndContext };
