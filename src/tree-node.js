// @flow
import React, {
  Component,
  Children,
  cloneElement,
  type ElementType,
} from 'react';
import { type ConnectDropTarget } from 'react-dnd';
import { type Path, type Row } from './react-sortable-tree';
import classnames from './utils/classnames';
import './tree-node.css';

export type NodeData = {
  title?: ElementType | (({}) => ElementType),
  subtitle?: ElementType | (({}) => ElementType),
  expanded?: boolean,
  children?: Array<NodeData>,
};

export type Props = {
  treeIndex: number,
  treeId: string,
  swapFrom: ?number,
  swapDepth: ?number,
  swapLength: ?number,
  scaffoldBlockPxWidth: number,
  lowerSiblingCounts: Array<number>,

  listIndex: number,
  children: ElementType,

  // Drop target
  connectDropTarget: ConnectDropTarget,
  isOver: boolean,
  canDrop: ?boolean,
  draggedNode: ?NodeData,

  // used in dndManager
  getPrevRow: () => ?Row,
  node: NodeData,
  path: Path,
};

class TreeNode extends Component<Props> {
  static defaultProps = {
    swapFrom: null,
    swapDepth: null,
    swapLength: null,
    canDrop: false,
    draggedNode: null,
  };

  render() {
    const {
      children,
      listIndex,
      swapFrom,
      swapLength,
      swapDepth,
      scaffoldBlockPxWidth,
      lowerSiblingCounts,
      connectDropTarget,
      isOver,
      draggedNode,
      canDrop,
      treeIndex,
      treeId, // Delete from otherProps
      getPrevRow, // Delete from otherProps
      node, // Delete from otherProps
      path, // Delete from otherProps
      ...otherProps
    } = this.props;

    // Construct the scaffold representing the structure of the tree
    const scaffoldBlockCount = lowerSiblingCounts.length;
    const scaffold = [];
    lowerSiblingCounts.forEach((lowerSiblingCount: number, i: number) => {
      let lineClass = '';
      if (lowerSiblingCount > 0) {
        // At this level in the tree, the nodes had sibling nodes further down

        if (listIndex === 0) {
          // Top-left corner of the tree
          // +-----+
          // |     |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass =
            'rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom';
        } else if (i === scaffoldBlockCount - 1) {
          // Last scaffold block in the row, right before the row content
          // +--+--+
          // |  |  |
          // |  +--+
          // |  |  |
          // +--+--+
          lineClass = 'rst__lineHalfHorizontalRight rst__lineFullVertical';
        } else {
          // Simply connecting the line extending down to the next sibling on this level
          // +--+--+
          // |  |  |
          // |  |  |
          // |  |  |
          // +--+--+
          lineClass = 'rst__lineFullVertical';
        }
      } else if (listIndex === 0) {
        // Top-left corner of the tree, but has no siblings
        // +-----+
        // |     |
        // |  +--+
        // |     |
        // +-----+
        lineClass = 'rst__lineHalfHorizontalRight';
      } else if (i === scaffoldBlockCount - 1) {
        // The last or only node in this level of the tree
        // +--+--+
        // |  |  |
        // |  +--+
        // |     |
        // +-----+
        lineClass = 'rst__lineHalfVerticalTop rst__lineHalfHorizontalRight';
      }

      scaffold.push(
        <div
          key={`pre_${1 + i}`}
          style={{ width: scaffoldBlockPxWidth }}
          className={`${'rst__lineBlock'} ${lineClass}`}
        />
      );

      if (treeIndex !== listIndex && i === swapDepth) {
        // This row has been shifted, and is at the depth of
        // the line pointing to the new destination
        let highlightLineClass = '';

        if (listIndex === swapFrom + swapLength - 1) {
          // This block is on the bottom (target) line
          // This block points at the target block (where the row will go when released)
          highlightLineClass = 'rst__highlightBottomLeftCorner';
        } else if (treeIndex === swapFrom) {
          // This block is on the top (source) line
          highlightLineClass = 'rst__highlightTopLeftCorner';
        } else {
          // This block is between the bottom and top
          highlightLineClass = 'rst__highlightLineVertical';
        }

        scaffold.push(
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            style={{
              width: scaffoldBlockPxWidth,
              left: scaffoldBlockPxWidth * i,
            }}
            className={classnames('rst__absoluteLineBlock', highlightLineClass)}
          />
        );
      }
    });

    return connectDropTarget(
      <div {...otherProps} className="rst__node">
        {scaffold}

        <div
          className="rst__nodeContent"
          style={{ left: scaffoldBlockPxWidth * scaffoldBlockCount }}
        >
          {Children.map(children, (child: any) =>
            cloneElement(child, {
              isOver,
              canDrop,
              draggedNode,
            })
          )}
        </div>
      </div>
    );
  }
}

export default TreeNode;
