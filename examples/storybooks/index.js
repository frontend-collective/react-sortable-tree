/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import AddRemoveExample from './add-remove';
import BarebonesExample from './barebones';
import CallbacksExample from './callbacks';
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

const wrapWithSource = (node, src, sandbox) => (
  <div>
    {node}

    <br />
    <a
      href={`https://codesandbox.io/s/${sandbox}`}
      target="_top"
      rel="noopener noreferrer"
      className={styles.sandboxLink}
    >
      VIEW ON SANDBOX →
    </a>
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
    wrapWithSource(<BarebonesExample />, 'barebones.js', '181o18oz3j')
  )
  .add('treeData import/export', () =>
    wrapWithSource(<TreeDataIOExample />, 'tree-data-io.js', 'm48xkm0w98')
  )
  .add('Add and remove nodes programmatically', () =>
    wrapWithSource(<AddRemoveExample />, 'add-remove.js', 'jvqo7683j5')
  )
  .add('Modify nodes', () =>
    wrapWithSource(<ModifyNodesExample />, 'modify-nodes.js', '00mkvmo3yv')
  )
  .add('Prevent drop', () =>
    wrapWithSource(<CanDropExample />, 'can-drop.js', 'ko13xwv1ko')
  )
  .add('Search', () =>
    wrapWithSource(<SearchExample />, 'search.js', 'j7op92ojpv')
  )
  .add('Themes', () =>
    wrapWithSource(<ThemesExample />, 'themes.js', '9zozn02w5r')
  )
  .add('Callbacks', () =>
    wrapWithSource(<CallbacksExample />, 'callbacks.js', '6w61xz92zn')
  );

storiesOf('Advanced', module)
  .add('Drag from external source', () =>
    wrapWithSource(<ExternalNodeExample />, 'external-node.js', 'lyk94v2x7m')
  )
  .add('Touch support (Experimental)', () =>
    wrapWithSource(<TouchSupportExample />, 'touch-support.js', 'k5w17opmkr')
  )
  .add('Tree-to-tree dragging', () =>
    wrapWithSource(<TreeToTreeExample />, 'tree-to-tree.js', 'k97nvzmj2r')
  )
  .add('Playing with generateNodeProps', () =>
    wrapWithSource(
      <GenerateNodePropsExample />,
      'generate-node-props.js',
      'pmkrxm8yp7'
    )
  )
  .add('Drag out to remove', () =>
    wrapWithSource(
      <DragOutToRemoveExample />,
      'drag-out-to-remove.js',
      'k371z4v98r'
    )
  );
