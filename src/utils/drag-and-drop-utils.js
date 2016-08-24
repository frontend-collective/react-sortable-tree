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
        props.endDrag(props, monitor.getDropResult());
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

const myDropTarget = {
    drop: ({ path, scaffoldBlockPxWidth }, monitor) => ({
        path: getParentPathFromOffset(
            monitor.getItem().path,
            path,
            monitor.getDifferenceFromInitialOffset().x,
            scaffoldBlockPxWidth
        )
    }),

    hover({ path, dragHover, scaffoldBlockPxWidth }, monitor) {
        dragHover({
            node: monitor.getItem().node,
            parentPath: getParentPathFromOffset(
                monitor.getItem().path,
                path,
                monitor.getDifferenceFromInitialOffset().x,
                scaffoldBlockPxWidth
            ),
            childIndex: 0,
        });

        // const { treeIndex: draggedId } = monitor.getItem();
        // const { treeIndex: overId } = props;

        // if (draggedId !== overId) {
        //     const { index: overIndex } = props.findCard(overId);
        //     props.moveCard(draggedId, overIndex);
        // }
    },

    canDrop(props, monitor) {
        // Cannot drag into a child path, and cannot drag into your current path
        return typeof props.children !== 'function' && monitor.getItem().path
            .some((key, index) => (props.path[index] !== key));
    },
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
