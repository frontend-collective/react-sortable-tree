/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import { List, AutoSizer } from 'react-virtualized';
import SortableTree from './react-sortable-tree';
import sortableTreeStyles from './react-sortable-tree.scss';
import TreeNode from './tree-node';
import treeNodeStyles from './tree-node.scss';
import DefaultNodeRenderer from './node-renderer-default';
import defaultNodeRendererStyles from './node-renderer-default.scss';

describe('<SortableTree />', () => {
  beforeEach(() => {
    jasmineEnzyme(); // Add extra matchers like .toHaveStyle() to jasmine

    // Keep react-virtualized's AutoSizer component from hiding everything in
    // enzyme's rendering environment (which has no height/width, apparently)
    spyOn(
      AutoSizer.prototype,
      'render'
    ).and.callFake(function renderOverride() {
      return (
        <div ref={this._setRef}>
          {this.props.children({ width: 200, height: 99999 })}
        </div>
      );
    });
  });

  it('should render nodes for flat data', () => {
    const wrapper = mount(<SortableTree treeData={[]} onChange={() => {}} />);

    // No nodes
    expect(wrapper.find(TreeNode).length).toEqual(0);

    // Single node
    wrapper.setProps({
      treeData: [{}],
    });
    expect(wrapper.find(TreeNode).length).toEqual(1);

    // Two nodes
    wrapper.setProps({
      treeData: [{}, {}],
    });
    expect(wrapper.find(TreeNode).length).toEqual(2);
  });

  it('should render nodes for nested, expanded data', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ expanded: true, children: [{}] }]}
        onChange={() => {}}
      />
    );

    // Single Nested
    expect(wrapper.find(TreeNode).length).toEqual(2);

    // Double Nested
    wrapper.setProps({
      treeData: [
        { expanded: true, children: [{ expanded: true, children: [{}] }] },
      ],
    });
    expect(wrapper.find(TreeNode).length).toEqual(3);

    // 2x Double Nested Siblings
    wrapper.setProps({
      treeData: [
        { expanded: true, children: [{ expanded: true, children: [{}] }] },
        { expanded: true, children: [{ expanded: true, children: [{}] }] },
      ],
    });
    expect(wrapper.find(TreeNode).length).toEqual(6);
  });

  it('should render nodes for nested, collapsed data', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ expanded: false, children: [{}] }]}
        onChange={() => {}}
      />
    );

    // Single Nested
    expect(wrapper.find(TreeNode).length).toEqual(1);

    // Double Nested
    wrapper.setProps({
      treeData: [
        { expanded: false, children: [{ expanded: false, children: [{}] }] },
      ],
    });
    expect(wrapper.find(TreeNode).length).toEqual(1);

    // 2x Double Nested Siblings, top level of first expanded
    wrapper.setProps({
      treeData: [
        { expanded: true, children: [{ expanded: false, children: [{}] }] },
        { expanded: false, children: [{ expanded: false, children: [{}] }] },
      ],
    });
    expect(wrapper.find(TreeNode).length).toEqual(3);
  });

  it('should reveal hidden nodes when visibility toggled', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a', children: [{ title: 'b' }] }]}
        onChange={treeData => wrapper.setProps({ treeData })}
      />
    );

    // Check nodes in collapsed state
    expect(wrapper.find(TreeNode).length).toEqual(1);

    // Expand node and check for the existence of the revealed child
    wrapper
      .find(`.${defaultNodeRendererStyles.expandButton}`)
      .first()
      .simulate('click');
    expect(wrapper.find(TreeNode).length).toEqual(2);

    // Collapse node and make sure the child has been hidden
    wrapper
      .find(`.${defaultNodeRendererStyles.collapseButton}`)
      .first()
      .simulate('click');
    expect(wrapper.find(TreeNode).length).toEqual(1);
  });

  it('should change outer wrapper style via `style` and `className` props', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        style={{ borderWidth: 42 }}
        className="extra-classy"
      />
    );

    expect(wrapper.find(`.${sortableTreeStyles.tree}`)).toHaveStyle(
      'borderWidth',
      42
    );
    expect(wrapper.find(`.${sortableTreeStyles.tree}`)).toHaveClassName(
      'extra-classy'
    );
  });

  it('should change style of scroll container with `innerStyle` prop', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        innerStyle={{ borderWidth: 42 }}
      />
    );

    expect(
      wrapper.find(`.${sortableTreeStyles.virtualScrollOverride}`)
    ).toHaveStyle('borderWidth', 42);
  });

  it('should change height according to rowHeight prop', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a' }, { title: 'b' }]}
        onChange={() => {}}
        rowHeight={12}
      />
    );

    // Works with static value
    expect(wrapper.find(TreeNode).first()).toHaveStyle('height', 12);

    // Works with function callback
    wrapper.setProps({ rowHeight: ({ index }) => 42 + index });
    expect(wrapper.find(TreeNode).first()).toHaveStyle('height', 42);
    expect(wrapper.find(TreeNode).last()).toHaveStyle('height', 43);
  });

  it('should toggle virtualization according to isVirtualized prop', () => {
    const virtualized = mount(
      <SortableTree
        treeData={[{ title: 'a' }, { title: 'b' }]}
        onChange={() => {}}
        isVirtualized
      />
    );

    expect(virtualized.find(List).length).toEqual(1);

    const notVirtualized = mount(
      <SortableTree
        treeData={[{ title: 'a' }, { title: 'b' }]}
        onChange={() => {}}
        isVirtualized={false}
      />
    );

    expect(notVirtualized.find(List).length).toEqual(0);
  });

  it('should change scaffold width according to scaffoldBlockPxWidth prop', () => {
    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        scaffoldBlockPxWidth={12}
      />
    );

    expect(wrapper.find(`.${treeNodeStyles.lineBlock}`)).toHaveStyle(
      'width',
      12
    );
  });

  it('should pass props to the node renderer from `generateNodeProps`', () => {
    const title = 42;
    const wrapper = mount(
      <SortableTree
        treeData={[{ title }]}
        onChange={() => {}}
        generateNodeProps={({ node }) => ({ buttons: [node.title] })}
      />
    );

    expect(wrapper.find(DefaultNodeRenderer)).toHaveProp('buttons', [title]);
  });

  it('should call the callback in `onVisibilityToggle` when visibility toggled', () => {
    let out = null;

    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a', children: [{ title: 'b' }] }]}
        onChange={treeData => wrapper.setProps({ treeData })}
        onVisibilityToggle={({ expanded }) => {
          out = expanded ? 'expanded' : 'collapsed';
        }}
      />
    );

    wrapper
      .find(`.${defaultNodeRendererStyles.expandButton}`)
      .first()
      .simulate('click');
    expect(out).toEqual('expanded');
    wrapper
      .find(`.${defaultNodeRendererStyles.collapseButton}`)
      .first()
      .simulate('click');
    expect(out).toEqual('collapsed');
  });

  it('should render with a custom `nodeContentRenderer`', () => {
    const FakeNode = ({ node }) => <div>{node.title}</div>;
    FakeNode.propTypes = { node: PropTypes.object.isRequired };

    const wrapper = mount(
      <SortableTree
        treeData={[{ title: 'a' }]}
        onChange={() => {}}
        nodeContentRenderer={FakeNode}
      />
    );

    expect(wrapper.find(FakeNode).length).toEqual(1);
  });
});
