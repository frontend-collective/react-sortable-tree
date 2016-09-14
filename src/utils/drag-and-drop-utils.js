import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
    DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../item-types';
import {
    isDescendant,
    getDepth,
} from './tree-data-utils';

const myDragSource = {
    beginDrag(props) {
        props.startDrag(props);

        return {
            node: props.node,
            path: props.path,
        };
    },

    endDrag(props, monitor) {
        props.endDrag(monitor.getDropResult());
    },

    isDragging(props, monitor) {
        return props.node === monitor.getItem().node;
    }
};

export function getParentPathFromOffset(
    targetParentPath,
    sourceParentPathLength,
    initialOffsetDifferenceX,
    scaffoldBlockPxWidth
) {
    const blocksOffset = Math.round(initialOffsetDifferenceX / scaffoldBlockPxWidth);
    return targetParentPath.slice(0, Math.max(0, sourceParentPathLength + blocksOffset));
}

function getTargetDepth(dropTargetProps, monitor) {
    let dropTargetDepth = 0;
    const draggedItem = monitor.getItem();
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        // Limit the length of the path to the deepest possible
        dropTargetDepth = Math.min(rowAbove.path.length, dropTargetProps.path.length);
    }

    const blocksOffset = Math.round(
        monitor.getDifferenceFromInitialOffset().x /
        dropTargetProps.scaffoldBlockPxWidth
    );
    return Math.min(dropTargetDepth, Math.max(0, draggedItem.path.length + blocksOffset - 1));
}

function canDrop(dropTargetProps, monitor, isHover = false) {
    let abovePath      = [];
    let aboveNode      = {};
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        abovePath = rowAbove.path;
        aboveNode = rowAbove.node;
    }

    const targetDepth       = getTargetDepth(dropTargetProps, monitor);
    const draggedNode       = monitor.getItem().node;
    const draggedChildDepth = getDepth(draggedNode);
    return (
        // Either we're not adding to the children of the row above...
        targetDepth < abovePath.length ||
        // ...or we guarantee it's not a function we're trying to add to
        typeof aboveNode.children !== 'function'
    ) && (
        // Ignore when hovered above the identical node...
        !(dropTargetProps.node === draggedNode && isHover === true) ||
        // ...unless it's at a different level than the current one
        targetDepth !== (dropTargetProps.path.length - 1)
    ) && (
        // Either we're not adding to a descendant of this node...
        !isDescendant(draggedNode, dropTargetProps.node) ||
        // ...or we're adding it at a shallower level
        targetDepth < dropTargetProps.path.length
    ) && (
        // Either no maxDepth is set...
       !dropTargetProps.maxDepth ||
        // ...or the targetDepth plus the depth of the node's children is less than
        // the maxDepth
        targetDepth + draggedChildDepth < dropTargetProps.maxDepth
    );
}

const myDropTarget = {
    drop(dropTargetProps, monitor) {
        return {
            node:             monitor.getItem().node,
            path:             monitor.getItem().path,
            minimumTreeIndex: dropTargetProps.treeIndex,
            depth:            getTargetDepth(dropTargetProps, monitor),
        };
    },

    hover(dropTargetProps, monitor) {
        if (!canDrop(dropTargetProps, monitor, true)) {
            return;
        }

        dropTargetProps.dragHover({
            node:             monitor.getItem().node,
            path:             monitor.getItem().path,
            minimumTreeIndex: dropTargetProps.treeIndex,
            depth:            getTargetDepth(dropTargetProps, monitor),
        });
    },

    canDrop,
};

function dragSourcePropInjection(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

function dropTargetPropInjection(connect, monitor) {
    const dragged = monitor.getItem();
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
        draggedNode:       dragged ? dragged.node : null,
    };
}

export function dndWrapSource(el) {
    return dragSource(ItemTypes.HANDLE, myDragSource, dragSourcePropInjection)(el);
}

export function dndWrapTarget(el) {
    return dropTarget(ItemTypes.HANDLE, myDropTarget, dropTargetPropInjection)(el);
}

export function dndWrapRoot(el) {
    return dragDropContext(HTML5Backend)(el);
}
