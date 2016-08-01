/*
 * react-sortable-tree
 * Copyright 2016 Chris Fritz All rights reserved.
 * @license Open source under the MIT License
 */

import React, { Component, PropTypes } from 'react';
import styles from './style.scss';

class ReactSortableTree extends Component {
    constructor(props) {
        super(props);

        this.state = {
            key: 'value',
        };
    }

    render() {
        const {
            myName,
        } = this.props;

        return (
            <div>Hello <span className={styles.myName}>{myName}</span>!</div>
        );
    }
}

ReactSortableTree.propTypes = {
    myName: PropTypes.string,
};

ReactSortableTree.defaultProps = {
    myName: 'World',
};

export default ReactSortableTree;
