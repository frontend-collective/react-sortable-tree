/* eslint-disable import/no-extraneous-dependencies */

import React from 'react';
import { storiesOf } from '@storybook/react';
import AddRemoveExample from './add-remove';
import BarebonesExample from './barebones';
import CallbacksExample from './callbacks';
import CanDropExample from './can-drop';
import ChildlessNodes from './childless-nodes';
import DragOutToRemoveExample from './drag-out-to-remove';
import ExternalNodeExample from './external-node';
import GenerateNodePropsExample from './generate-node-props';
import ModifyNodesExample from './modify-nodes';
import SearchExample from './search';
import OnlyExpandSearchedNodesExample from './only-expand-searched-node';
import ThemesExample from './themes';
import TouchSupportExample from './touch-support';
import TreeDataIOExample from './tree-data-io';
import TreeToTreeExample from './tree-to-tree';
import RowDirectionExample from './rtl-support';
import './generic.css';

import { handleClick, SANDBOX_URL } from './sandbox-utils';

const wrapWithSource = (node, src) => (
  <div>
    {node}

    <br />
    <form id="codesandbox-form" action={SANDBOX_URL} method="POST">
      <input id="codesandbox-parameters" type="hidden" name="parameters" />
    </form>
    <button className="sandboxButton" onClick={handleClick(src)}>
      PLAY WITH THIS CODE →
    </button>
    <a
      href={`https://github.com/frontend-collective/react-sortable-tree/blob/master/stories/${src}`}
      target="_top"
      rel="noopener noreferrer"
      className="sourceLink"
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
  .add('Themes', () => wrapWithSource(<ThemesExample />, 'themes.js'))
  .add('Callbacks', () => wrapWithSource(<CallbacksExample />, 'callbacks.js'))
  .add('Row direction support', () =>
    wrapWithSource(<RowDirectionExample />, 'rtl-support.js')
  );

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
  )
  .add('onlyExpandSearchedNodes', () =>
    wrapWithSource(
      <OnlyExpandSearchedNodesExample />,
      'only-expand-searched-node.js'
    )
  )
  .add('Prevent some nodes from having children', () =>
    wrapWithSource(<ChildlessNodes />, 'childless-nodes.js')
  );
