import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

const dragSource = {
    beginDrag(props) {
        return { node: { ...props.node }, path: [], type: 'newItem' };
    },
    
    endDrag(props, monitor) {
        if (!monitor.didDrop()) {
            props.dropCancelled();
        } else {
            props.addNewItem(monitor.getDropResult());
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

const externalItem = (Component, dndType) => {
    
    class ExternalItem extends React.Component {
        render() {
            const { connectDragSource } = this.props;
            return connectDragSource(<div><Component {...this.props} /></div>, { dropEffect: 'copy' }
            )
        }
    };

    ExternalItem.propTypes = {
        connectDragSource: PropTypes.func.isRequired,
    };
    return DragSource(dndType, dragSource, collect)(ExternalItem);
};

export default (dndType) => {
    return (target) => externalItem(target, dndType);
};