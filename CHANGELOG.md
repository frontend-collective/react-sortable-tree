# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.1"></a>
## [1.3.1](https://github.com/fritz-c/react-sortable-tree/compare/v1.3.0...v1.3.1) (2017-10-03)


### Bug Fixes

* Allow react[@16](https://github.com/16) ([9a31a03](https://github.com/fritz-c/react-sortable-tree/commit/9a31a03))



<a name="1.3.0"></a>
# [1.3.0](https://github.com/fritz-c/react-sortable-tree/compare/v1.2.2...v1.3.0) (2017-09-20)


### Features

* Provide more row parameters in rowHeight callback ([1b88b18](https://github.com/fritz-c/react-sortable-tree/commit/1b88b18))



<a name="1.2.2"></a>
## [1.2.2](https://github.com/fritz-c/react-sortable-tree/compare/v1.2.1...v1.2.2) (2017-09-12)


### Bug Fixes

* Specify version of react-dnd-html5-backend to avoid invalid package installs ([a09b611](https://github.com/fritz-c/react-sortable-tree/commit/a09b611))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/fritz-c/react-sortable-tree/compare/v1.2.0...v1.2.1) (2017-09-06)


### Bug Fixes

* Allow children function in default renderer ([6f1dcac](https://github.com/fritz-c/react-sortable-tree/commit/6f1dcac))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/fritz-c/react-sortable-tree/compare/v1.1.1...v1.2.0) (2017-08-12)


### Features

* Add `shouldCopyOnOutsideDrop` prop to enable copying of nodes that leave the tree ([d6a9be9](https://github.com/fritz-c/react-sortable-tree/commit/d6a9be9))



<a name="1.1.1"></a>
## [1.1.1](https://github.com/fritz-c/react-sortable-tree/compare/v1.1.0...v1.1.1) (2017-08-06)


### Bug Fixes

* **tree-to-tree:** Fix node depth when dragging between trees ([323ccad](https://github.com/fritz-c/react-sortable-tree/commit/323ccad))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/fritz-c/react-sortable-tree/compare/v1.0.0...v1.1.0) (2017-08-05)


### Features

* **node-renderer:** Make title and subtitle insertable via props ([fff72c6](https://github.com/fritz-c/react-sortable-tree/commit/fff72c6))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/fritz-c/react-sortable-tree/compare/v0.1.21...v1.0.0) (2017-08-05)


### Bug Fixes

* External node offset was shifted ([d1ae0eb](https://github.com/fritz-c/react-sortable-tree/commit/d1ae0eb))


### Code Refactoring

* get rid of `dndWrapExternalSource` api ([d103e9f](https://github.com/fritz-c/react-sortable-tree/commit/d103e9f))


### Features

* **tree-to-tree:** Enable tree-to-tree drag-and-drop ([6986a23](https://github.com/fritz-c/react-sortable-tree/commit/6986a23))
* Display droppable placeholder element when tree is empty ([2cd371c](https://github.com/fritz-c/react-sortable-tree/commit/2cd371c))
* Add `prevPath` and `prevTreeIndex` to the `onMoveNode` callback ([6986a23](https://github.com/fritz-c/react-sortable-tree/commit/6986a23))


### BREAKING CHANGES

* Trees that are empty now display a placeholder element
in their place instead of being simply empty.
* `dndWrapExternalSource` api no longer exists.
You can achieve the same functionality and more with react-dnd
APIs, as demonstrated in the storybook example.



<a name="0.1.21"></a>
## [0.1.21](https://github.com/fritz-c/react-sortable-tree/compare/v0.1.20...v0.1.21) (2017-07-15)


### Bug Fixes

* Remove console.log left in after development ([da27c47](https://github.com/fritz-c/react-sortable-tree/commit/da27c47))



See the GitHub [Releases](https://github.com/fritz-c/react-sortable-tree/releases) for information on updates.
