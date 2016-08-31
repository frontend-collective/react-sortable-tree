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
