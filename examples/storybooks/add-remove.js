import React, { Component } from 'react';
import SortableTree, { addNodeUnderParent, removeNodeAtPath } from '../../src';

const firstNames = [
  'Abraham',
  'Adam',
  'Agnar',
  'Albert',
  'Albin',
  'Albrecht',
  'Alexander',
  'Alfred',
  'Alvar',
  'Ander',
  'Andrea',
  'Arthur',
  'Axel',
  'Bengt',
  'Bernhard',
  'Carl',
  'Daniel',
  'Einar',
  'Elmer',
  'Eric',
  'Erik',
  'Gerhard',
  'Gunnar',
  'Gustaf',
  'Harald',
  'Herbert',
  'Herman',
  'Johan',
  'John',
  'Karl',
  'Leif',
  'Leonard',
  'Martin',
  'Matt',
  'Mikael',
  'Nikla',
  'Norman',
  'Oliver',
  'Olof',
  'Olvir',
  'Otto',
  'Patrik',
  'Peter',
  'Petter',
  'Robert',
  'Rupert',
  'Sigurd',
  'Simon',
];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      treeData: [{ title: 'Peter Olofsson' }, { title: 'Karl Johansson' }],
    };
  }

  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;
    const getRandomName = () =>
      firstNames[Math.floor(Math.random() * firstNames.length)];
    return (
      <div>
        <div style={{ height: 300 }}>
          <SortableTree
            treeData={this.state.treeData}
            onChange={treeData => this.setState({ treeData })}
            generateNodeProps={({ node, path }) => ({
              buttons: [
                <button
                  onClick={() =>
                    this.setState(state => ({
                      treeData: addNodeUnderParent({
                        treeData: state.treeData,
                        parentKey: path[path.length - 1],
                        expandParent: true,
                        getNodeKey,
                        newNode: {
                          title: `${getRandomName()} ${node.title.split(
                            ' '
                          )[0]}sson`,
                        },
                      }).treeData,
                    }))}
                >
                  Add Child
                </button>,
                <button
                  onClick={() =>
                    this.setState(state => ({
                      treeData: removeNodeAtPath({
                        treeData: state.treeData,
                        path,
                        getNodeKey,
                      }),
                    }))}
                >
                  Remove
                </button>,
              ],
            })}
          />
        </div>

        <button
          onClick={() =>
            this.setState(state => ({
              treeData: state.treeData.concat({
                title: `${getRandomName()} ${getRandomName()}sson`,
              }),
            }))}
        >
          Add more
        </button>
      </div>
    );
  }
}
