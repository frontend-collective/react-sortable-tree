/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import AddRemoveExample from './add-remove';
import BarebonesExample from './barebones';
import CanDropExample from './can-drop';
import DragOutToRemoveExample from './drag-out-to-remove';
import ExternalNodeExample from './external-node';
import GenerateNodePropsExample from './generate-node-props';
import ModifyNodesExample from './modify-nodes';
import SearchExample from './search';
import ThemesExample from './themes';
import TouchSupportExample from './touch-support';
import TreeDataIOExample from './tree-data-io';
import TreeToTreeExample from './tree-to-tree';
import styles from './generic.scss';

const wrapWithSource = (node, src) => (
  <div>
    {node}

    <br />
    <a
      href={`https://github.com/fritz-c/react-sortable-tree/blob/master/examples/storybooks/${src}`}
      target="_top"
      rel="noopener noreferrer"
      className={styles.sourceLink}
    >
      VIEW SOURCE →
    </a>
  </div>
);

storiesOf('Basics', module)
  .add('Minimal implementation', () =>
    wrapWithSource(<BarebonesExample />, 'barebones.js')
  )
  .add('treeData import/export', () =>
    wrapWithSource(<TreeDataIOExample />, 'tree-data-io.js')
  )
  .add('Add and remove nodes programmatically', () =>
    wrapWithSource(<AddRemoveExample />, 'add-remove.js')
  )
  .add('Modify nodes', () =>
    wrapWithSource(<ModifyNodesExample />, 'modify-nodes.js')
  )
  .add('Prevent drop', () => wrapWithSource(<CanDropExample />, 'can-drop.js'))
  .add('Search', () => wrapWithSource(<SearchExample />, 'search.js'))
  .add('Themes', () => wrapWithSource(<ThemesExample />, 'themes.js'));

storiesOf('Advanced', module)
  .add('Drag from external source', () =>
    wrapWithSource(<ExternalNodeExample />, 'external-node.js')
  )
  .add('Touch support (Experimental)', () =>
    wrapWithSource(<TouchSupportExample />, 'touch-support.js')
  )
  .add('Tree-to-tree dragging', () =>
    wrapWithSource(<TreeToTreeExample />, 'tree-to-tree.js')
  )
  .add('Playing with generateNodeProps', () =>
    wrapWithSource(<GenerateNodePropsExample />, 'generate-node-props.js')
  )
  .add('Drag out to remove', () =>
    wrapWithSource(<DragOutToRemoveExample />, 'drag-out-to-remove.js')
  );
