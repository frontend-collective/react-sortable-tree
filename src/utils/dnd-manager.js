import {
  DragDropContext as dragDropContext,
  DragSource as dragSource,
  DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { findDOMNode } from 'react-dom';
import { getDepth } from './tree-data-utils';
import { memoizedInsertNode } from './memoized-tree-data-utils';

export default class DndManager {
  constructor(treeRef) {
    this.treeRef = treeRef;
  }

  static wrapRoot(el) {
    return dragDropContext(HTML5Backend)(el);
  }

  get drop() {
    return this.treeRef.drop;
  }

  get treeId() {
    return this.treeRef.treeId;
  }

  get dndType() {
    return this.treeRef.dndType;
  }

  get treeData() {
    return this.treeRef.state.draggingTreeData || this.treeRef.props.treeData;
  }

  get getNodeKey() {
    return this.treeRef.props.getNodeKey;
  }

  get customCanDrop() {
    return this.treeRef.props.canDrop;
  }

  get maxDepth() {
    return this.treeRef.props.maxDepth;
  }

  getTargetDepth(dropTargetProps, monitor, component) {
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
    if (monitor.getItem().treeId !== this.treeId) {
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
    if (typeof this.maxDepth !== 'undefined' && this.maxDepth !== null) {
      const draggedNode = monitor.getItem().node;
      const draggedChildDepth = getDepth(draggedNode);

      targetDepth = Math.max(
        0,
        Math.min(targetDepth, this.maxDepth - draggedChildDepth - 1)
      );
    }

    return targetDepth;
  }

  canDrop(dropTargetProps, monitor) {
    if (!monitor.isOver()) {
      return false;
    }

    if (typeof this.customCanDrop === 'function') {
      return this.customCanDrop({
        node: dropTargetProps.node,
        draggedNode: monitor.getItem().node,
        prevPath: monitor.getItem().path,
        prevParent: monitor.getItem().parentNode,
        prevTreeIndex: monitor.getItem().treeIndex, // Equals -1 when dragged from external tree
      });
    }

    return true;
  }

  wrapSource(el) {
    const nodeDragSource = {
      beginDrag: props => ({
        node: props.node,
        parentNode: props.parentNode,
        path: props.path,
        treeIndex: props.treeIndex,
        treeId: props.treeId,
      }),

      isDragging: (props, monitor) => {
        const dropTargetNode = monitor.getItem().node;
        const draggedNode = props.node;

        return draggedNode === dropTargetNode;
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

    return dragSource(
      this.dndType,
      nodeDragSource,
      nodeDragSourcePropInjection
    )(el);
  }

  wrapTarget(el) {
    const nodeDropTarget = {
      drop: (dropTargetProps, monitor, component) => {
        const result = {
          node: monitor.getItem().node,
          path: monitor.getItem().path,
          treeIndex: monitor.getItem().treeIndex,
          treeId: this.treeId,
          minimumTreeIndex: dropTargetProps.treeIndex,
          depth: this.getTargetDepth(dropTargetProps, monitor, component),
          targetNode: dropTargetProps.node,
        };

        this.drop(result);

        return result;
      },

      canDrop: this.canDrop.bind(this),
    };

    function nodeDropTargetPropInjection(connect, monitor) {
      const dragged = monitor.getItem();
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedNode: dragged ? dragged.node : null,
      };
    }

    return dropTarget(
      this.dndType,
      nodeDropTarget,
      nodeDropTargetPropInjection
    )(el);
  }

  wrapPlaceholder(el) {
    const placeholderDropTarget = {
      drop: (dropTargetProps, monitor) => {
        const { node, path, treeIndex } = monitor.getItem();
        const result = {
          node,
          path,
          treeIndex,
          treeId: this.treeId,
          minimumTreeIndex: 0,
          depth: 0,
        };

        this.drop(result);

        return result;
      },
    };

    function placeholderPropInjection(connect, monitor) {
      const dragged = monitor.getItem();
      return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedNode: dragged ? dragged.node : null,
      };
    }

    return dropTarget(
      this.dndType,
      placeholderDropTarget,
      placeholderPropInjection
    )(el);
  }
}
