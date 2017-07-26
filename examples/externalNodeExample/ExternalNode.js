import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './stylesheets/app.scss';
import { dndWrapExternalSource } from './../../index';

class ExternalNode extends Component {
  render() {
    return (
      <div className={styles['external-node']}>
        {this.props.node.title}
      </div>
    );
  }
}

ExternalNode.propTypes = {
  node: PropTypes.shape({ title: PropTypes.string }).isRequired,
};

export default dndWrapExternalSource(ExternalNode, 'NEW_NODE');
