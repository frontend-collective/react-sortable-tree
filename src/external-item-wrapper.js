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

const externalItemWrapper = (Component, dndType) => {
    class ExternalItemWrapper extends React.Component {
        render() {
            const { connectDragSource } = this.props;
            return connectDragSource(<span><Component {...this.props} /></span>, { dropEffect: 'copy' });
        }
    }

    ExternalItemWrapper.propTypes = {
        connectDragSource: PropTypes.func.isRequired,
    };
    return DragSource(dndType, dragSource, collect)(ExternalItemWrapper);
};

export default dndType => target => externalItemWrapper(target, dndType);
