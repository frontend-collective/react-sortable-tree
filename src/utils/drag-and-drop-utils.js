import {
    DragDropContext as dragDropContext,
    DragSource as dragSource,
    DropTarget as dropTarget,
} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from '../item-types';
import {
    getDepth,
} from './tree-data-utils';

const nodeDragSource = {
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
        const dropTargetNode = monitor.getItem().node;
        const draggedNode    = props.node;

        return draggedNode === dropTargetNode;
    }
};

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

    let targetDepth = Math.min(dropTargetDepth, Math.max(0, draggedItem.path.length + blocksOffset - 1));

    // If a maxDepth is defined, constrain the target depth
    if (typeof dropTargetProps.maxDepth !== 'undefined' && dropTargetProps.maxDepth !== null) {
        const draggedNode       = monitor.getItem().node;
        const draggedChildDepth = getDepth(draggedNode);

        targetDepth = Math.min(targetDepth, dropTargetProps.maxDepth - draggedChildDepth - 1);
    }

    return targetDepth;
}

function canDrop(dropTargetProps, monitor, isHover = false) {
    let abovePath      = [];
    let aboveNode      = {};
    let parentNode     = {};
    const rowAbove = dropTargetProps.getPrevRow();
    if (rowAbove) {
        abovePath = rowAbove.path;
        aboveNode = rowAbove.node;
    }
    const parentRow = dropTargetProps.getParentRow();
    if (parentRow) {
        parentNode = parentRow.node;
    }

    const targetDepth = getTargetDepth(dropTargetProps, monitor);
    const draggedNode = monitor.getItem().node;
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
        // Finally decide whenever the node can be dropped or not
        dropTargetProps.shouldMoveNode(draggedNode, parentNode)
    );
}

const nodeDropTarget = {
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
            minimumTreeIndex: dropTargetProps.listIndex,
            depth:            getTargetDepth(dropTargetProps, monitor),
        });
    },

    canDrop,
};

const scrollDropTarget = {
    hover(props, monitor, component) {
        const cancelAnimationFrame = window.cancelAnimationFrame || (timeout => clearTimeout(timeout));
        const requestAnimationFrame = window.requestAnimationFrame || (func => setTimeout(func, 1000 / 60));

        // If already scrolling, stop the previous scroll loop
        if (this.lastScroll) {
            cancelAnimationFrame(this.lastScroll);
            this.lastScroll = null;
            clearTimeout(this.removeTimeout);
        }

        const slideRegionSize = component.props.slideRegionSize;
        const { x: dragXOffset, y: dragYOffset } = monitor.getClientOffset();
        const {
            top:    containerTop,
            bottom: containerBottom,
            left:   containerLeft,
            right:  containerRight,
        } = component.containerRef.getBoundingClientRect();
        let yScrollDirection = 0;
        let yScrollMagnitude = 0;
        const fromTop = dragYOffset - slideRegionSize - Math.max(containerTop, 0);
        if (fromTop <= 0) {
            // Move up
            yScrollDirection = -1;
            yScrollMagnitude = Math.sqrt(-1 * fromTop);
        } else {
            const fromBottom = dragYOffset + slideRegionSize - Math.min(containerBottom, window.innerHeight);
            if (fromBottom >= 0) {
                // Move down
                yScrollDirection = 1;
                yScrollMagnitude = Math.sqrt(fromBottom);
            }
        }

        let xScrollDirection = 0;
        let xScrollMagnitude = 0;
        const fromLeft = dragXOffset - slideRegionSize - Math.max(containerLeft, 0);
        if (fromLeft <= 0) {
            // Move up
            xScrollDirection = -1;
            xScrollMagnitude = Math.ceil(Math.sqrt(-1 * fromLeft));
        } else {
            const fromRight = dragXOffset + slideRegionSize - Math.min(containerRight, window.innerWidth);
            if (fromRight >= 0) {
                // Move down
                xScrollDirection = 1;
                xScrollMagnitude = Math.ceil(Math.sqrt(fromRight));
            }
        }

        // Don't do anything if there is no scroll operation
        if (xScrollDirection === 0 && yScrollDirection === 0) {
            return;
        }

        // Indefinitely scrolls the container at a constant rate
        const doScroll = () => {
            component.scrollBy(xScrollDirection * xScrollMagnitude, yScrollDirection * yScrollMagnitude);
            this.lastScroll = requestAnimationFrame(doScroll);
        };

        // Stop the scroll loop after a period of inactivity
        this.removeTimeout = setTimeout(() => {
            cancelAnimationFrame(this.lastScroll);
            this.lastScroll = null;
        }, 20);

        // Start the scroll loop
        this.lastScroll = requestAnimationFrame(doScroll);
    },

    canDrop() {
        return false;
    },
};

function nodeDragSourcePropInjection(connect, monitor) {
    return {
        connectDragSource:  connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging:         monitor.isDragging(),
    };
}

function nodeDropTargetPropInjection(connect, monitor) {
    const dragged = monitor.getItem();
    return {
        connectDropTarget: connect.dropTarget(),
        isOver:            monitor.isOver(),
        canDrop:           monitor.canDrop(),
        draggedNode:       dragged ? dragged.node : null,
    };
}

function scrollDropTargetPropInjection(connect) {
    return {
        _connectDropTarget: connect.dropTarget(),
    };
}

export function dndWrapSource(el) {
    return dragSource(ItemTypes.HANDLE, nodeDragSource, nodeDragSourcePropInjection)(el);
}

export function dndWrapTarget(el) {
    return dropTarget(ItemTypes.HANDLE, nodeDropTarget, nodeDropTargetPropInjection)(el);
}

export function dndWrapRoot(el) {
    return dragDropContext(HTML5Backend)(
        dropTarget(ItemTypes.HANDLE, scrollDropTarget, scrollDropTargetPropInjection)(el)
    );
}
