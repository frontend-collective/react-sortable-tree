import {
    changeNodeAtPath,
    insertNode,
} from './tree-data-utils';

export function defaultGetNodeKey({ node: _node, treeIndex }) {
    return treeIndex;
}

export function defaultToggleChildrenVisibility({ node: _node, path, treeIndex: _treeIndex }) {
    this.props.updateTreeData(changeNodeAtPath({
        treeData: this.props.treeData,
        path,
        newNode: ({ node }) => ({ ...node, expanded: !node.expanded }),
        getNodeKey: this.getNodeKey,
    }));
}

export function defaultMoveNode({ node: newNode, depth, minimumTreeIndex }) {
    this.props.updateTreeData(insertNode({
        treeData: this.state.draggingTreeData,
        newNode,
        depth,
        minimumTreeIndex,
        expandParent: true,
    }).treeData);
}

// Cheap hack to get the text of a react object
function getReactElementText(parent) {
    if (typeof parent === 'string') {
        return parent;
    }

    if (typeof parent !== 'object' ||
        !parent.props ||
        !parent.props.children ||
        (typeof parent.props.children !== 'string' && typeof parent.props.children !== 'object')
    ) {
        return '';
    }

    if (typeof parent.props.children === 'string') {
        return parent.props.children;
    }

    return parent.props.children.map(child => getReactElementText(child)).join('');
}

// Search for a query string inside a node property
function stringSearch(key, searchQuery, node, path, treeIndex) {
    if (typeof node[key] === 'function') {
        return String(node[key]({ node, path, treeIndex })).indexOf(searchQuery) > -1;
    } else if (typeof node[key] === 'object') {
        return getReactElementText(node[key]).indexOf(searchQuery) > -1;
    }

    return node[key] && String(node[key]).indexOf(searchQuery) > -1;
}

export function defaultSearchMethod({ node, path, treeIndex, searchQuery }) {
    return stringSearch('title', searchQuery, node, path, treeIndex) ||
        stringSearch('subtitle', searchQuery, node, path, treeIndex);
}
