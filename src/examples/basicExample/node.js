import React, { Component, PropTypes } from 'react';
import styles from './stylesheets/app.scss';
import ExternalItem from './../../external-item';

class Node extends Component {
    render() {
        return (<span className={styles['new-node']}>{this.props.node.title}</span>);
    }
}

Node.propTypes = {
    node: PropTypes.object.isRequired,
};
export default ExternalItem('NEW_NODE')(Node);
