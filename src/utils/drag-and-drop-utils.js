import {
  DragDropContext as dragDropContext,
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import React from 'react';
import PropTypes from 'prop-types';
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

const externalSource = {
  beginDrag(props) {
    return {
      node: {
        ...props.node,
      },
      path: [],
      type: 'NewItem'
    }
  },

  endDrag(props, monitor) {
    if (!monitor.didDrop()) {
      props.dropCancelled();
    } else {
      props.addNewItem(monitor.getDropResult());
    }
  },
};

function getTargetDepth(dropTargetProps, monitor, component) {
  let dropTargetDepth = 0;
  const draggedItem = monitor.getItem();

  const rowAbove = dropTargetProps.getPrevRow();
  if (rowAbove) {
    // Limit the length of the path to the deepest possible
    dropTargetDepth = Math.min(
      rowAbove.path.length,
      dropTargetProps.path.length
    );
  }

  let blocksOffset;
  if (monitor.getItem().type !== 'NewItem') {
    blocksOffset = Math.round(
      monitor.getDifferenceFromInitialOffset().x /
      dropTargetProps.scaffoldBlockPxWidth
    );
  } else if (monitor.getItem().type === 'NewItem') {
    if (component) {
      const relativePosition = findDOMNode(component).getBoundingClientRect(); // eslint-disable-line react/no-find-dom-node
      const leftShift = monitor.getSourceClientOffset().x - relativePosition.left;
      blocksOffset = Math.round(
        leftShift /
        dropTargetProps.scaffoldBlockPxWidth
      );
    } else {
      blocksOffset = dropTargetProps.path.length;
    }
  } else {
    blocksOffset = 0;
  }

  let targetDepth = Math.min(
    dropTargetDepth,
    Math.max(0, draggedItem.path.length + blocksOffset - 1)
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

function canDrop(dropTargetProps, monitor, component) {
  if (!monitor.isOver()) {
    return false;
  }

  const rowAbove = dropTargetProps.getPrevRow();
  const abovePath = rowAbove ? rowAbove.path : [];
  const aboveNode = rowAbove ? rowAbove.node : {};
  const targetDepth = getTargetDepth(dropTargetProps, monitor, component);

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
      nextPath: addedResult.path,
      nextParent: addedResult.parentNode,
    });
  }

  return true;
}

const nodeDropTarget = {
  drop(dropTargetProps, monitor, component) {
    return {
      node: monitor.getItem().node,
      path: monitor.getItem().path,
      minimumTreeIndex: dropTargetProps.treeIndex,
      depth: getTargetDepth(dropTargetProps, monitor, component),
    };
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

function externalSourcePropInjection(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

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

export function dndWrapExternalSource(UserComponent, type) {
  class DndWrapExternalSource extends React.Component {
    render() {
      return this.props.connectDragSource(
        <div>
          <UserComponent {...this.props} />
        </div>,
        { dropEffect: 'copy' }
      );
    }
  }

  // these defaultProps must be passed to the custom external node component as props
  DndWrapExternalSource.defaultProps = {
    dropCanceled() {
      throw new Error('External Nodes must define dropCanceled prop function');
    },
    addNewItem() {
      throw new Error('External Nodes must define addNewItem prop function');
    },
  };

  DndWrapExternalSource.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    // The following are called within the react-dnd lifecycle hooks
    dropCanceled: PropTypes.func.isRequired,
    addNewItem: PropTypes.func.isRequired,
    /* eslint-enable react/no-unused-prop-types */
  };

  return dragSource(type, externalSource, externalSourcePropInjection)(
    DndWrapExternalSource
  );
}

export function dndWrapSource(el, type) {
  return dragSource(type, nodeDragSource, nodeDragSourcePropInjection)(el);
}

export function dndWrapTarget(el, type) {
  return dropTarget(type, nodeDropTarget, nodeDropTargetPropInjection)(el);
}

export function dndWrapRoot(el) {
  return dragDropContext(HTML5Backend)(el);
}
