import {
  DragDropContext as dragDropContext,
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';
import { getDepth } from './tree-data-utils';
import { memoizedInsertNode } from './memoized-tree-data-utils';

const nodeDragSource = {
  beginDrag(props) {
    props.startDrag(props);

    return {
      node: props.node,
      parentNode: props.parentNode,
      path: props.path,
      treeIndex: props.treeIndex,
      treeId: props.treeId,
    };
  },

  endDrag(props, monitor) {
    props.endDrag(monitor.getDropResult());
  },

  isDragging(props, monitor) {
    const dropTargetNode = monitor.getItem().node;
    const draggedNode = props.node;

    return draggedNode === dropTargetNode;
  },
};

function getTargetDepth(dropTargetProps, monitor, component) {
  let dropTargetDepth = 0;

  const rowAbove = dropTargetProps.getPrevRow();
  if (rowAbove) {
    // Limit the length of the path to the deepest possible
    dropTargetDepth = Math.min(
      rowAbove.path.length,
      dropTargetProps.path.length
    );
  }

  let blocksOffset;
  let dragSourceInitialDepth = (monitor.getItem().path || []).length;

  // When adding node from external source
  if (monitor.getItem().treeId !== dropTargetProps.treeId) {
    // Ignore the tree depth of the source, if it had any to begin with
    dragSourceInitialDepth = 0;

    if (component) {
      const relativePosition = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node
      const leftShift =
        monitor.getSourceClientOffset().x - relativePosition.left;
      blocksOffset = Math.round(
        leftShift / dropTargetProps.scaffoldBlockPxWidth
      );
    } else {
      blocksOffset = dropTargetProps.path.length;
    }
  } else {
    blocksOffset = Math.round(
      monitor.getDifferenceFromInitialOffset().x /
        dropTargetProps.scaffoldBlockPxWidth
    );
  }

  let targetDepth = Math.min(
    dropTargetDepth,
    Math.max(0, dragSourceInitialDepth + blocksOffset - 1)
  );

  // If a maxDepth is defined, constrain the target depth
  if (
    typeof dropTargetProps.maxDepth !== 'undefined' &&
    dropTargetProps.maxDepth !== null
  ) {
    const draggedNode = monitor.getItem().node;
    const draggedChildDepth = getDepth(draggedNode);

    targetDepth = Math.min(
      targetDepth,
      dropTargetProps.maxDepth - draggedChildDepth - 1
    );
  }

  return targetDepth;
}

function canDrop(dropTargetProps, monitor) {
  if (!monitor.isOver()) {
    return false;
  }

  const rowAbove = dropTargetProps.getPrevRow();
  const abovePath = rowAbove ? rowAbove.path : [];
  const aboveNode = rowAbove ? rowAbove.node : {};
  const targetDepth = getTargetDepth(dropTargetProps, monitor, null);

  // Cannot drop if we're adding to the children of the row above and
  //  the row above is a function
  if (
    targetDepth >= abovePath.length &&
    typeof aboveNode.children === 'function'
  ) {
    return false;
  }

  if (typeof dropTargetProps.customCanDrop === 'function') {
    const node = monitor.getItem().node;
    const addedResult = memoizedInsertNode({
      treeData: dropTargetProps.treeData,
      newNode: node,
      depth: targetDepth,
      getNodeKey: dropTargetProps.getNodeKey,
      minimumTreeIndex: dropTargetProps.listIndex,
      expandParent: true,
    });

    return dropTargetProps.customCanDrop({
      node,
      prevPath: monitor.getItem().path,
      prevParent: monitor.getItem().parentNode,
      prevTreeIndex: monitor.getItem().treeIndex, // Equals -1 when dragged from external tree
      nextPath: addedResult.path,
      nextParent: addedResult.parentNode,
      nextTreeIndex: addedResult.treeIndex,
    });
  }

  return true;
}

const nodeDropTarget = {
  drop(dropTargetProps, monitor, component) {
    const result = {
      node: monitor.getItem().node,
      path: monitor.getItem().path,
      treeIndex: monitor.getItem().treeIndex,
      treeId: dropTargetProps.treeId,
      minimumTreeIndex: dropTargetProps.treeIndex,
      depth: getTargetDepth(dropTargetProps, monitor, component),
    };

    dropTargetProps.drop(result);

    return result;
  },

  hover(dropTargetProps, monitor, component) {
    const targetDepth = getTargetDepth(dropTargetProps, monitor, component);
    const draggedNode = monitor.getItem().node;
    const needsRedraw =
      // Redraw if hovered above different nodes
      dropTargetProps.node !== draggedNode ||
      // Or hovered above the same node but at a different depth
      targetDepth !== dropTargetProps.path.length - 1;

    if (!needsRedraw) {
      return;
    }

    dropTargetProps.dragHover({
      node: draggedNode,
      path: monitor.getItem().path,
      minimumTreeIndex: dropTargetProps.listIndex,
      depth: targetDepth,
    });
  },

  canDrop,
};

const placeholderDropTarget = {
  drop(dropTargetProps, monitor) {
    const { node, path, treeIndex } = monitor.getItem();
    const result = {
      node,
      path,
      treeIndex,
      treeId: dropTargetProps.treeId,
      minimumTreeIndex: 0,
      depth: 0,
    };

    dropTargetProps.drop(result);

    return result;
  },
};

function nodeDragSourcePropInjection(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop(),
  };
}

function nodeDropTargetPropInjection(connect, monitor) {
  const dragged = monitor.getItem();
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggedNode: dragged ? dragged.node : null,
  };
}

function placeholderPropInjection(connect, monitor) {
  const dragged = monitor.getItem();
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    draggedNode: dragged ? dragged.node : null,
  };
}

export function dndWrapSource(el, type) {
  return dragSource(type, nodeDragSource, nodeDragSourcePropInjection)(el);
}

export function dndWrapTarget(el, type) {
  return dropTarget(type, nodeDropTarget, nodeDropTargetPropInjection)(el);
}

export function dndWrapPlaceholder(el, type) {
  return dropTarget(type, placeholderDropTarget, placeholderPropInjection)(el);
}

export function dndWrapRoot(el) {
  return dragDropContext(HTML5Backend)(el);
}
