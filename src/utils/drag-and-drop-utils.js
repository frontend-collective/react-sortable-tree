import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
    DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../item-types';

const myDragSource = {
    beginDrag: (props) => {
        props.startDrag(props);

        return {
            node: props.node,
            path: props.path,
        };
    },

    endDrag: (props, monitor) => {
        props.endDrag(monitor.getDropResult());
    },
};

export function getParentPathFromOffset(
    sourcePath,
    targetPath,
    initialOffsetDifferenceX,
    scaffoldBlockPxWidth
) {
    const blocksOffset = Math.round(initialOffsetDifferenceX / scaffoldBlockPxWidth);
    return targetPath.slice(0, Math.max(0, sourcePath.length + blocksOffset));
}

function getNextPath(dropTargetProps, monitor) {
    return getParentPathFromOffset(
        monitor.getItem().path,
        dropTargetProps.path,
        monitor.getDifferenceFromInitialOffset().x,
        dropTargetProps.scaffoldBlockPxWidth
    );
}

const myDropTarget = {
    drop: (dropTargetProps, monitor) => ({
        node: monitor.getItem().node,
        path: monitor.getItem().path,
        minimumTreeIndex: dropTargetProps.treeIndex,
        parentPath: getNextPath(dropTargetProps, monitor),
    }),

    hover(dropTargetProps, monitor) {
        // Don't call hover event over areas where node cannot be dropped
        if (!monitor.canDrop()) {
            return;
        }

        dropTargetProps.dragHover({
            node: monitor.getItem().node,
            path: monitor.getItem().path,
            minimumTreeIndex: dropTargetProps.treeIndex,
            parentPath: getNextPath(dropTargetProps, monitor),
        });
    },

    canDrop(dropTargetProps, monitor) {
        const nextPath = getNextPath(dropTargetProps, monitor);

        // Cannot drag into a node with a function representing its children
        return typeof dropTargetProps.node.children !== 'function' && (
            // Cannot drag on top of the identical node
            dropTargetProps.node !== monitor.getItem().node ||
            // ...that is, unless it's to a higher level than the current one
            nextPath.length < dropTargetProps.path.length
        );
    }
};

function dragSourcePropInjection(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

function dropTargetPropInjection(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
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
