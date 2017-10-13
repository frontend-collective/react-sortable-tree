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

  get startDrag() {
    return this.treeRef.startDrag;
  }

  get dragHover() {
    return this.treeRef.dragHover;
  }

  get endDrag() {
    return this.treeRef.endDrag;
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

      targetDepth = Math.min(
        targetDepth,
        this.maxDepth - draggedChildDepth - 1
      );
    }

    return targetDepth;
  }

  canDrop(dropTargetProps, monitor) {
    if (!monitor.isOver()) {
      return false;
    }

    const rowAbove = dropTargetProps.getPrevRow();
    const abovePath = rowAbove ? rowAbove.path : [];
    const aboveNode = rowAbove ? rowAbove.node : {};
    const targetDepth = this.getTargetDepth(dropTargetProps, monitor, null);

    // Cannot drop if we're adding to the children of the row above and
    //  the row above is a function
    if (
      targetDepth >= abovePath.length &&
      typeof aboveNode.children === 'function'
    ) {
      return false;
    }

    if (typeof this.customCanDrop === 'function') {
      const node = monitor.getItem().node;
      const addedResult = memoizedInsertNode({
        treeData: this.treeData,
        newNode: node,
        depth: targetDepth,
        getNodeKey: this.getNodeKey,
        minimumTreeIndex: dropTargetProps.listIndex,
        expandParent: true,
      });

      return this.customCanDrop({
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

  wrapSource(el) {
    const nodeDragSource = {
      beginDrag: props => {
        this.startDrag(props);

        return {
          node: props.node,
          parentNode: props.parentNode,
          path: props.path,
          treeIndex: props.treeIndex,
          treeId: props.treeId,
        };
      },

      endDrag: (props, monitor) => {
        this.endDrag(monitor.getDropResult());
      },

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
        };

        this.drop(result);

        return result;
      },

      hover: (dropTargetProps, monitor, component) => {
        const targetDepth = this.getTargetDepth(
          dropTargetProps,
          monitor,
          component
        );
        const draggedNode = monitor.getItem().node;
        const needsRedraw =
          // Redraw if hovered above different nodes
          dropTargetProps.node !== draggedNode ||
          // Or hovered above the same node but at a different depth
          targetDepth !== dropTargetProps.path.length - 1;

        if (!needsRedraw) {
          return;
        }

        this.dragHover({
          node: draggedNode,
          path: monitor.getItem().path,
          minimumTreeIndex: dropTargetProps.listIndex,
          depth: targetDepth,
        });
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
