// @flow
import React, {
  Children,
  cloneElement,
  Component,
  type ElementType,
} from 'react';
import { type ConnectDropTarget, type DropTargetMonitor } from 'react-dnd';
import { type Path } from './react-sortable-tree';
import { type NodeData, type Props as TreeNodeProps } from './tree-node';

export type Props = {
  children: ElementType,

  // Drop target
  connectDropTarget: ConnectDropTarget,
  isOver: boolean,
  canDrop: boolean,
  draggedNode: ?NodeData,
  treeId: string,
  drop: (
    TreeNodeProps,
    DropTargetMonitor
  ) => {
    node: NodeData,
    path: Path,
    treeIndex: number,
    treeId: string,
    minimumTreeIndex: number,
    depth: number,
  },
};

class TreePlaceholder extends Component<Props> {
  static defaultProps = {
    canDrop: false,
    draggedNode: null,
  };

  render() {
    const {
      children,
      connectDropTarget,
      treeId,
      drop,
      ...otherProps
    } = this.props;
    return connectDropTarget(
      <div>
        {Children.map(children, (child: any) =>
          cloneElement(child, {
            ...otherProps,
          })
        )}
      </div>
    );
  }
}

export default TreePlaceholder;
