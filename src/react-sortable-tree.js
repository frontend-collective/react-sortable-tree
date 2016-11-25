/*!
 * react-sortable-tree
 * Copyright 2016 Chris Fritz All rights reserved.
 * @license Open source under the MIT License
 */

import React, { Component, PropTypes } from 'react';
import 'react-virtualized/styles.css';

import {
    dndWrapRootContext,
    dndWrapRootTarget,
} from './utils/drag-and-drop-utils';
import ReactSortableTree from './ReactSortableTree';

class ReactSortableTreeWrapper extends Component {
    constructor(props) {
        super(props);

        this.Tree = dndWrapRootTarget(ReactSortableTree, props.treeName);
    }
    render() {
        const { Tree } = this;

        return <Tree {...this.props} />;
    }
}

ReactSortableTreeWrapper.defaultProps = {
    treeName: '',
};

ReactSortableTreeWrapper.propTypes = {
    treeName: PropTypes.string,
};

export default dndWrapRootContext(ReactSortableTreeWrapper);
