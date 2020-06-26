/* eslint-disable import/no-extraneous-dependencies */

import { storiesOf } from '@storybook/react';
import React from 'react';
import AddRemoveExample from './add-remove';
import BarebonesExample from './barebones';
import BarebonesExampleNoContext from './barebones-no-context';
import CallbacksExample from './callbacks';
import CanDropExample from './can-drop';
import ChildlessNodes from './childless-nodes';
import DragOutToRemoveExample from './drag-out-to-remove';
import ExternalNodeExample from './external-node';
import GenerateNodePropsExample from './generate-node-props';
import './generic.css';
import ModifyNodesExample from './modify-nodes';
import OnlyExpandSearchedNodesExample from './only-expand-searched-node';
import RowDirectionExample from './rtl-support';
import SearchExample from './search';
import ThemesExample from './themes';
import TouchSupportExample from './touch-support';
import TreeDataIOExample from './tree-data-io';
import TreeToTreeExample from './tree-to-tree';

storiesOf('Basics', module)
  .add('Minimal implementation', () => <BarebonesExample />)
  .add('treeData import/export', () => <TreeDataIOExample />)
  .add('Add and remove nodes programmatically', () => <AddRemoveExample />)
  .add('Modify nodes', () => <ModifyNodesExample />)
  .add('Prevent drop', () => <CanDropExample />)
  .add('Search', () => <SearchExample />)
  .add('Themes', () => <ThemesExample />)
  .add('Callbacks', () => <CallbacksExample />)
  .add('Row direction support', () => <RowDirectionExample />);

storiesOf('Advanced', module)
  .add('Drag from external source', () => <ExternalNodeExample />)
  .add('Touch support (Experimental)', () => <TouchSupportExample />)
  .add('Tree-to-tree dragging', () => <TreeToTreeExample />, 'tree-to-tree.js')
  .add('Playing with generateNodeProps', () => <GenerateNodePropsExample />)
  .add('Drag out to remove', () => <DragOutToRemoveExample />)
  .add('onlyExpandSearchedNodes', () => <OnlyExpandSearchedNodesExample />)
  .add('Prevent some nodes from having children', () => <ChildlessNodes />)
  .add('Minimal implementation without Dnd Context', () => (
    <BarebonesExampleNoContext />
  ));
