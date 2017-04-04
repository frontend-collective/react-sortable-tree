import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import styles from './stylesheets/app.scss';

const dragSource = {
    beginDrag(props) {
        return { node: { ...props.node }, path: [], type: 'newItem' };
    },

    endDrag(props, monitor) {
        if (!monitor.didDrop()) {
            return;
        }
        props.addNewItem(monitor.getDropResult());
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}


class Node extends Component {
    render() {
        const { connectDragSource } = this.props;

        return connectDragSource(
            <span className={styles['new-node']}>{this.props.node.title}</span>, { dropEffect: 'copy' }
        );
    }
}

Node.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    node: PropTypes.object.isRequired,
};
export default DragSource('NEW_NODE', dragSource, collect)(Node);
