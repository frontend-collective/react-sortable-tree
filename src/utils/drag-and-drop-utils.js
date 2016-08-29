import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
    DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../item-types';

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

function getNextPath(dropTargetProps, monitor) {
    let abovePath = [];
    const draggedItem = monitor.getItem();
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        // If the rowAbove is the node we are dragging, its path will disappear with the move,
        // so we have to move one level up on the path
        if (rowAbove.node === draggedItem.node) {
            abovePath = rowAbove.path.slice(0, -1);
        } else {
            abovePath = rowAbove.path;
        }
    }

    return getParentPathFromOffset(
        abovePath,
        draggedItem.path.length - 1, // Subtract one because we are referring to the parent path
        monitor.getDifferenceFromInitialOffset().x,
        dropTargetProps.scaffoldBlockPxWidth
    );
}

function canDrop(dropTargetProps, monitor, isHover = false) {
    let abovePath      = [];
    let aboveNode      = {};
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        abovePath = rowAbove.path;
        aboveNode = rowAbove.node;
    }

    const nextPath = getNextPath(dropTargetProps, monitor);

    const draggedNode = monitor.getItem().node;
    return (
        // Either we're not adding to the children of the row above...
        nextPath.length < abovePath.length ||
        // ...or we guarantee it's not a function we're trying to add to
        typeof aboveNode.children !== 'function'
    ) && (
        // Ignore when hovered above the identical node...
        !(dropTargetProps.node === draggedNode && isHover === true) ||
        // ...unless it's at a different level than the current one
        nextPath.length !== (dropTargetProps.path.length - 1)
    );
}

const myDropTarget = {
    drop(dropTargetProps, monitor) {
        let aboveTreeIndex = 0;
        const rowAbove = dropTargetProps.getPrevRow();
        if (rowAbove) {
            aboveTreeIndex = rowAbove.treeIndex + 1;
        }

        return {
            node:             monitor.getItem().node,
            path:             monitor.getItem().path,
            minimumTreeIndex: aboveTreeIndex,
            parentPath:       getNextPath(dropTargetProps, monitor),
        };
    },

    hover(dropTargetProps, monitor) {
        if (!canDrop(dropTargetProps, monitor, true)) {
            return;
        }

        let aboveTreeIndex = 0;
        const rowAbove = dropTargetProps.getPrevRow();
        if (rowAbove) {
            aboveTreeIndex = rowAbove.treeIndex + 1;
        }

        const nextPath = getNextPath(dropTargetProps, monitor);

        dropTargetProps.dragHover({
            node:             monitor.getItem().node,
            path:             monitor.getItem().path,
            minimumTreeIndex: aboveTreeIndex,
            parentPath:       nextPath,
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
