import React, { PropTypes, cloneElement } from 'react';
import { CellMeasurer } from 'react-virtualized';

/**
 * This is needed to pass props (isOver, canDrop, draggedNode) given in tree-node
 * via cloneElement to the NodeContentRenderer rather than the CellMeasurer
 */
const NodeAutosizeWrapper = ({ cache, parent, rowIndex, children, ...extraProps }) => (
    <CellMeasurer
        cache={cache}
        columnIndex={0}
        parent={parent}
        rowIndex={rowIndex}
    >
        {cloneElement(children, extraProps)}
    </CellMeasurer>
);

NodeAutosizeWrapper.propTypes = {
    cache: PropTypes.any.isRequired,
    children: PropTypes.node.isRequired,
    parent: PropTypes.any.isRequired,
    rowIndex: PropTypes.number.isRequired
};

export default NodeAutosizeWrapper;
