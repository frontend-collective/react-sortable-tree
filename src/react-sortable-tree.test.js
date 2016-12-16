/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { mount } from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme';

import { AutoSizer } from 'react-virtualized';
import TreeNode from './tree-node';

import SortableTree from './react-sortable-tree';

describe('<SortableTree />', () => {
    beforeEach(() => {
        jasmineEnzyme(); // Add extra matchers like .toHaveStyle() to jasmine

        // Keep react-virtualized's AutoSizer component from hiding everything in
        // enzyme's rendering environment (which has no height/width, apparently)
        spyOn(AutoSizer.prototype, 'render').and.callFake(function renderOverride() {
            return (
                <div ref={this._setRef}>
                    {this.props.children({ width: 200, height: 99999 })}
                </div>
            );
        });
    });

    it('should render nodes for flat data', () => {
        const wrapper = mount(
            <SortableTree
                treeData={[]}
                onChange={() => {}}
            />
        );

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
                { expanded: true,  children: [{ expanded: false, children: [{}] }] },
                { expanded: false, children: [{ expanded: false, children: [{}] }] },
            ],
        });
        expect(wrapper.find(TreeNode).length).toEqual(3);
    });

    it('should change height according to rowHeight prop', () => {
        const wrapper = mount(
            <SortableTree
                treeData={[{ title: 'a' }]}
                onChange={() => {}}
                rowHeight={12}
            />
        );

        expect(wrapper.find(TreeNode)).toHaveStyle('height', 12);
    });
});
