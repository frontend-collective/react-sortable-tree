// @flow
import React, { Component, type Node } from 'react';
import { type ConnectDragPreview, type ConnectDragSource } from 'react-dnd';
import { type NodeData } from './tree-node';
import { type Path } from './react-sortable-tree';
import { isDescendant } from './utils/tree-data-utils';
import classnames from './utils/classnames';
import './node-renderer-default.css';

type Props = {
  node: NodeData,
  title: ?(Node | (({}) => Node)),
  subtitle: ?(Node | (({}) => Node)),
  path: Path,
  treeIndex: number,
  treeId: string,
  isSearchMatch: boolean,
  isSearchFocus: boolean,
  canDrag: boolean,
  scaffoldBlockPxWidth: number,
  toggleChildrenVisibility: ({
    node: NodeData,
    path: Path,
    treeIndex: number,
  }) => void,
  buttons: Array<any>,
  className: string,
  style: {},

  // Drag and drop API functions
  // Drag source
  connectDragPreview: ConnectDragPreview,
  connectDragSource: ConnectDragSource,
  parentNode: ?NodeData, // Needed for dndManager
  isDragging: boolean,
  didDrop: boolean,
  draggedNode: ?NodeData,
  // Drop target
  isOver: boolean,
  canDrop: boolean,
};

class NodeRendererDefault extends Component<Props> {
  static defaultProps = {
    isSearchMatch: false,
    isSearchFocus: false,
    canDrag: false,
    toggleChildrenVisibility: null,
    buttons: [],
    className: '',
    style: {},
    parentNode: null,
    draggedNode: null,
    canDrop: false,
    title: null,
    subtitle: null,
  };

  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      buttons,
      className,
      style,
      didDrop,
      treeId,
      isOver, // Not needed, but preserved for other renderers
      parentNode, // Needed for dndManager
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;
    let handle;
    if (canDrag) {
      if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        handle = (
          <div className="rst__loadingHandle">
            <div className="rst__loadingCircle">
              {[...new Array(12)].map((_: number, index: number) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className="rst__loadingCirclePoint"
                />
              ))}
            </div>
          </div>
        );
      } else {
        // Show the handle used to initiate a drag-and-drop
        handle = connectDragSource(<div className="rst__moveHandle" />, {
          dropEffect: 'copy',
        });
      }
    }

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;

    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
          node.children &&
          (node.children.length > 0 || typeof node.children === 'function') && (
            <div>
              <button
                type="button"
                aria-label={node.expanded ? 'Collapse' : 'Expand'}
                className={
                  node.expanded ? 'rst__collapseButton' : 'rst__expandButton'
                }
                style={{ left: -0.5 * scaffoldBlockPxWidth }}
                onClick={() =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                  })
                }
              />

              {node.expanded &&
                !isDragging && (
                  <div
                    style={{ width: scaffoldBlockPxWidth }}
                    className="rst__lineChildren"
                  />
                )}
            </div>
          )}

        <div className="rst__rowWrapper">
          {/* Set the row preview to be used during drag and drop */}
          {connectDragPreview(
            <div
              className={classnames(
                'rst__row',
                isLandingPadActive && 'rst__rowLandingPad',
                isLandingPadActive && !canDrop && 'rst__rowCancelPad',
                isSearchMatch && 'rst__rowSearchMatch',
                isSearchFocus && 'rst__rowSearchFocus',
                className
              )}
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
            >
              {handle}

              <div
                className={classnames(
                  'rst__rowContents',
                  !canDrag && 'rst__rowContentsDragDisabled'
                )}
              >
                <div className="rst__rowLabel">
                  <span
                    className={classnames(
                      'rst__rowTitle',
                      node.subtitle && 'rst__rowTitleWithSubtitle'
                    )}
                  >
                    {typeof nodeTitle === 'function'
                      ? nodeTitle({
                          node,
                          path,
                          treeIndex,
                        })
                      : nodeTitle}
                  </span>

                  {nodeSubtitle && (
                    <span className="rst__rowSubtitle">
                      {typeof nodeSubtitle === 'function'
                        ? nodeSubtitle({
                            node,
                            path,
                            treeIndex,
                          })
                        : nodeSubtitle}
                    </span>
                  )}
                </div>

                <div className="rst__rowToolbar">
                  {buttons.map((btn: any, index: number) => (
                    <div
                      key={index} // eslint-disable-line react/no-array-index-key
                      className="rst__toolbarButton"
                    >
                      {btn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default NodeRendererDefault;
