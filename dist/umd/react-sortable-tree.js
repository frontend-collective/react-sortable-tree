!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory(require("react"), require("lodash.isequal"), require("react-dnd"), require("react-dnd-html5-backend"), require("react-dnd-scrollzone"), require("react-virtualized")) : "function" == typeof define && define.amd ? define([ "react", "lodash.isequal", "react-dnd", "react-dnd-html5-backend", "react-dnd-scrollzone", "react-virtualized" ], factory) : "object" == typeof exports ? exports.ReactSortableTree = factory(require("react"), require("lodash.isequal"), require("react-dnd"), require("react-dnd-html5-backend"), require("react-dnd-scrollzone"), require("react-virtualized")) : root.ReactSortableTree = factory(root.react, root["lodash.isequal"], root["react-dnd"], root["react-dnd-html5-backend"], root["react-dnd-scrollzone"], root["react-virtualized"]);
}(this, function(__WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_20__, __WEBPACK_EXTERNAL_MODULE_21__, __WEBPACK_EXTERNAL_MODULE_22__, __WEBPACK_EXTERNAL_MODULE_23__, __WEBPACK_EXTERNAL_MODULE_24__) {
    /******/
    return function(modules) {
        /******/
        /******/
        // The require function
        /******/
        function __webpack_require__(moduleId) {
            /******/
            /******/
            // Check if module is in cache
            /******/
            if (installedModules[moduleId]) /******/
            return installedModules[moduleId].exports;
            /******/
            /******/
            // Create a new module (and put it into the cache)
            /******/
            var module = installedModules[moduleId] = {
                /******/
                exports: {},
                /******/
                id: moduleId,
                /******/
                loaded: !1
            };
            /******/
            /******/
            // Return the exports of the module
            /******/
            /******/
            /******/
            // Execute the module function
            /******/
            /******/
            /******/
            // Flag the module as loaded
            /******/
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.loaded = !0, module.exports;
        }
        // webpackBootstrap
        /******/
        // The module cache
        /******/
        var installedModules = {};
        /******/
        /******/
        // Load entry module and return exports
        /******/
        /******/
        /******/
        /******/
        // expose the modules object (__webpack_modules__)
        /******/
        /******/
        /******/
        // expose the module cache
        /******/
        /******/
        /******/
        // __webpack_public_path__
        /******/
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.p = "", __webpack_require__(0);
    }([ /* 0 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _defaultHandlers = __webpack_require__(5);
        Object.keys(_defaultHandlers).forEach(function(key) {
            "default" !== key && "__esModule" !== key && Object.defineProperty(exports, key, {
                enumerable: !0,
                get: function() {
                    return _defaultHandlers[key];
                }
            });
        });
        var _treeDataUtils = __webpack_require__(1);
        Object.keys(_treeDataUtils).forEach(function(key) {
            "default" !== key && "__esModule" !== key && Object.defineProperty(exports, key, {
                enumerable: !0,
                get: function() {
                    return _treeDataUtils[key];
                }
            });
        });
        var _reactSortableTree = __webpack_require__(7), _reactSortableTree2 = _interopRequireDefault(_reactSortableTree);
        exports.default = _reactSortableTree2.default;
    }, /* 1 */
    /***/
    function(module, exports) {
        "use strict";
        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
            return Array.from(arr);
        }
        /**
	 * Performs a depth-first traversal over all of the node descendants,
	 * incrementing currentIndex by 1 for each
	 */
        function getNodeDataAtTreeIndexOrNextIndex(_ref) {
            var targetIndex = _ref.targetIndex, node = _ref.node, currentIndex = _ref.currentIndex, getNodeKey = _ref.getNodeKey, _ref$path = _ref.path, path = void 0 === _ref$path ? [] : _ref$path, _ref$lowerSiblingCoun = _ref.lowerSiblingCounts, lowerSiblingCounts = void 0 === _ref$lowerSiblingCoun ? [] : _ref$lowerSiblingCoun, _ref$ignoreCollapsed = _ref.ignoreCollapsed, ignoreCollapsed = void 0 === _ref$ignoreCollapsed || _ref$ignoreCollapsed, _ref$isPseudoRoot = _ref.isPseudoRoot, isPseudoRoot = void 0 !== _ref$isPseudoRoot && _ref$isPseudoRoot, selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                node: node,
                treeIndex: currentIndex
            }) ]);
            // Return target node when found
            if (currentIndex === targetIndex) return {
                node: node,
                lowerSiblingCounts: lowerSiblingCounts,
                path: selfPath
            };
            // Add one and continue for nodes with no children or hidden children
            if (!node.children || ignoreCollapsed && node.expanded !== !0) return {
                nextIndex: currentIndex + 1
            };
            for (var childIndex = currentIndex + 1, childCount = node.children.length, i = 0; i < childCount; i++) {
                var result = getNodeDataAtTreeIndexOrNextIndex({
                    ignoreCollapsed: ignoreCollapsed,
                    getNodeKey: getNodeKey,
                    targetIndex: targetIndex,
                    node: node.children[i],
                    currentIndex: childIndex,
                    lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [ childCount - i - 1 ]),
                    path: selfPath
                });
                if (result.node) return result;
                childIndex = result.nextIndex;
            }
            // If the target node is not found, return the farthest traversed index
            return {
                nextIndex: childIndex
            };
        }
        function getDescendantCount(_ref2) {
            var node = _ref2.node, _ref2$ignoreCollapsed = _ref2.ignoreCollapsed, ignoreCollapsed = void 0 === _ref2$ignoreCollapsed || _ref2$ignoreCollapsed;
            return getNodeDataAtTreeIndexOrNextIndex({
                getNodeKey: function() {},
                ignoreCollapsed: ignoreCollapsed,
                node: node,
                currentIndex: 0,
                targetIndex: -1
            }).nextIndex - 1;
        }
        /**
	 * Walk all descendants of the given node
	 */
        function walkDescendants(_ref3) {
            var callback = _ref3.callback, getNodeKey = _ref3.getNodeKey, ignoreCollapsed = _ref3.ignoreCollapsed, _ref3$isPseudoRoot = _ref3.isPseudoRoot, isPseudoRoot = void 0 !== _ref3$isPseudoRoot && _ref3$isPseudoRoot, node = _ref3.node, currentIndex = _ref3.currentIndex, _ref3$path = _ref3.path, path = void 0 === _ref3$path ? [] : _ref3$path, _ref3$lowerSiblingCou = _ref3.lowerSiblingCounts, lowerSiblingCounts = void 0 === _ref3$lowerSiblingCou ? [] : _ref3$lowerSiblingCou, selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                node: node,
                treeIndex: currentIndex
            }) ]), selfInfo = isPseudoRoot ? null : {
                node: node,
                path: selfPath,
                lowerSiblingCounts: lowerSiblingCounts,
                treeIndex: currentIndex
            };
            if (!isPseudoRoot) {
                var callbackResult = callback(selfInfo);
                // Cut walk short if the callback returned false
                if (callbackResult === !1) return !1;
            }
            // Return self on nodes with no children or hidden children
            if (!node.children || node.expanded !== !0 && ignoreCollapsed && !isPseudoRoot) return currentIndex;
            // Get all descendants
            var childIndex = currentIndex, childCount = node.children.length;
            if ("function" != typeof node.children) for (var i = 0; i < childCount; i++) // Cut walk short if the callback returned false
            if (childIndex = walkDescendants({
                callback: callback,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                node: node.children[i],
                currentIndex: childIndex + 1,
                lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [ childCount - i - 1 ]),
                path: selfPath
            }), childIndex === !1) return !1;
            return childIndex;
        }
        /**
	 * Perform a change on the given node and all its descendants
	 */
        function mapDescendants(_ref4) {
            var callback = _ref4.callback, getNodeKey = _ref4.getNodeKey, ignoreCollapsed = _ref4.ignoreCollapsed, _ref4$isPseudoRoot = _ref4.isPseudoRoot, isPseudoRoot = void 0 !== _ref4$isPseudoRoot && _ref4$isPseudoRoot, node = _ref4.node, currentIndex = _ref4.currentIndex, _ref4$path = _ref4.path, path = void 0 === _ref4$path ? [] : _ref4$path, _ref4$lowerSiblingCou = _ref4.lowerSiblingCounts, lowerSiblingCounts = void 0 === _ref4$lowerSiblingCou ? [] : _ref4$lowerSiblingCou, selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                node: node,
                treeIndex: currentIndex
            }) ]), selfInfo = isPseudoRoot ? null : {
                node: node,
                path: selfPath,
                lowerSiblingCounts: lowerSiblingCounts,
                treeIndex: currentIndex
            };
            // Return self on nodes with no children or hidden children
            if (!node.children || node.expanded !== !0 && ignoreCollapsed && !isPseudoRoot) return {
                treeIndex: currentIndex,
                node: callback(selfInfo)
            };
            // Get all descendants
            var childIndex = currentIndex, childCount = node.children.length, newChildren = node.children;
            return "function" != typeof newChildren && (newChildren = newChildren.map(function(child, i) {
                var mapResult = mapDescendants({
                    callback: callback,
                    getNodeKey: getNodeKey,
                    ignoreCollapsed: ignoreCollapsed,
                    node: child,
                    currentIndex: childIndex + 1,
                    lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [ childCount - i - 1 ]),
                    path: selfPath
                });
                return childIndex = mapResult.treeIndex, mapResult.node;
            })), {
                node: callback(_extends({}, selfInfo, {
                    node: _extends({}, node, {
                        children: newChildren
                    })
                })),
                treeIndex: childIndex
            };
        }
        /**
	 * Count all the visible (expanded) descendants in the tree data.
	 *
	 * @param {!Object[]} treeData - Tree data
	 *
	 * @return {number} count
	 */
        function getVisibleNodeCount(_ref5) {
            var treeData = _ref5.treeData, traverse = function traverse(node) {
                return node.children && node.expanded === !0 && "function" != typeof node.children ? 1 + node.children.reduce(function(total, currentNode) {
                    return total + traverse(currentNode);
                }, 0) : 1;
            };
            return treeData.reduce(function(total, currentNode) {
                return total + traverse(currentNode);
            }, 0);
        }
        /**
	 * Get the <targetIndex>th visible node in the tree data.
	 *
	 * @param {!Object[]} treeData - Tree data
	 * @param {!number} targetIndex - The index of the node to search for
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 *
	 * @return {{
	 *      node: Object,
	 *      path: []string|[]number,
	 *      lowerSiblingCounts: []number
	 *  }|null} node - The node at targetIndex, or null if not found
	 */
        function getVisibleNodeInfoAtIndex(_ref6) {
            var treeData = _ref6.treeData, targetIndex = _ref6.index, getNodeKey = _ref6.getNodeKey;
            if (!treeData || treeData.length < 1) return null;
            // Call the tree traversal with a pseudo-root node
            var result = getNodeDataAtTreeIndexOrNextIndex({
                targetIndex: targetIndex,
                getNodeKey: getNodeKey,
                node: {
                    children: treeData,
                    expanded: !0
                },
                currentIndex: -1,
                path: [],
                lowerSiblingCounts: [],
                isPseudoRoot: !0
            });
            return result.node ? result : null;
        }
        /**
	 * Walk descendants depth-first and call a callback on each
	 *
	 * @param {!Object[]} treeData - Tree data
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {function} callback - Function to call on each node
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 *
	 * @return void
	 */
        function walk(_ref7) {
            var treeData = _ref7.treeData, getNodeKey = _ref7.getNodeKey, callback = _ref7.callback, _ref7$ignoreCollapsed = _ref7.ignoreCollapsed, ignoreCollapsed = void 0 === _ref7$ignoreCollapsed || _ref7$ignoreCollapsed;
            if (treeData && !(treeData.length < 1)) return walkDescendants({
                callback: callback,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                isPseudoRoot: !0,
                node: {
                    children: treeData
                },
                currentIndex: -1,
                path: [],
                lowerSiblingCounts: []
            });
        }
        /**
	 * Perform a depth-first transversal of the descendants and
	 *  make a change to every node in the tree
	 *
	 * @param {!Object[]} treeData - Tree data
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {function} callback - Function to call on each node
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 *
	 * @return {Object[]} changedTreeData - The changed tree data
	 */
        function map(_ref8) {
            var treeData = _ref8.treeData, getNodeKey = _ref8.getNodeKey, callback = _ref8.callback, _ref8$ignoreCollapsed = _ref8.ignoreCollapsed, ignoreCollapsed = void 0 === _ref8$ignoreCollapsed || _ref8$ignoreCollapsed;
            return !treeData || treeData.length < 1 ? [] : mapDescendants({
                callback: callback,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                isPseudoRoot: !0,
                node: {
                    children: treeData
                },
                currentIndex: -1,
                path: [],
                lowerSiblingCounts: []
            }).node.children;
        }
        /**
	 * Expand or close every node in the tree
	 *
	 * @param {!Object[]} treeData - Tree data
	 * @param {?boolean} expanded - Whether the node is expanded or not
	 *
	 * @return {Object[]} changedTreeData - The changed tree data
	 */
        function toggleExpandedForAll(_ref9) {
            var treeData = _ref9.treeData, _ref9$expanded = _ref9.expanded, expanded = void 0 === _ref9$expanded || _ref9$expanded;
            return map({
                treeData: treeData,
                callback: function(_ref10) {
                    var node = _ref10.node;
                    return _extends({}, node, {
                        expanded: expanded
                    });
                },
                getNodeKey: function(_ref11) {
                    var treeIndex = _ref11.treeIndex;
                    return treeIndex;
                },
                ignoreCollapsed: !1
            });
        }
        /**
	 * Replaces node at path with object, or callback-defined object
	 *
	 * @param {!Object[]} treeData
	 * @param {number[]|string[]} path - Array of keys leading up to node to be changed
	 * @param {function|any} newNode - Node to replace the node at the path with, or a function producing the new node
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 *
	 * @return {Object[]} changedTreeData - The changed tree data
	 */
        function changeNodeAtPath(_ref12) {
            var treeData = _ref12.treeData, path = _ref12.path, newNode = _ref12.newNode, getNodeKey = _ref12.getNodeKey, _ref12$ignoreCollapse = _ref12.ignoreCollapsed, ignoreCollapsed = void 0 === _ref12$ignoreCollapse || _ref12$ignoreCollapse, RESULT_MISS = "RESULT_MISS", traverse = function traverse(_ref13) {
                var _ref13$isPseudoRoot = _ref13.isPseudoRoot, isPseudoRoot = void 0 !== _ref13$isPseudoRoot && _ref13$isPseudoRoot, node = _ref13.node, currentTreeIndex = _ref13.currentTreeIndex, pathIndex = _ref13.pathIndex;
                if (!isPseudoRoot && getNodeKey({
                    node: node,
                    treeIndex: currentTreeIndex
                }) !== path[pathIndex]) return RESULT_MISS;
                if (pathIndex >= path.length - 1) // If this is the final location in the path, return its changed form
                return "function" == typeof newNode ? newNode({
                    node: node,
                    treeIndex: currentTreeIndex
                }) : newNode;
                if (!node.children) // If this node is part of the path, but has no children, return the unchanged node
                throw new Error("Path referenced children of node with no children.");
                for (var nextTreeIndex = currentTreeIndex + 1, i = 0; i < node.children.length; i++) {
                    var _result = traverse({
                        node: node.children[i],
                        currentTreeIndex: nextTreeIndex,
                        pathIndex: pathIndex + 1
                    });
                    // If the result went down the correct path
                    if (_result !== RESULT_MISS) return _result ? _extends({}, node, {
                        children: [].concat(_toConsumableArray(node.children.slice(0, i)), [ _result ], _toConsumableArray(node.children.slice(i + 1)))
                    }) : _extends({}, node, {
                        children: [].concat(_toConsumableArray(node.children.slice(0, i)), _toConsumableArray(node.children.slice(i + 1)))
                    });
                    nextTreeIndex += 1 + getDescendantCount({
                        node: node.children[i],
                        ignoreCollapsed: ignoreCollapsed
                    });
                }
                return RESULT_MISS;
            }, result = traverse({
                node: {
                    children: treeData
                },
                currentTreeIndex: -1,
                pathIndex: -1,
                isPseudoRoot: !0
            });
            if (result === RESULT_MISS) throw new Error("No node found at the given path.");
            return result.children;
        }
        /**
	 * Removes the node at the specified path and returns the resulting treeData.
	 *
	 * @param {!Object[]} treeData
	 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 *
	 * @return {Object[]} changedTreeData - The tree data with the node removed
	 */
        function removeNodeAtPath(_ref14) {
            var treeData = _ref14.treeData, path = _ref14.path, getNodeKey = _ref14.getNodeKey, _ref14$ignoreCollapse = _ref14.ignoreCollapsed, ignoreCollapsed = void 0 === _ref14$ignoreCollapse || _ref14$ignoreCollapse;
            return changeNodeAtPath({
                treeData: treeData,
                path: path,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                newNode: null
            });
        }
        /**
	 * Gets the node at the specified path
	 *
	 * @param {!Object[]} treeData
	 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 *
	 * @return {Object|null} nodeInfo - The node info at the given path, or null if not found
	 */
        function getNodeAtPath(_ref15) {
            var treeData = _ref15.treeData, path = _ref15.path, getNodeKey = _ref15.getNodeKey, _ref15$ignoreCollapse = _ref15.ignoreCollapsed, ignoreCollapsed = void 0 === _ref15$ignoreCollapse || _ref15$ignoreCollapse, foundNodeInfo = null;
            try {
                changeNodeAtPath({
                    treeData: treeData,
                    path: path,
                    getNodeKey: getNodeKey,
                    ignoreCollapsed: ignoreCollapsed,
                    newNode: function(_ref16) {
                        var node = _ref16.node, treeIndex = _ref16.treeIndex;
                        return foundNodeInfo = {
                            node: node,
                            treeIndex: treeIndex
                        }, node;
                    }
                });
            } catch (err) {}
            return foundNodeInfo;
        }
        /**
	 * Adds the node to the specified parent and returns the resulting treeData.
	 *
	 * @param {!Object[]} treeData
	 * @param {!Object} newNode - The node to insert
	 * @param {number|string} parentKey - The key of the to-be parentNode of the node
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 * @param {boolean=} expandParent - If true, expands the parentNode specified by parentPath
	 *
	 * @return {Object} result
	 * @return {Object[]} result.treeData - The updated tree data
	 * @return {number} result.treeIndex - The tree index at which the node was inserted
	 */
        function addNodeUnderParent(_ref17) {
            var treeData = _ref17.treeData, newNode = _ref17.newNode, _ref17$parentKey = _ref17.parentKey, parentKey = void 0 === _ref17$parentKey ? null : _ref17$parentKey, getNodeKey = _ref17.getNodeKey, _ref17$ignoreCollapse = _ref17.ignoreCollapsed, ignoreCollapsed = void 0 === _ref17$ignoreCollapse || _ref17$ignoreCollapse, _ref17$expandParent = _ref17.expandParent, expandParent = void 0 !== _ref17$expandParent && _ref17$expandParent;
            if (null === parentKey) return {
                treeData: [].concat(_toConsumableArray(treeData || []), [ newNode ]),
                treeIndex: (treeData || []).length
            };
            var insertedTreeIndex = null, hasBeenAdded = !1, changedTreeData = map({
                treeData: treeData,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                callback: function(_ref18) {
                    var node = _ref18.node, treeIndex = _ref18.treeIndex, path = _ref18.path, key = path ? path[path.length - 1] : null;
                    // Return nodes that are not the parent as-is
                    if (hasBeenAdded || key !== parentKey) return node;
                    hasBeenAdded = !0;
                    var parentNode = _extends({}, node);
                    // If no children exist yet, just add the single newNode
                    if (expandParent && (parentNode.expanded = !0), !parentNode.children) return insertedTreeIndex = treeIndex + 1, 
                    _extends({}, parentNode, {
                        children: [ newNode ]
                    });
                    if ("function" == typeof parentNode.children) throw new Error("Cannot add to children defined by a function");
                    for (var nextTreeIndex = treeIndex + 1, i = 0; i < parentNode.children.length; i++) nextTreeIndex += 1 + getDescendantCount({
                        node: parentNode.children[i],
                        ignoreCollapsed: ignoreCollapsed
                    });
                    return insertedTreeIndex = nextTreeIndex, _extends({}, parentNode, {
                        children: [].concat(_toConsumableArray(parentNode.children), [ newNode ])
                    });
                }
            });
            if (!hasBeenAdded) throw new Error("No node found with the given key.");
            return {
                treeData: changedTreeData,
                treeIndex: insertedTreeIndex
            };
        }
        function addNodeAtDepthAndIndex(_ref19) {
            var targetDepth = _ref19.targetDepth, minimumTreeIndex = _ref19.minimumTreeIndex, newNode = _ref19.newNode, ignoreCollapsed = _ref19.ignoreCollapsed, expandParent = _ref19.expandParent, _ref19$isPseudoRoot = _ref19.isPseudoRoot, isPseudoRoot = void 0 !== _ref19$isPseudoRoot && _ref19$isPseudoRoot, isLastChild = _ref19.isLastChild, node = _ref19.node, currentIndex = _ref19.currentIndex, currentDepth = _ref19.currentDepth, getNodeKey = _ref19.getNodeKey, _ref19$path = _ref19.path, path = void 0 === _ref19$path ? [] : _ref19$path, selfPath = function(n) {
                return isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                    node: n,
                    treeIndex: currentIndex
                }) ]);
            };
            // If the potential parent node is at the targetDepth, it isn't eligible
            if (currentDepth === targetDepth) return {
                node: node,
                nextIndex: currentIndex + 1 + getDescendantCount({
                    node: node,
                    ignoreCollapsed: ignoreCollapsed
                })
            };
            // If the current position is the only possible place to add, add it
            if (currentIndex >= minimumTreeIndex - 1 || isLastChild && !node.children) {
                if ("function" == typeof node.children) throw new Error("Cannot add to children defined by a function");
                var extraNodeProps = expandParent ? {
                    expanded: !0
                } : {}, _nextNode = _extends({}, node, extraNodeProps, {
                    children: node.children ? [ newNode ].concat(_toConsumableArray(node.children)) : [ newNode ]
                });
                return {
                    node: _nextNode,
                    nextIndex: currentIndex + 2,
                    insertedTreeIndex: currentIndex + 1,
                    parentPath: selfPath(_nextNode)
                };
            }
            if (currentDepth === targetDepth - 1) {
                // Skip over nodes with no children or hidden children
                if (!node.children || "function" == typeof node.children || node.expanded !== !0 && ignoreCollapsed && !isPseudoRoot) return {
                    node: node,
                    nextIndex: currentIndex + 1
                };
                for (var _childIndex = currentIndex + 1, _insertedTreeIndex = null, insertIndex = null, i = 0; i < node.children.length; i++) {
                    if (_childIndex >= minimumTreeIndex) {
                        _insertedTreeIndex = _childIndex, insertIndex = i;
                        break;
                    }
                    _childIndex += 1 + getDescendantCount({
                        node: node.children[i],
                        ignoreCollapsed: ignoreCollapsed
                    });
                }
                if (null === insertIndex) {
                    if (_childIndex < minimumTreeIndex && !isLastChild) return {
                        node: node,
                        nextIndex: _childIndex
                    };
                    _insertedTreeIndex = _childIndex, insertIndex = node.children.length;
                }
                var _nextNode2 = _extends({}, node, {
                    children: [].concat(_toConsumableArray(node.children.slice(0, insertIndex)), [ newNode ], _toConsumableArray(node.children.slice(insertIndex)))
                });
                return {
                    node: _nextNode2,
                    nextIndex: _childIndex,
                    insertedTreeIndex: _insertedTreeIndex,
                    parentPath: selfPath(_nextNode2)
                };
            }
            // Skip over nodes with no children or hidden children
            if (!node.children || "function" == typeof node.children || node.expanded !== !0 && ignoreCollapsed && !isPseudoRoot) return {
                node: node,
                nextIndex: currentIndex + 1
            };
            // Get all descendants
            var insertedTreeIndex = null, pathFragment = null, childIndex = currentIndex + 1, newChildren = node.children;
            "function" != typeof newChildren && (newChildren = newChildren.map(function(child, i) {
                if (null !== insertedTreeIndex) return child;
                var mapResult = addNodeAtDepthAndIndex({
                    targetDepth: targetDepth,
                    minimumTreeIndex: minimumTreeIndex,
                    newNode: newNode,
                    ignoreCollapsed: ignoreCollapsed,
                    expandParent: expandParent,
                    isLastChild: isLastChild && i === newChildren.length - 1,
                    node: child,
                    currentIndex: childIndex,
                    currentDepth: currentDepth + 1,
                    getNodeKey: getNodeKey,
                    path: []
                });
                return "insertedTreeIndex" in mapResult && (insertedTreeIndex = mapResult.insertedTreeIndex, 
                pathFragment = mapResult.parentPath), childIndex = mapResult.nextIndex, mapResult.node;
            }));
            var nextNode = _extends({}, node, {
                children: newChildren
            }), result = {
                node: nextNode,
                nextIndex: childIndex
            };
            return null !== insertedTreeIndex && (result.insertedTreeIndex = insertedTreeIndex, 
            result.parentPath = [].concat(_toConsumableArray(selfPath(nextNode)), _toConsumableArray(pathFragment))), 
            result;
        }
        /**
	 * Insert a node into the tree at the given depth, after the minimum index
	 *
	 * @param {!Object[]} treeData - Tree data
	 * @param {!number} depth - The depth to insert the node at
	 * @param {!number} minimumTreeIndex - The lowest possible treeIndex to insert the node at
	 * @param {!Object} newNode - The node to insert into the tree
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 * @param {boolean=} expandParent - If true, expands the parent of the inserted node
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 *
	
	 * @return {Object} result
	 * @return {Object[]} result.treeData - The tree data with the node added
	 * @return {number} result.treeIndex - The tree index at which the node was inserted
	 * @return {number[]|string[]} result.path - Array of keys leading to the node location after insertion
	 */
        function insertNode(_ref20) {
            var treeData = _ref20.treeData, targetDepth = _ref20.depth, minimumTreeIndex = _ref20.minimumTreeIndex, newNode = _ref20.newNode, _ref20$getNodeKey = _ref20.getNodeKey, getNodeKey = void 0 === _ref20$getNodeKey ? function() {} : _ref20$getNodeKey, _ref20$ignoreCollapse = _ref20.ignoreCollapsed, ignoreCollapsed = void 0 === _ref20$ignoreCollapse || _ref20$ignoreCollapse, _ref20$expandParent = _ref20.expandParent, expandParent = void 0 !== _ref20$expandParent && _ref20$expandParent;
            if (!treeData && 0 === targetDepth) return {
                treeData: [ newNode ],
                treeIndex: 0,
                path: [ getNodeKey({
                    node: newNode,
                    treeIndex: 0
                }) ]
            };
            var insertResult = addNodeAtDepthAndIndex({
                targetDepth: targetDepth,
                minimumTreeIndex: minimumTreeIndex,
                newNode: newNode,
                ignoreCollapsed: ignoreCollapsed,
                expandParent: expandParent,
                getNodeKey: getNodeKey,
                isPseudoRoot: !0,
                isLastChild: !0,
                node: {
                    children: treeData
                },
                currentIndex: -1,
                currentDepth: -1
            });
            if (!("insertedTreeIndex" in insertResult)) throw new Error("No suitable position found to insert.");
            var treeIndex = insertResult.insertedTreeIndex;
            return {
                treeData: insertResult.node.children,
                treeIndex: treeIndex,
                path: [].concat(_toConsumableArray(insertResult.parentPath), [ getNodeKey({
                    node: newNode,
                    treeIndex: treeIndex
                }) ])
            };
        }
        /**
	 * Get tree data flattened.
	 *
	 * @param {!Object[]} treeData - Tree data
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
	 *
	 * @return {{
	 *      node: Object,
	 *      path: []string|[]number,
	 *      lowerSiblingCounts: []number
	 *  }}[] nodes - The node array
	 */
        function getFlatDataFromTree(_ref21) {
            var treeData = _ref21.treeData, getNodeKey = _ref21.getNodeKey, _ref21$ignoreCollapse = _ref21.ignoreCollapsed, ignoreCollapsed = void 0 === _ref21$ignoreCollapse || _ref21$ignoreCollapse;
            if (!treeData || treeData.length < 1) return [];
            var flattened = [];
            return walk({
                treeData: treeData,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                callback: function(_ref22) {
                    var node = _ref22.node, lowerSiblingCounts = _ref22.lowerSiblingCounts, path = _ref22.path, treeIndex = _ref22.treeIndex;
                    flattened.push({
                        node: node,
                        lowerSiblingCounts: lowerSiblingCounts,
                        path: path,
                        treeIndex: treeIndex
                    });
                }
            }), flattened;
        }
        /**
	 * Generate a tree structure from flat data.
	 *
	 * @param {!Object[]} flatData
	 * @param {!function=} getKey - Function to get the key from the nodeData
	 * @param {!function=} getParentKey - Function to get the parent key from the nodeData
	 * @param {string|number=} rootKey - The value returned by `getParentKey` that corresponds to the root node.
	 *                                  For example, if your nodes have id 1-99, you might use rootKey = 0
	 *
	 * @return {Object[]} treeData - The flat data represented as a tree
	 */
        function getTreeFromFlatData(_ref23) {
            var flatData = _ref23.flatData, _ref23$getKey = _ref23.getKey, getKey = void 0 === _ref23$getKey ? function(node) {
                return node.id;
            } : _ref23$getKey, _ref23$getParentKey = _ref23.getParentKey, getParentKey = void 0 === _ref23$getParentKey ? function(node) {
                return node.parentId;
            } : _ref23$getParentKey, _ref23$rootKey = _ref23.rootKey, rootKey = void 0 === _ref23$rootKey ? "0" : _ref23$rootKey;
            if (!flatData) return [];
            var childrenToParents = {};
            if (flatData.forEach(function(child) {
                var parentKey = getParentKey(child);
                parentKey in childrenToParents ? childrenToParents[parentKey].push(child) : childrenToParents[parentKey] = [ child ];
            }), !(rootKey in childrenToParents)) return [];
            var trav = function trav(parent) {
                var parentKey = getKey(parent);
                return parentKey in childrenToParents ? _extends({}, parent, {
                    children: childrenToParents[parentKey].map(function(child) {
                        return trav(child);
                    })
                }) : _extends({}, parent);
            };
            return childrenToParents[rootKey].map(function(child) {
                return trav(child);
            });
        }
        /**
	 * Check if a node is a descendant of another node.
	 *
	 * @param {!Object} older - Potential ancestor of younger node
	 * @param {!Object} younger - Potential descendant of older node
	 *
	 * @return {boolean}
	 */
        function isDescendant(older, younger) {
            return !!older.children && "function" != typeof older.children && older.children.some(function(child) {
                return child === younger || isDescendant(child, younger);
            });
        }
        /**
	 * Get the maximum depth of the children (the depth of the root node is 0).
	 *
	 * @param {!Object} node - Node in the tree
	 * @param {?number} depth - The current depth
	 *
	 * @return {number} maxDepth - The deepest depth in the tree
	 */
        function getDepth(node) {
            var depth = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            return node.children ? "function" == typeof node.children ? depth + 1 : node.children.reduce(function(deepest, child) {
                return Math.max(deepest, getDepth(child, depth + 1));
            }, depth) : depth;
        }
        /**
	 * Find nodes matching a search query in the tree,
	 *
	 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
	 * @param {!Object[]} treeData - Tree data
	 * @param {?string|number} searchQuery - Function returning a boolean to indicate whether the node is a match or not
	 * @param {!function} searchMethod - Function returning a boolean to indicate whether the node is a match or not
	 * @param {?number} searchFocusOffset - The offset of the match to focus on
	 *                                      (e.g., 0 focuses on the first match, 1 on the second)
	 * @param {boolean=} expandAllMatchPaths - If true, expands the paths to any matched node
	 * @param {boolean=} expandFocusMatchPaths - If true, expands the path to the focused node
	 *
	 * @return {Object[]} matches - An array of objects containing the matching `node`s, their `path`s and `treeIndex`s
	 * @return {Object[]} treeData - The original tree data with all relevant nodes expanded.
	 *                               If expandAllMatchPaths and expandFocusMatchPaths are both false,
	 *                               it will be the same as the original tree data.
	 */
        function find(_ref24) {
            var getNodeKey = _ref24.getNodeKey, treeData = _ref24.treeData, searchQuery = _ref24.searchQuery, searchMethod = _ref24.searchMethod, searchFocusOffset = _ref24.searchFocusOffset, _ref24$expandAllMatch = _ref24.expandAllMatchPaths, expandAllMatchPaths = void 0 !== _ref24$expandAllMatch && _ref24$expandAllMatch, _ref24$expandFocusMat = _ref24.expandFocusMatchPaths, expandFocusMatchPaths = void 0 === _ref24$expandFocusMat || _ref24$expandFocusMat, matchCount = 0, trav = function trav(_ref25) {
                var _ref25$isPseudoRoot = _ref25.isPseudoRoot, isPseudoRoot = void 0 !== _ref25$isPseudoRoot && _ref25$isPseudoRoot, node = _ref25.node, currentIndex = _ref25.currentIndex, _ref25$path = _ref25.path, path = void 0 === _ref25$path ? [] : _ref25$path, matches = [], isSelfMatch = !1, hasFocusMatch = !1, selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                    node: node,
                    treeIndex: currentIndex
                }) ]), extraInfo = isPseudoRoot ? null : {
                    path: selfPath,
                    treeIndex: currentIndex
                }, hasChildren = node.children && "function" != typeof node.children && node.children.length > 0;
                // Examine the current node to see if it is a match
                !isPseudoRoot && searchMethod(_extends({}, extraInfo, {
                    node: node,
                    searchQuery: searchQuery
                })) && (matchCount === searchFocusOffset && (hasFocusMatch = !0), // Keep track of the number of matching nodes, so we know when the searchFocusOffset
                //  is reached
                matchCount++, // We cannot add this node to the matches right away, as it may be changed
                //  during the search of the descendants. The entire node is used in
                //  comparisons between nodes inside the `matches` and `treeData` results
                //  of this method (`find`)
                isSelfMatch = !0);
                var childIndex = currentIndex, newNode = _extends({}, node);
                // Get all descendants
                // Cannot assign a treeIndex to hidden nodes
                // Add this node to the matches if it fits the search criteria.
                // This is performed at the last minute so newNode can be sent in its final form.
                return hasChildren && (newNode.children = newNode.children.map(function(child) {
                    var mapResult = trav({
                        node: child,
                        currentIndex: childIndex + 1,
                        path: selfPath
                    });
                    // Ignore hidden nodes by only advancing the index counter to the returned treeIndex
                    // if the child is expanded.
                    //
                    // The child could have been expanded from the start,
                    // or expanded due to a matching node being found in its descendants
                    // Expand the current node if it has descendants matching the search
                    // and the settings are set to do so.
                    return mapResult.node.expanded ? childIndex = mapResult.treeIndex : childIndex += 1, 
                    (mapResult.matches.length > 0 || mapResult.hasFocusMatch) && (matches = [].concat(_toConsumableArray(matches), _toConsumableArray(mapResult.matches)), 
                    mapResult.hasFocusMatch && (hasFocusMatch = !0), (expandAllMatchPaths && mapResult.matches.length > 0 || (expandAllMatchPaths || expandFocusMatchPaths) && mapResult.hasFocusMatch) && (newNode.expanded = !0)), 
                    mapResult.node;
                })), isPseudoRoot || newNode.expanded || (matches = matches.map(function(match) {
                    return _extends({}, match, {
                        treeIndex: null
                    });
                })), isSelfMatch && (matches = [ _extends({}, extraInfo, {
                    node: newNode
                }) ].concat(_toConsumableArray(matches))), {
                    node: matches.length > 0 ? newNode : node,
                    matches: matches,
                    hasFocusMatch: hasFocusMatch,
                    treeIndex: childIndex
                };
            }, result = trav({
                node: {
                    children: treeData
                },
                isPseudoRoot: !0,
                currentIndex: -1
            });
            return {
                matches: result.matches,
                treeData: result.node.children
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        };
        exports.getDescendantCount = getDescendantCount, exports.getVisibleNodeCount = getVisibleNodeCount, 
        exports.getVisibleNodeInfoAtIndex = getVisibleNodeInfoAtIndex, exports.walk = walk, 
        exports.map = map, exports.toggleExpandedForAll = toggleExpandedForAll, exports.changeNodeAtPath = changeNodeAtPath, 
        exports.removeNodeAtPath = removeNodeAtPath, exports.getNodeAtPath = getNodeAtPath, 
        exports.addNodeUnderParent = addNodeUnderParent, exports.insertNode = insertNode, 
        exports.getFlatDataFromTree = getFlatDataFromTree, exports.getTreeFromFlatData = getTreeFromFlatData, 
        exports.isDescendant = isDescendant, exports.getDepth = getDepth, exports.find = find;
    }, /* 2 */
    /***/
    function(module, exports) {
        /*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
        // css base code, injected by the css-loader
        module.exports = function() {
            var list = [];
            // return the list of modules as css string
            // import a list of modules into the list
            return list.toString = function() {
                for (var result = [], i = 0; i < this.length; i++) {
                    var item = this[i];
                    item[2] ? result.push("@media " + item[2] + "{" + item[1] + "}") : result.push(item[1]);
                }
                return result.join("");
            }, list.i = function(modules, mediaQuery) {
                "string" == typeof modules && (modules = [ [ null, modules, "" ] ]);
                for (var alreadyImportedModules = {}, i = 0; i < this.length; i++) {
                    var id = this[i][0];
                    "number" == typeof id && (alreadyImportedModules[id] = !0);
                }
                for (i = 0; i < modules.length; i++) {
                    var item = modules[i];
                    // skip already imported module
                    // this implementation is not 100% perfect for weird media query combinations
                    //  when a module is imported multiple times with different media queries.
                    //  I hope this will never occur (Hey this way we have smaller bundles)
                    "number" == typeof item[0] && alreadyImportedModules[item[0]] || (mediaQuery && !item[2] ? item[2] = mediaQuery : mediaQuery && (item[2] = "(" + item[2] + ") and (" + mediaQuery + ")"), 
                    list.push(item));
                }
            }, list;
        };
    }, /* 3 */
    /***/
    function(module, exports, __webpack_require__) {
        function addStylesToDom(styles, options) {
            for (var i = 0; i < styles.length; i++) {
                var item = styles[i], domStyle = stylesInDom[item.id];
                if (domStyle) {
                    domStyle.refs++;
                    for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j](item.parts[j]);
                    for (;j < item.parts.length; j++) domStyle.parts.push(addStyle(item.parts[j], options));
                } else {
                    for (var parts = [], j = 0; j < item.parts.length; j++) parts.push(addStyle(item.parts[j], options));
                    stylesInDom[item.id] = {
                        id: item.id,
                        refs: 1,
                        parts: parts
                    };
                }
            }
        }
        function listToStyles(list) {
            for (var styles = [], newStyles = {}, i = 0; i < list.length; i++) {
                var item = list[i], id = item[0], css = item[1], media = item[2], sourceMap = item[3], part = {
                    css: css,
                    media: media,
                    sourceMap: sourceMap
                };
                newStyles[id] ? newStyles[id].parts.push(part) : styles.push(newStyles[id] = {
                    id: id,
                    parts: [ part ]
                });
            }
            return styles;
        }
        function insertStyleElement(options, styleElement) {
            var head = getHeadElement(), lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
            if ("top" === options.insertAt) lastStyleElementInsertedAtTop ? lastStyleElementInsertedAtTop.nextSibling ? head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling) : head.appendChild(styleElement) : head.insertBefore(styleElement, head.firstChild), 
            styleElementsInsertedAtTop.push(styleElement); else {
                if ("bottom" !== options.insertAt) throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
                head.appendChild(styleElement);
            }
        }
        function removeStyleElement(styleElement) {
            styleElement.parentNode.removeChild(styleElement);
            var idx = styleElementsInsertedAtTop.indexOf(styleElement);
            idx >= 0 && styleElementsInsertedAtTop.splice(idx, 1);
        }
        function createStyleElement(options) {
            var styleElement = document.createElement("style");
            return styleElement.type = "text/css", insertStyleElement(options, styleElement), 
            styleElement;
        }
        function createLinkElement(options) {
            var linkElement = document.createElement("link");
            return linkElement.rel = "stylesheet", insertStyleElement(options, linkElement), 
            linkElement;
        }
        function addStyle(obj, options) {
            var styleElement, update, remove;
            if (options.singleton) {
                var styleIndex = singletonCounter++;
                styleElement = singletonElement || (singletonElement = createStyleElement(options)), 
                update = applyToSingletonTag.bind(null, styleElement, styleIndex, !1), remove = applyToSingletonTag.bind(null, styleElement, styleIndex, !0);
            } else obj.sourceMap && "function" == typeof URL && "function" == typeof URL.createObjectURL && "function" == typeof URL.revokeObjectURL && "function" == typeof Blob && "function" == typeof btoa ? (styleElement = createLinkElement(options), 
            update = updateLink.bind(null, styleElement), remove = function() {
                removeStyleElement(styleElement), styleElement.href && URL.revokeObjectURL(styleElement.href);
            }) : (styleElement = createStyleElement(options), update = applyToTag.bind(null, styleElement), 
            remove = function() {
                removeStyleElement(styleElement);
            });
            return update(obj), function(newObj) {
                if (newObj) {
                    if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) return;
                    update(obj = newObj);
                } else remove();
            };
        }
        function applyToSingletonTag(styleElement, index, remove, obj) {
            var css = remove ? "" : obj.css;
            if (styleElement.styleSheet) styleElement.styleSheet.cssText = replaceText(index, css); else {
                var cssNode = document.createTextNode(css), childNodes = styleElement.childNodes;
                childNodes[index] && styleElement.removeChild(childNodes[index]), childNodes.length ? styleElement.insertBefore(cssNode, childNodes[index]) : styleElement.appendChild(cssNode);
            }
        }
        function applyToTag(styleElement, obj) {
            var css = obj.css, media = obj.media;
            if (media && styleElement.setAttribute("media", media), styleElement.styleSheet) styleElement.styleSheet.cssText = css; else {
                for (;styleElement.firstChild; ) styleElement.removeChild(styleElement.firstChild);
                styleElement.appendChild(document.createTextNode(css));
            }
        }
        function updateLink(linkElement, obj) {
            var css = obj.css, sourceMap = obj.sourceMap;
            sourceMap && (// http://stackoverflow.com/a/26603875
            css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */");
            var blob = new Blob([ css ], {
                type: "text/css"
            }), oldSrc = linkElement.href;
            linkElement.href = URL.createObjectURL(blob), oldSrc && URL.revokeObjectURL(oldSrc);
        }
        /*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
        var stylesInDom = {}, memoize = function(fn) {
            var memo;
            return function() {
                return "undefined" == typeof memo && (memo = fn.apply(this, arguments)), memo;
            };
        }, isOldIE = memoize(function() {
            return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
        }), getHeadElement = memoize(function() {
            return document.head || document.getElementsByTagName("head")[0];
        }), singletonElement = null, singletonCounter = 0, styleElementsInsertedAtTop = [];
        module.exports = function(list, options) {
            options = options || {}, // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
            // tags it will allow on a page
            "undefined" == typeof options.singleton && (options.singleton = isOldIE()), // By default, add <style> tags to the bottom of <head>.
            "undefined" == typeof options.insertAt && (options.insertAt = "bottom");
            var styles = listToStyles(list);
            return addStylesToDom(styles, options), function(newList) {
                for (var mayRemove = [], i = 0; i < styles.length; i++) {
                    var item = styles[i], domStyle = stylesInDom[item.id];
                    domStyle.refs--, mayRemove.push(domStyle);
                }
                if (newList) {
                    var newStyles = listToStyles(newList);
                    addStylesToDom(newStyles, options);
                }
                for (var i = 0; i < mayRemove.length; i++) {
                    var domStyle = mayRemove[i];
                    if (0 === domStyle.refs) {
                        for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();
                        delete stylesInDom[domStyle.id];
                    }
                }
            };
        };
        var replaceText = function() {
            var textStore = [];
            return function(index, replacement) {
                return textStore[index] = replacement, textStore.filter(Boolean).join("\n");
            };
        }();
    }, /* 4 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_4__;
    }, /* 5 */
    /***/
    function(module, exports) {
        "use strict";
        function defaultGetNodeKey(_ref) {
            var treeIndex = (_ref.node, _ref.treeIndex);
            return treeIndex;
        }
        // Cheap hack to get the text of a react object
        function getReactElementText(parent) {
            return "string" == typeof parent ? parent : "object" !== ("undefined" == typeof parent ? "undefined" : _typeof(parent)) || !parent.props || !parent.props.children || "string" != typeof parent.props.children && "object" !== _typeof(parent.props.children) ? "" : "string" == typeof parent.props.children ? parent.props.children : parent.props.children.map(function(child) {
                return getReactElementText(child);
            }).join("");
        }
        // Search for a query string inside a node property
        function stringSearch(key, searchQuery, node, path, treeIndex) {
            return "function" == typeof node[key] ? String(node[key]({
                node: node,
                path: path,
                treeIndex: treeIndex
            })).indexOf(searchQuery) > -1 : "object" === _typeof(node[key]) ? getReactElementText(node[key]).indexOf(searchQuery) > -1 : node[key] && String(node[key]).indexOf(searchQuery) > -1;
        }
        function defaultSearchMethod(_ref2) {
            var node = _ref2.node, path = _ref2.path, treeIndex = _ref2.treeIndex, searchQuery = _ref2.searchQuery;
            return stringSearch("title", searchQuery, node, path, treeIndex) || stringSearch("subtitle", searchQuery, node, path, treeIndex);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        exports.defaultGetNodeKey = defaultGetNodeKey, exports.defaultSearchMethod = defaultSearchMethod;
    }, /* 6 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _objectWithoutProperties(obj, keys) {
            var target = {};
            for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
            return target;
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _browserUtils = __webpack_require__(9), _nodeRendererDefault = __webpack_require__(17), _nodeRendererDefault2 = _interopRequireDefault(_nodeRendererDefault), _treeDataUtils = __webpack_require__(1), styles = _nodeRendererDefault2.default;
        // Add extra classes in browsers that don't support flex
        _browserUtils.getIEVersion < 10 && (styles = _extends({}, _nodeRendererDefault2.default, {
            row: styles.row + " " + styles.row_NoFlex,
            rowContents: styles.rowContents + " " + styles.rowContents_NoFlex,
            rowLabel: styles.rowLabel + " " + styles.rowLabel_NoFlex,
            rowToolbar: styles.rowToolbar + " " + styles.rowToolbar_NoFlex
        }));
        var NodeRendererDefault = function(_ref) {
            var scaffoldBlockPxWidth = _ref.scaffoldBlockPxWidth, toggleChildrenVisibility = _ref.toggleChildrenVisibility, connectDragPreview = _ref.connectDragPreview, connectDragSource = _ref.connectDragSource, isDragging = _ref.isDragging, isOver = _ref.isOver, canDrop = _ref.canDrop, node = _ref.node, draggedNode = _ref.draggedNode, path = _ref.path, treeIndex = _ref.treeIndex, isSearchMatch = _ref.isSearchMatch, isSearchFocus = _ref.isSearchFocus, buttons = _ref.buttons, className = _ref.className, _ref$style = _ref.style, style = void 0 === _ref$style ? {} : _ref$style, otherProps = (_ref.startDrag, 
            _ref.endDrag, _objectWithoutProperties(_ref, [ "scaffoldBlockPxWidth", "toggleChildrenVisibility", "connectDragPreview", "connectDragSource", "isDragging", "isOver", "canDrop", "node", "draggedNode", "path", "treeIndex", "isSearchMatch", "isSearchFocus", "buttons", "className", "style", "startDrag", "endDrag" ])), handle = void 0;
            // Show a loading symbol on the handle when the children are expanded
            //  and yet still defined by a function (a callback to fetch the children)
            handle = "function" == typeof node.children && node.expanded ? _react2.default.createElement("div", {
                className: styles.loadingHandle
            }, _react2.default.createElement("div", {
                className: styles.loadingCircle
            }, _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }), _react2.default.createElement("div", {
                className: styles.loadingCirclePoint
            }))) : connectDragSource(_react2.default.createElement("div", {
                className: styles.moveHandle
            }), {
                dropEffect: "copy"
            });
            var isDraggedDescendant = draggedNode && (0, _treeDataUtils.isDescendant)(draggedNode, node);
            return _react2.default.createElement("div", _extends({
                style: {
                    height: "100%"
                }
            }, otherProps), toggleChildrenVisibility && node.children && node.children.length > 0 && _react2.default.createElement("div", null, _react2.default.createElement("button", {
                "aria-label": node.expanded ? "Collapse" : "Expand",
                className: node.expanded ? styles.collapseButton : styles.expandButton,
                style: {
                    left: -.5 * scaffoldBlockPxWidth
                },
                onClick: function() {
                    return toggleChildrenVisibility({
                        node: node,
                        path: path,
                        treeIndex: treeIndex
                    });
                }
            }), node.expanded && !isDragging && _react2.default.createElement("div", {
                style: {
                    width: scaffoldBlockPxWidth
                },
                className: styles.lineChildren
            })), _react2.default.createElement("div", {
                className: styles.rowWrapper
            }, connectDragPreview(_react2.default.createElement("div", {
                className: styles.row + (isDragging && isOver ? " " + styles.rowLandingPad : "") + (isDragging && !isOver && canDrop ? " " + styles.rowCancelPad : "") + (isSearchMatch ? " " + styles.rowSearchMatch : "") + (isSearchFocus ? " " + styles.rowSearchFocus : "") + (className ? " " + className : ""),
                style: _extends({
                    opacity: isDraggedDescendant ? .5 : 1
                }, style)
            }, handle, _react2.default.createElement("div", {
                className: styles.rowContents
            }, _react2.default.createElement("div", {
                className: styles.rowLabel
            }, _react2.default.createElement("span", {
                className: styles.rowTitle + (node.subtitle ? " " + styles.rowTitleWithSubtitle : "")
            }, "function" == typeof node.title ? node.title({
                node: node,
                path: path,
                treeIndex: treeIndex
            }) : node.title), node.subtitle && _react2.default.createElement("span", {
                className: styles.rowSubtitle
            }, "function" == typeof node.subtitle ? node.subtitle({
                node: node,
                path: path,
                treeIndex: treeIndex
            }) : node.subtitle)), _react2.default.createElement("div", {
                className: styles.rowToolbar
            }, buttons && buttons.map(function(btn, index) {
                return _react2.default.createElement("div", {
                    key: index,
                    className: styles.toolbarButton
                }, btn);
            })))))));
        };
        NodeRendererDefault.propTypes = {
            node: _react.PropTypes.object.isRequired,
            path: _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([ _react.PropTypes.string, _react.PropTypes.number ])).isRequired,
            treeIndex: _react.PropTypes.number.isRequired,
            isSearchMatch: _react.PropTypes.bool,
            isSearchFocus: _react.PropTypes.bool,
            scaffoldBlockPxWidth: _react.PropTypes.number.isRequired,
            toggleChildrenVisibility: _react.PropTypes.func,
            buttons: _react.PropTypes.arrayOf(_react.PropTypes.node),
            className: _react.PropTypes.string,
            style: _react.PropTypes.object,
            // Drag and drop API functions
            // Drag source
            connectDragPreview: _react.PropTypes.func.isRequired,
            connectDragSource: _react.PropTypes.func.isRequired,
            startDrag: _react.PropTypes.func.isRequired,
            // Needed for drag-and-drop utils
            endDrag: _react.PropTypes.func.isRequired,
            // Needed for drag-and-drop utils
            isDragging: _react.PropTypes.bool.isRequired,
            draggedNode: _react.PropTypes.object,
            // Drop target
            isOver: _react.PropTypes.bool.isRequired,
            canDrop: _react.PropTypes.bool.isRequired
        }, exports.default = NodeRendererDefault;
    }, /* 7 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        function _possibleConstructorReturn(self, call) {
            if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !call || "object" != typeof call && "function" != typeof call ? self : call;
        }
        function _inherits(subClass, superClass) {
            if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
            subClass.prototype = Object.create(superClass && superClass.prototype, {
                constructor: {
                    value: subClass,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _reactVirtualized = __webpack_require__(24), _lodash = __webpack_require__(20), _lodash2 = _interopRequireDefault(_lodash), _reactDndScrollzone = __webpack_require__(23), _reactDndScrollzone2 = _interopRequireDefault(_reactDndScrollzone);
        __webpack_require__(16);
        var _treeNode = __webpack_require__(8), _treeNode2 = _interopRequireDefault(_treeNode), _nodeRendererDefault = __webpack_require__(6), _nodeRendererDefault2 = _interopRequireDefault(_nodeRendererDefault), _treeDataUtils = __webpack_require__(1), _genericUtils = __webpack_require__(11), _defaultHandlers = __webpack_require__(5), _dragAndDropUtils = __webpack_require__(10), _reactSortableTree = __webpack_require__(18), _reactSortableTree2 = _interopRequireDefault(_reactSortableTree), dndTypeCounter = 1, ReactSortableTree = function(_Component) {
            function ReactSortableTree(props) {
                _classCallCheck(this, ReactSortableTree);
                // Wrapping classes for use with react-dnd
                var _this = _possibleConstructorReturn(this, (ReactSortableTree.__proto__ || Object.getPrototypeOf(ReactSortableTree)).call(this, props));
                // Prepare scroll-on-drag options for this list
                return _this.dndType = props.dndType || "rst__" + dndTypeCounter++, _this.nodeContentRenderer = (0, 
                _dragAndDropUtils.dndWrapSource)(props.nodeContentRenderer, _this.dndType), _this.treeNodeRenderer = (0, 
                _dragAndDropUtils.dndWrapTarget)(_treeNode2.default, _this.dndType), _this.scrollZoneVirtualList = (0, 
                _reactDndScrollzone2.default)(_reactVirtualized.List), _this.vStrength = (0, _reactDndScrollzone.createVerticalStrength)(props.slideRegionSize), 
                _this.hStrength = (0, _reactDndScrollzone.createHorizontalStrength)(props.slideRegionSize), 
                _this.state = {
                    draggingTreeData: null,
                    swapFrom: null,
                    swapLength: null,
                    swapDepth: null,
                    rows: _this.getRows(props.treeData),
                    searchMatches: [],
                    searchFocusTreeIndex: null
                }, _this.toggleChildrenVisibility = _this.toggleChildrenVisibility.bind(_this), 
                _this.moveNode = _this.moveNode.bind(_this), _this.startDrag = _this.startDrag.bind(_this), 
                _this.dragHover = _this.dragHover.bind(_this), _this.endDrag = _this.endDrag.bind(_this), 
                _this;
            }
            return _inherits(ReactSortableTree, _Component), _createClass(ReactSortableTree, [ {
                key: "componentWillMount",
                value: function() {
                    this.loadLazyChildren(), this.search(this.props, !1, !1), this.ignoreOneTreeUpdate = !1;
                }
            }, {
                key: "toggleChildrenVisibility",
                value: function(_ref) {
                    var targetNode = _ref.node, path = _ref.path, treeData = (_ref.treeIndex, (0, _treeDataUtils.changeNodeAtPath)({
                        treeData: this.props.treeData,
                        path: path,
                        newNode: function(_ref2) {
                            var node = _ref2.node;
                            return _extends({}, node, {
                                expanded: !node.expanded
                            });
                        },
                        getNodeKey: this.props.getNodeKey
                    }));
                    this.props.onChange(treeData), this.props.onVisibilityToggle && this.props.onVisibilityToggle({
                        treeData: treeData,
                        node: targetNode,
                        expanded: !targetNode.expanded
                    });
                }
            }, {
                key: "moveNode",
                value: function(_ref3) {
                    var node = _ref3.node, depth = _ref3.depth, minimumTreeIndex = _ref3.minimumTreeIndex, _insertNode = (0, 
                    _treeDataUtils.insertNode)({
                        treeData: this.state.draggingTreeData,
                        newNode: node,
                        depth: depth,
                        minimumTreeIndex: minimumTreeIndex,
                        expandParent: !0,
                        getNodeKey: this.props.getNodeKey
                    }), treeData = _insertNode.treeData, treeIndex = _insertNode.treeIndex, path = _insertNode.path;
                    this.props.onChange(treeData), this.props.onMoveNode && this.props.onMoveNode({
                        treeData: treeData,
                        node: node,
                        treeIndex: treeIndex,
                        path: path
                    });
                }
            }, {
                key: "componentWillReceiveProps",
                value: function(nextProps) {
                    this.setState({
                        searchFocusTreeIndex: null
                    }), this.props.treeData !== nextProps.treeData ? (// Ignore updates caused by search, in order to avoid infinite looping
                    this.ignoreOneTreeUpdate ? this.ignoreOneTreeUpdate = !1 : (this.loadLazyChildren(nextProps), 
                    // Load any children defined by a function
                    this.search(nextProps, !1, !1)), // Calculate the rows to be shown from the new tree data
                    this.setState({
                        draggingTreeData: null,
                        swapFrom: null,
                        swapLength: null,
                        swapDepth: null,
                        rows: this.getRows(nextProps.treeData)
                    })) : (0, _lodash2.default)(this.props.searchQuery, nextProps.searchQuery) ? this.props.searchFocusOffset !== nextProps.searchFocusOffset && this.search(nextProps, !0, !0, !0) : this.search(nextProps);
                }
            }, {
                key: "getRows",
                value: function(treeData) {
                    return (0, _treeDataUtils.getFlatDataFromTree)({
                        ignoreCollapsed: !0,
                        getNodeKey: this.props.getNodeKey,
                        treeData: treeData
                    });
                }
            }, {
                key: "search",
                value: function() {
                    var props = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props, seekIndex = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], expand = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], singleSearch = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], treeData = props.treeData, onChange = props.onChange, searchFinishCallback = props.searchFinishCallback, searchQuery = props.searchQuery, searchMethod = props.searchMethod, searchFocusOffset = props.searchFocusOffset;
                    // Skip search if no conditions are specified
                    if ((null === searchQuery || "undefined" == typeof searchQuery || "" === String(searchQuery)) && !searchMethod) return this.setState({
                        searchMatches: []
                    }), void (searchFinishCallback && searchFinishCallback([]));
                    var _find = (0, _treeDataUtils.find)({
                        getNodeKey: this.props.getNodeKey,
                        treeData: treeData,
                        searchQuery: searchQuery,
                        searchMethod: searchMethod || _defaultHandlers.defaultSearchMethod,
                        searchFocusOffset: searchFocusOffset,
                        expandAllMatchPaths: expand && !singleSearch,
                        expandFocusMatchPaths: expand && !0
                    }), expandedTreeData = _find.treeData, searchMatches = _find.matches;
                    // Update the tree with data leaving all paths leading to matching nodes open
                    expand && (this.ignoreOneTreeUpdate = !0, // Prevents infinite loop
                    onChange(expandedTreeData)), searchFinishCallback && searchFinishCallback(searchMatches);
                    var searchFocusTreeIndex = null;
                    seekIndex && null !== searchFocusOffset && searchFocusOffset < searchMatches.length && (searchFocusTreeIndex = searchMatches[searchFocusOffset].treeIndex), 
                    this.setState({
                        searchMatches: searchMatches,
                        searchFocusTreeIndex: searchFocusTreeIndex
                    });
                }
            }, {
                key: "startDrag",
                value: function(_ref4) {
                    var path = _ref4.path, draggingTreeData = (0, _treeDataUtils.removeNodeAtPath)({
                        treeData: this.props.treeData,
                        path: path,
                        getNodeKey: this.props.getNodeKey
                    });
                    this.setState({
                        draggingTreeData: draggingTreeData
                    });
                }
            }, {
                key: "dragHover",
                value: function(_ref5) {
                    var draggedNode = _ref5.node, depth = _ref5.depth, minimumTreeIndex = _ref5.minimumTreeIndex, addedResult = (0, 
                    _treeDataUtils.insertNode)({
                        treeData: this.state.draggingTreeData,
                        newNode: draggedNode,
                        depth: depth,
                        minimumTreeIndex: minimumTreeIndex,
                        expandParent: !0
                    }), rows = this.getRows(addedResult.treeData), expandedParentPath = rows[addedResult.treeIndex].path, swapFrom = addedResult.treeIndex, swapTo = minimumTreeIndex, swapLength = 1 + (0, 
                    _treeDataUtils.getDescendantCount)({
                        node: draggedNode
                    });
                    this.setState({
                        rows: (0, _genericUtils.swapRows)(rows, swapFrom, swapTo, swapLength),
                        swapFrom: swapFrom,
                        swapLength: swapLength,
                        swapDepth: depth,
                        draggingTreeData: (0, _treeDataUtils.changeNodeAtPath)({
                            treeData: this.state.draggingTreeData,
                            path: expandedParentPath.slice(0, -1),
                            newNode: function(_ref6) {
                                var node = _ref6.node;
                                return _extends({}, node, {
                                    expanded: !0
                                });
                            },
                            getNodeKey: this.props.getNodeKey
                        })
                    });
                }
            }, {
                key: "endDrag",
                value: function(dropResult) {
                    return dropResult ? void this.moveNode(dropResult) : this.setState({
                        draggingTreeData: null,
                        swapFrom: null,
                        swapLength: null,
                        swapDepth: null,
                        rows: this.getRows(this.props.treeData)
                    });
                }
            }, {
                key: "loadLazyChildren",
                value: function() {
                    var _this2 = this, props = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props;
                    (0, _treeDataUtils.walk)({
                        treeData: props.treeData,
                        getNodeKey: this.props.getNodeKey,
                        callback: function(_ref7) {
                            var node = _ref7.node, path = _ref7.path, lowerSiblingCounts = _ref7.lowerSiblingCounts, treeIndex = _ref7.treeIndex;
                            // If the node has children defined by a function, and is either expanded
                            //  or set to load even before expansion, run the function.
                            node.children && "function" == typeof node.children && (node.expanded || props.loadCollapsedLazyChildren) && // Call the children fetching function
                            node.children({
                                node: node,
                                path: path,
                                lowerSiblingCounts: lowerSiblingCounts,
                                treeIndex: treeIndex,
                                // Provide a helper to append the new data when it is received
                                done: function(childrenArray) {
                                    return _this2.props.onChange((0, _treeDataUtils.changeNodeAtPath)({
                                        treeData: _this2.props.treeData,
                                        path: path,
                                        newNode: function(_ref8) {
                                            var oldNode = _ref8.node;
                                            // Only replace the old node if it's the one we set off to find children
                                            //  for in the first place
                                            return oldNode === node ? _extends({}, oldNode, {
                                                children: childrenArray
                                            }) : oldNode;
                                        },
                                        getNodeKey: _this2.props.getNodeKey
                                    }));
                                }
                            });
                        }
                    });
                }
            }, {
                key: "render",
                value: function() {
                    var _this3 = this, _props = this.props, style = _props.style, className = _props.className, innerStyle = _props.innerStyle, rowHeight = _props.rowHeight, _state = this.state, rows = _state.rows, searchMatches = _state.searchMatches, searchFocusTreeIndex = _state.searchFocusTreeIndex, matchKeys = {};
                    searchMatches.forEach(function(_ref9, i) {
                        var path = _ref9.path;
                        matchKeys[path[path.length - 1]] = i;
                    });
                    // Seek to the focused search result if there is one specified
                    var scrollToInfo = null !== searchFocusTreeIndex ? {
                        scrollToIndex: searchFocusTreeIndex
                    } : {}, ScrollZoneVirtualList = this.scrollZoneVirtualList;
                    return _react2.default.createElement("div", {
                        className: _reactSortableTree2.default.tree + (className ? " " + className : ""),
                        style: _extends({
                            height: "100%"
                        }, style),
                        ref: function(el) {
                            _this3.containerRef = el;
                        }
                    }, _react2.default.createElement(_reactVirtualized.AutoSizer, null, function(_ref10) {
                        var height = _ref10.height, width = _ref10.width;
                        return _react2.default.createElement(ScrollZoneVirtualList, _extends({}, scrollToInfo, {
                            verticalStrength: _this3.vStrength,
                            horizontalStrength: _this3.hStrength,
                            speed: 30,
                            scrollToAlignment: "start",
                            className: _reactSortableTree2.default.virtualScrollOverride,
                            width: width,
                            onScroll: function(_ref11) {
                                var scrollTop = _ref11.scrollTop;
                                _this3.scrollTop = scrollTop;
                            },
                            height: height,
                            style: innerStyle,
                            rowCount: rows.length,
                            estimatedRowSize: rowHeight,
                            rowHeight: rowHeight,
                            rowRenderer: function(_ref12) {
                                var index = _ref12.index, key = _ref12.key, rowStyle = _ref12.style;
                                return _this3.renderRow(rows, index, key, rowStyle, function() {
                                    return rows[index - 1] || null;
                                }, matchKeys);
                            }
                        }, _this3.props.reactVirtualizedListProps));
                    }));
                }
            }, {
                key: "renderRow",
                value: function(rows, listIndex, key, style, getPrevRow, matchKeys) {
                    var _rows$listIndex = rows[listIndex], node = _rows$listIndex.node, path = _rows$listIndex.path, lowerSiblingCounts = _rows$listIndex.lowerSiblingCounts, treeIndex = _rows$listIndex.treeIndex, TreeNodeRenderer = this.treeNodeRenderer, NodeContentRenderer = this.nodeContentRenderer, nodeKey = path[path.length - 1], isSearchMatch = nodeKey in matchKeys, isSearchFocus = isSearchMatch && matchKeys[nodeKey] === this.props.searchFocusOffset, nodeProps = this.props.generateNodeProps ? this.props.generateNodeProps({
                        node: node,
                        path: path,
                        lowerSiblingCounts: lowerSiblingCounts,
                        treeIndex: treeIndex,
                        isSearchMatch: isSearchMatch,
                        isSearchFocus: isSearchFocus
                    }) : {};
                    return _react2.default.createElement(TreeNodeRenderer, {
                        rows: rows,
                        style: style,
                        key: key,
                        treeIndex: treeIndex,
                        listIndex: listIndex,
                        getPrevRow: getPrevRow,
                        node: node,
                        path: path,
                        lowerSiblingCounts: lowerSiblingCounts,
                        scaffoldBlockPxWidth: this.props.scaffoldBlockPxWidth,
                        swapFrom: this.state.swapFrom,
                        swapLength: this.state.swapLength,
                        swapDepth: this.state.swapDepth,
                        maxDepth: this.props.maxDepth,
                        dragHover: this.dragHover
                    }, _react2.default.createElement(NodeContentRenderer, _extends({
                        node: node,
                        path: path,
                        isSearchMatch: isSearchMatch,
                        isSearchFocus: isSearchFocus,
                        treeIndex: treeIndex,
                        startDrag: this.startDrag,
                        endDrag: this.endDrag,
                        toggleChildrenVisibility: this.toggleChildrenVisibility,
                        scaffoldBlockPxWidth: this.props.scaffoldBlockPxWidth
                    }, nodeProps)));
                }
            } ]), ReactSortableTree;
        }(_react.Component);
        ReactSortableTree.propTypes = {
            // Tree data in the following format:
            // [{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]
            // `title` is the primary label for the node
            // `subtitle` is a secondary label for the node
            // `expanded` shows children of the node if true, or hides them if false. Defaults to false.
            // `children` is an array of child nodes belonging to the node.
            treeData: _react.PropTypes.arrayOf(_react.PropTypes.object).isRequired,
            // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
            style: _react.PropTypes.object,
            // Class name for the container wrapping the tree
            className: _react.PropTypes.string,
            // Style applied to the inner, scrollable container (for padding, etc.)
            innerStyle: _react.PropTypes.object,
            // Used by react-virtualized
            // Either a fixed row height (number) or a function that returns the
            // height of a row given its index: `({ index: number }): number`
            rowHeight: _react.PropTypes.oneOfType([ _react.PropTypes.number, _react.PropTypes.func ]),
            // Size in px of the region near the edges that initiates scrolling on dragover
            slideRegionSize: _react.PropTypes.number.isRequired,
            // eslint-disable-line react/no-unused-prop-types
            // Custom properties to hand to the react-virtualized list
            // https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types
            reactVirtualizedListProps: _react.PropTypes.object,
            // The width of the blocks containing the lines representing the structure of the tree.
            scaffoldBlockPxWidth: _react.PropTypes.number,
            // Maximum depth nodes can be inserted at. Defaults to infinite.
            maxDepth: _react.PropTypes.number,
            // The method used to search nodes.
            // Defaults to a function that uses the `searchQuery` string to search for nodes with
            // matching `title` or `subtitle` values.
            // NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.
            searchMethod: _react.PropTypes.func,
            // eslint-disable-line react/no-unused-prop-types
            // Used by the `searchMethod` to highlight and scroll to matched nodes.
            // Should be a string for the default `searchMethod`, but can be anything when using a custom search.
            searchQuery: _react.PropTypes.any,
            // Outline the <`searchFocusOffset`>th node and scroll to it.
            searchFocusOffset: _react.PropTypes.number,
            // Get the nodes that match the search criteria. Used for counting total matches, etc.
            searchFinishCallback: _react.PropTypes.func,
            // eslint-disable-line react/no-unused-prop-types
            // Generate an object with additional props to be passed to the node renderer.
            // Use this for adding buttons via the `buttons` key,
            // or additional `style` / `className` settings.
            generateNodeProps: _react.PropTypes.func,
            // Override the default component for rendering nodes (but keep the scaffolding generator)
            // This is an advanced option for complete customization of the appearance.
            // It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
            nodeContentRenderer: _react.PropTypes.any,
            // Determine the unique key used to identify each node and
            // generate the `path` array passed in callbacks.
            // By default, returns the index in the tree (omitting hidden nodes).
            getNodeKey: _react.PropTypes.func,
            // Called whenever tree data changed.
            // Just like with React input elements, you have to update your
            // own component's data to see the changes reflected.
            onChange: _react.PropTypes.func.isRequired,
            // Called after node move operation.
            onMoveNode: _react.PropTypes.func,
            // Called after children nodes collapsed or expanded.
            onVisibilityToggle: _react.PropTypes.func,
            dndType: _react.PropTypes.string
        }, ReactSortableTree.defaultProps = {
            getNodeKey: _defaultHandlers.defaultGetNodeKey,
            nodeContentRenderer: _nodeRendererDefault2.default,
            rowHeight: 62,
            slideRegionSize: 100,
            scaffoldBlockPxWidth: 44,
            style: {},
            innerStyle: {},
            searchQuery: null
        }, exports.default = (0, _dragAndDropUtils.dndWrapRoot)(ReactSortableTree);
    }, /* 8 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function _objectWithoutProperties(obj, keys) {
            var target = {};
            for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
            return target;
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _react = __webpack_require__(4), _react2 = _interopRequireDefault(_react), _treeNode = __webpack_require__(19), _treeNode2 = _interopRequireDefault(_treeNode), TreeNode = function(_ref) {
            var children = _ref.children, listIndex = _ref.listIndex, swapFrom = _ref.swapFrom, swapLength = _ref.swapLength, swapDepth = _ref.swapDepth, scaffoldBlockPxWidth = _ref.scaffoldBlockPxWidth, lowerSiblingCounts = _ref.lowerSiblingCounts, connectDropTarget = _ref.connectDropTarget, isOver = _ref.isOver, draggedNode = _ref.draggedNode, canDrop = _ref.canDrop, treeIndex = _ref.treeIndex, otherProps = (_ref.getPrevRow, 
            _ref.node, _ref.path, _ref.maxDepth, _ref.dragHover, _objectWithoutProperties(_ref, [ "children", "listIndex", "swapFrom", "swapLength", "swapDepth", "scaffoldBlockPxWidth", "lowerSiblingCounts", "connectDropTarget", "isOver", "draggedNode", "canDrop", "treeIndex", "getPrevRow", "node", "path", "maxDepth", "dragHover" ])), scaffoldBlockCount = lowerSiblingCounts.length, scaffold = [];
            return lowerSiblingCounts.forEach(function(lowerSiblingCount, i) {
                var lineClass = "";
                if (lowerSiblingCount > 0 ? // At this level in the tree, the nodes had sibling nodes further down
                // Top-left corner of the tree
                // +-----+
                // |     |
                // |  +--+
                // |  |  |
                // +--+--+
                lineClass = 0 === listIndex ? _treeNode2.default.lineHalfHorizontalRight + " " + _treeNode2.default.lineHalfVerticalBottom : i === scaffoldBlockCount - 1 ? _treeNode2.default.lineHalfHorizontalRight + " " + _treeNode2.default.lineFullVertical : _treeNode2.default.lineFullVertical : 0 === listIndex ? // Top-left corner of the tree, but has no siblings
                // +-----+
                // |     |
                // |  +--+
                // |     |
                // +-----+
                lineClass = _treeNode2.default.lineHalfHorizontalRight : i === scaffoldBlockCount - 1 && (// The last or only node in this level of the tree
                // +--+--+
                // |  |  |
                // |  +--+
                // |     |
                // +-----+
                lineClass = _treeNode2.default.lineHalfVerticalTop + " " + _treeNode2.default.lineHalfHorizontalRight), 
                scaffold.push(_react2.default.createElement("div", {
                    key: "pre_" + i,
                    style: {
                        width: scaffoldBlockPxWidth
                    },
                    className: _treeNode2.default.lineBlock + " " + lineClass
                })), treeIndex !== listIndex && i === swapDepth) {
                    // This row has been shifted, and is at the depth of
                    // the line pointing to the new destination
                    var highlightLineClass = "";
                    // This block is on the bottom (target) line
                    // This block points at the target block (where the row will go when released)
                    highlightLineClass = listIndex === swapFrom + swapLength - 1 ? _treeNode2.default.highlightBottomLeftCorner : treeIndex === swapFrom ? _treeNode2.default.highlightTopLeftCorner : _treeNode2.default.highlightLineVertical, 
                    scaffold.push(_react2.default.createElement("div", {
                        key: "highlight_" + i,
                        style: {
                            width: scaffoldBlockPxWidth,
                            left: scaffoldBlockPxWidth * i
                        },
                        className: _treeNode2.default.absoluteLineBlock + " " + highlightLineClass
                    }));
                }
            }), connectDropTarget(_react2.default.createElement("div", _extends({}, otherProps, {
                className: _treeNode2.default.node
            }), scaffold, _react2.default.createElement("div", {
                className: _treeNode2.default.nodeContent,
                style: {
                    left: scaffoldBlockPxWidth * scaffoldBlockCount
                }
            }, _react.Children.map(children, function(child) {
                return (0, _react.cloneElement)(child, {
                    isOver: isOver,
                    canDrop: canDrop,
                    draggedNode: draggedNode
                });
            }))));
        };
        TreeNode.propTypes = {
            treeIndex: _react.PropTypes.number.isRequired,
            node: _react.PropTypes.object.isRequired,
            path: _react.PropTypes.arrayOf(_react.PropTypes.oneOfType([ _react.PropTypes.string, _react.PropTypes.number ])).isRequired,
            swapFrom: _react.PropTypes.number,
            swapDepth: _react.PropTypes.number,
            swapLength: _react.PropTypes.number,
            scaffoldBlockPxWidth: _react.PropTypes.number.isRequired,
            lowerSiblingCounts: _react.PropTypes.array.isRequired,
            listIndex: _react.PropTypes.number.isRequired,
            children: _react.PropTypes.node,
            // Drop target
            connectDropTarget: _react.PropTypes.func.isRequired,
            isOver: _react.PropTypes.bool.isRequired,
            canDrop: _react.PropTypes.bool.isRequired,
            draggedNode: _react.PropTypes.object
        }, exports.default = TreeNode;
    }, /* 9 */
    /***/
    function(module, exports) {
        "use strict";
        /**
	 * Get the version of Internet Explorer in use, or undefined
	 *
	 * @return {?number} ieVersion - IE version as an integer, or undefined if not IE
	 */
        function getIEVersion() {
            var match = navigator.userAgent.match(/(?:MSIE |Trident\/.*; rv:)(\d+)/);
            return match ? parseInt(match[1], 10) : void 0;
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.getIEVersion = getIEVersion;
    }, /* 10 */
    /***/
    function(module, exports, __webpack_require__) {
        "use strict";
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        function getTargetDepth(dropTargetProps, monitor) {
            var dropTargetDepth = 0, draggedItem = monitor.getItem(), rowAbove = dropTargetProps.getPrevRow();
            rowAbove && (// Limit the length of the path to the deepest possible
            dropTargetDepth = Math.min(rowAbove.path.length, dropTargetProps.path.length));
            var blocksOffset = Math.round(monitor.getDifferenceFromInitialOffset().x / dropTargetProps.scaffoldBlockPxWidth), targetDepth = Math.min(dropTargetDepth, Math.max(0, draggedItem.path.length + blocksOffset - 1));
            // If a maxDepth is defined, constrain the target depth
            if ("undefined" != typeof dropTargetProps.maxDepth && null !== dropTargetProps.maxDepth) {
                var draggedNode = monitor.getItem().node, draggedChildDepth = (0, _treeDataUtils.getDepth)(draggedNode);
                targetDepth = Math.min(targetDepth, dropTargetProps.maxDepth - draggedChildDepth - 1);
            }
            return targetDepth;
        }
        function canDrop(dropTargetProps, monitor) {
            var isHover = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], abovePath = [], aboveNode = {}, rowAbove = dropTargetProps.getPrevRow();
            rowAbove && (abovePath = rowAbove.path, aboveNode = rowAbove.node);
            var targetDepth = getTargetDepth(dropTargetProps, monitor), draggedNode = monitor.getItem().node, parentNode = dropTargetProps.rows[dropTargetProps.path[dropTargetProps.path.length - 2]];
            // Either we're not adding to the children of the row above...
            // ...or we guarantee it's not a function we're trying to add to
            // Ignore when hovered above the identical node...
            // ...unless it's at a different level than the current one
            return (targetDepth < abovePath.length || "function" != typeof aboveNode.children) && (!(dropTargetProps.node === draggedNode && isHover === !0) || targetDepth !== dropTargetProps.path.length - 1) && ("undefined" == typeof parentNode || "undefined" == typeof parentNode.node.canHaveChildren || parentNode.node.canHaveChildren) && !(dropTargetProps.node.alwaysAtRootLevel && parentNode);
        }
        function nodeDragSourcePropInjection(connect, monitor) {
            return {
                connectDragSource: connect.dragSource(),
                connectDragPreview: connect.dragPreview(),
                isDragging: monitor.isDragging()
            };
        }
        function nodeDropTargetPropInjection(connect, monitor) {
            var dragged = monitor.getItem();
            return {
                connectDropTarget: connect.dropTarget(),
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
                draggedNode: dragged ? dragged.node : null
            };
        }
        function dndWrapSource(el, type) {
            return (0, _reactDnd.DragSource)(type, nodeDragSource, nodeDragSourcePropInjection)(el);
        }
        function dndWrapTarget(el, type) {
            return (0, _reactDnd.DropTarget)(type, nodeDropTarget, nodeDropTargetPropInjection)(el);
        }
        function dndWrapRoot(el) {
            return (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(el);
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.dndWrapSource = dndWrapSource, exports.dndWrapTarget = dndWrapTarget, 
        exports.dndWrapRoot = dndWrapRoot;
        var _reactDnd = __webpack_require__(21), _reactDndHtml5Backend = __webpack_require__(22), _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend), _treeDataUtils = __webpack_require__(1), nodeDragSource = {
            beginDrag: function(props) {
                return props.startDrag(props), {
                    node: props.node,
                    path: props.path
                };
            },
            endDrag: function(props, monitor) {
                props.endDrag(monitor.getDropResult());
            },
            isDragging: function(props, monitor) {
                var dropTargetNode = monitor.getItem().node, draggedNode = props.node;
                return draggedNode === dropTargetNode;
            }
        }, nodeDropTarget = {
            drop: function(dropTargetProps, monitor) {
                return {
                    node: monitor.getItem().node,
                    path: monitor.getItem().path,
                    minimumTreeIndex: dropTargetProps.treeIndex,
                    depth: getTargetDepth(dropTargetProps, monitor)
                };
            },
            hover: function(dropTargetProps, monitor) {
                canDrop(dropTargetProps, monitor, !0) && dropTargetProps.dragHover({
                    node: monitor.getItem().node,
                    path: monitor.getItem().path,
                    minimumTreeIndex: dropTargetProps.listIndex,
                    depth: getTargetDepth(dropTargetProps, monitor)
                });
            },
            canDrop: canDrop
        };
    }, /* 11 */
    /***/
    function(module, exports) {
        "use strict";
        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
            return Array.from(arr);
        }
        function swapRows(rows, fromIndex, toIndex) {
            var count = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, rowsWithoutMoved = [].concat(_toConsumableArray(rows.slice(0, fromIndex)), _toConsumableArray(rows.slice(fromIndex + count)));
            return [].concat(_toConsumableArray(rowsWithoutMoved.slice(0, toIndex)), _toConsumableArray(rows.slice(fromIndex, fromIndex + count)), _toConsumableArray(rowsWithoutMoved.slice(toIndex)));
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.swapRows = swapRows;
    }, /* 12 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(2)(), // imports
        // module
        exports.push([ module.id, ".ReactVirtualized__Table__headerRow{font-weight:700;text-transform:uppercase}.ReactVirtualized__Table__headerRow,.ReactVirtualized__Table__row{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ReactVirtualized__Table__headerTruncatedText{display:inline-block;max-width:100%;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.ReactVirtualized__Table__headerColumn,.ReactVirtualized__Table__rowColumn{margin-right:10px;min-width:0}.ReactVirtualized__Table__rowColumn{text-overflow:ellipsis;white-space:nowrap}.ReactVirtualized__Table__headerColumn:first-of-type,.ReactVirtualized__Table__rowColumn:first-of-type{margin-left:10px}.ReactVirtualized__Table__sortableHeaderColumn{cursor:pointer}.ReactVirtualized__Table__sortableHeaderIconContainer{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ReactVirtualized__Table__sortableHeaderIcon{-webkit-box-flex:0;-ms-flex:0 0 24px;flex:0 0 24px;height:1em;width:1em;fill:currentColor}", "" ]);
    }, /* 13 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(2)(), // imports
        // module
        exports.push([ module.id, ".rst__rowWrapper{padding:10px 10px 10px 0;height:100%}.rst__row{height:100%;white-space:nowrap;display:-webkit-box;display:-ms-flexbox;display:flex}.rst__rowCancelPad,.rst__rowLandingPad{border:none!important;box-shadow:none!important;outline:none!important}.rst__rowCancelPad *,.rst__rowLandingPad *{opacity:0!important}.rst__rowCancelPad:before,.rst__rowLandingPad:before{background-color:#add8e6;border:3px dashed #fff;content:'';position:absolute;top:0;right:0;bottom:0;left:0;z-index:-1}.rst__rowCancelPad:before{background-color:#e6a8ad}.rst__rowSearchMatch{outline:3px solid #0080ff}.rst__rowSearchFocus{outline:3px solid #fc6421}.rst__loadingHandle,.rst__moveHandle,.rst__rowContents,.rst__rowLabel,.rst__rowLabel_NoFlex,.rst__rowToolbar,.rst__rowToolbar_NoFlex,.rst__toolbarButton{display:inline-block;vertical-align:middle}.rst__rowContents{position:relative;height:100%;border:1px solid #bbb;border-left:none;box-shadow:0 2px 2px -2px;padding:0 5px 0 10px;border-radius:2px;min-width:230px;-webkit-box-flex:1;-ms-flex:1 0 auto;flex:1 0 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;background-color:#fff}.rst__rowLabel{padding-right:20px}.rst__rowLabel,.rst__rowToolbar{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto}.rst__rowToolbar{display:-webkit-box;display:-ms-flexbox;display:flex}.rst__loadingHandle,.rst__moveHandle{height:100%;width:44px;background:#d9d9d9 url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+PGcgc3Ryb2tlPSIjRkZGIiBzdHJva2Utd2lkdGg9IjIuOSIgPjxwYXRoIGQ9Ik0xNCAxNS43aDE0LjQiLz48cGF0aCBkPSJNMTQgMjEuNGgxNC40Ii8+PHBhdGggZD0iTTE0IDI3LjFoMTQuNCIvPjwvZz4KPC9zdmc+\") no-repeat 50%;border:1px solid #aaa;box-shadow:0 2px 2px -2px;cursor:move;border-radius:1px;z-index:1}.rst__loadingHandle{cursor:default;background:#d9d9d9}@-webkit-keyframes rst__pointFade{0%,19.999%,to{opacity:0}20%{opacity:1}}@keyframes rst__pointFade{0%,19.999%,to{opacity:0}20%{opacity:1}}.rst__loadingCircle{width:80%;height:80%;margin:10%;position:relative}.rst__loadingCirclePoint{width:100%;height:100%;position:absolute;left:0;top:0}.rst__loadingCirclePoint:before{content:'';display:block;margin:0 auto;width:11%;height:30%;background-color:#fff;border-radius:30%;-webkit-animation:rst__pointFade .8s infinite ease-in-out both;animation:rst__pointFade .8s infinite ease-in-out both}.rst__loadingCirclePoint:nth-of-type(1){-webkit-transform:rotate(0deg);-ms-transform:rotate(0deg);transform:rotate(0deg)}.rst__loadingCirclePoint:nth-of-type(1):before,.rst__loadingCirclePoint:nth-of-type(7):before{-webkit-animation-delay:-.8s;animation-delay:-.8s}.rst__loadingCirclePoint:nth-of-type(2){-webkit-transform:rotate(30deg);-ms-transform:rotate(30deg);transform:rotate(30deg)}.rst__loadingCirclePoint:nth-of-type(8){-webkit-transform:rotate(210deg);-ms-transform:rotate(210deg);transform:rotate(210deg)}.rst__loadingCirclePoint:nth-of-type(2):before,.rst__loadingCirclePoint:nth-of-type(8):before{-webkit-animation-delay:-666.66667ms;animation-delay:-666.66667ms}.rst__loadingCirclePoint:nth-of-type(3){-webkit-transform:rotate(60deg);-ms-transform:rotate(60deg);transform:rotate(60deg)}.rst__loadingCirclePoint:nth-of-type(9){-webkit-transform:rotate(240deg);-ms-transform:rotate(240deg);transform:rotate(240deg)}.rst__loadingCirclePoint:nth-of-type(3):before,.rst__loadingCirclePoint:nth-of-type(9):before{-webkit-animation-delay:-.53333333s;animation-delay:-.53333333s}.rst__loadingCirclePoint:nth-of-type(4){-webkit-transform:rotate(90deg);-ms-transform:rotate(90deg);transform:rotate(90deg)}.rst__loadingCirclePoint:nth-of-type(10){-webkit-transform:rotate(270deg);-ms-transform:rotate(270deg);transform:rotate(270deg)}.rst__loadingCirclePoint:nth-of-type(4):before,.rst__loadingCirclePoint:nth-of-type(10):before{-webkit-animation-delay:-.4s;animation-delay:-.4s}.rst__loadingCirclePoint:nth-of-type(5){-webkit-transform:rotate(120deg);-ms-transform:rotate(120deg);transform:rotate(120deg)}.rst__loadingCirclePoint:nth-of-type(11){-webkit-transform:rotate(300deg);-ms-transform:rotate(300deg);transform:rotate(300deg)}.rst__loadingCirclePoint:nth-of-type(5):before,.rst__loadingCirclePoint:nth-of-type(11):before{-webkit-animation-delay:-.26666667s;animation-delay:-.26666667s}.rst__loadingCirclePoint:nth-of-type(6){-webkit-transform:rotate(150deg);-ms-transform:rotate(150deg);transform:rotate(150deg)}.rst__loadingCirclePoint:nth-of-type(12){-webkit-transform:rotate(330deg);-ms-transform:rotate(330deg);transform:rotate(330deg)}.rst__loadingCirclePoint:nth-of-type(6):before,.rst__loadingCirclePoint:nth-of-type(12):before{-webkit-animation-delay:-.13333333s;animation-delay:-.13333333s}.rst__loadingCirclePoint:nth-of-type(7){-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg)}.rst__loadingCirclePoint:nth-of-type(13){-webkit-transform:rotate(1turn);-ms-transform:rotate(1turn);transform:rotate(1turn)}.rst__loadingCirclePoint:nth-of-type(7):before,.rst__loadingCirclePoint:nth-of-type(13):before{-webkit-animation-delay:0ms;animation-delay:0ms}.rst__rowTitle{font-weight:700}.rst__rowTitleWithSubtitle{font-size:85%;display:block;height:.8rem}.rst__rowSubtitle{font-size:70%;line-height:1}.rst__collapseButton,.rst__expandButton{-webkit-appearance:none;-moz-appearance:none;appearance:none;border:none;position:absolute;border-radius:100%;box-shadow:0 0 0 1px #000;width:16px;height:16px;top:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);cursor:pointer}.rst__collapseButton:focus,.rst__expandButton:focus{outline:none;box-shadow:0 0 0 1px #000,0 0 1px 3px #83bef9}.rst__collapseButton:hover:not(:active),.rst__expandButton:hover:not(:active){background-size:24px;height:20px;width:20px}.rst__collapseButton{background:#fff url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjgiIGZpbGw9IiNGRkYiLz48ZyBzdHJva2U9IiM5ODk4OTgiIHN0cm9rZS13aWR0aD0iMS45IiA+PHBhdGggZD0iTTQuNSA5aDkiLz48L2c+Cjwvc3ZnPg==\") no-repeat 50%}.rst__expandButton{background:#fff url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjgiIGZpbGw9IiNGRkYiLz48ZyBzdHJva2U9IiM5ODk4OTgiIHN0cm9rZS13aWR0aD0iMS45IiA+PHBhdGggZD0iTTQuNSA5aDkiLz48cGF0aCBkPSJNOSA0LjV2OSIvPjwvZz4KPC9zdmc+\") no-repeat 50%}.rst__row_NoFlex:before,.rst__rowContents_NoFlex:before{content:'';display:inline-block;vertical-align:middle;height:100%}.rst__rowContents_NoFlex{display:inline-block}.rst__rowContents_NoFlex:after{content:'';display:inline-block;width:100%}.rst__rowLabel_NoFlex{width:50%}.rst__rowToolbar_NoFlex{text-align:right;width:50%}.rst__lineChildren{height:100%;display:inline-block;position:absolute}.rst__lineChildren:after{content:'';position:absolute;background-color:#000;width:1px;left:50%;bottom:0;height:10px}", "" ]), 
        // exports
        exports.locals = {
            rowWrapper: "rst__rowWrapper",
            row: "rst__row",
            rowLandingPad: "rst__rowLandingPad",
            rowCancelPad: "rst__rowCancelPad",
            rowSearchMatch: "rst__rowSearchMatch",
            rowSearchFocus: "rst__rowSearchFocus",
            rowContents: "rst__rowContents",
            rowLabel: "rst__rowLabel",
            rowToolbar: "rst__rowToolbar",
            moveHandle: "rst__moveHandle",
            loadingHandle: "rst__loadingHandle",
            toolbarButton: "rst__toolbarButton",
            rowLabel_NoFlex: "rst__rowLabel_NoFlex",
            rowToolbar_NoFlex: "rst__rowToolbar_NoFlex",
            loadingCircle: "rst__loadingCircle",
            loadingCirclePoint: "rst__loadingCirclePoint",
            pointFade: "rst__pointFade",
            rowTitle: "rst__rowTitle",
            rowTitleWithSubtitle: "rst__rowTitleWithSubtitle",
            rowSubtitle: "rst__rowSubtitle",
            collapseButton: "rst__collapseButton",
            expandButton: "rst__expandButton",
            row_NoFlex: "rst__row_NoFlex",
            rowContents_NoFlex: "rst__rowContents_NoFlex",
            lineChildren: "rst__lineChildren"
        };
    }, /* 14 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(2)(), // imports
        // module
        exports.push([ module.id, ".rst__tree{/*! This comment keeps Sass from deleting the empty rule */}.rst__virtualScrollOverride *{box-sizing:border-box}.ReactVirtualized__Grid__innerScrollContainer{overflow:visible}.ReactVirtualized__Grid{outline:none}", "" ]), 
        // exports
        exports.locals = {
            tree: "rst__tree",
            virtualScrollOverride: "rst__virtualScrollOverride"
        };
    }, /* 15 */
    /***/
    function(module, exports, __webpack_require__) {
        exports = module.exports = __webpack_require__(2)(), // imports
        // module
        exports.push([ module.id, ".rst__node{min-width:100%;white-space:nowrap}.rst__nodeContent{position:absolute;top:0;bottom:0}.rst__absoluteLineBlock,.rst__lineBlock{height:100%;position:relative;display:inline-block}.rst__absoluteLineBlock{position:absolute;top:0}.rst__lineFullVertical:after,.rst__lineHalfHorizontalRight:before,.rst__lineHalfVerticalBottom:after,.rst__lineHalfVerticalTop:after{position:absolute;content:'';background-color:#000}.rst__lineHalfHorizontalRight:before{height:1px;top:50%;right:0;width:50%}.rst__lineFullVertical:after,.rst__lineHalfVerticalBottom:after,.rst__lineHalfVerticalTop:after{width:1px;left:50%;top:0;height:100%}.rst__lineHalfVerticalBottom:after,.rst__lineHalfVerticalTop:after{top:0;height:50%}.rst__lineHalfVerticalBottom:after{top:auto;bottom:0}.rst__highlightLineVertical{z-index:3}.rst__highlightLineVertical:before{position:absolute;content:'';background-color:#36c2f6;width:8px;margin-left:-4px;left:50%;top:0;height:100%}@-webkit-keyframes rst__arrow-pulse{0%{-webkit-transform:translate(0);transform:translate(0);opacity:0}30%{-webkit-transform:translateY(300%);transform:translateY(300%);opacity:1}70%{-webkit-transform:translateY(700%);transform:translateY(700%);opacity:1}to{-webkit-transform:translateY(1000%);transform:translateY(1000%);opacity:0}}@keyframes rst__arrow-pulse{0%{-webkit-transform:translate(0);transform:translate(0);opacity:0}30%{-webkit-transform:translateY(300%);transform:translateY(300%);opacity:1}70%{-webkit-transform:translateY(700%);transform:translateY(700%);opacity:1}to{-webkit-transform:translateY(1000%);transform:translateY(1000%);opacity:0}}.rst__highlightLineVertical:after{content:'';position:absolute;height:0;margin-left:-4px;left:50%;top:0;border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid #fff;-webkit-animation:rst__arrow-pulse 1s infinite linear both;animation:rst__arrow-pulse 1s infinite linear both}.rst__highlightTopLeftCorner:before{z-index:3;content:'';position:absolute;border-top:8px solid #36c2f6;border-left:8px solid #36c2f6;box-sizing:border-box;height:calc(50% + 4px);top:50%;margin-top:-4px;right:0;width:calc(50% + 4px)}.rst__highlightBottomLeftCorner{z-index:3}.rst__highlightBottomLeftCorner:before{content:'';position:absolute;border-bottom:8px solid #36c2f6;border-left:8px solid #36c2f6;box-sizing:border-box;height:calc(100% + 4px);top:0;right:12px;width:calc(50% - 8px)}.rst__highlightBottomLeftCorner:after{content:'';position:absolute;height:0;right:0;top:100%;margin-top:-12px;border-top:12px solid transparent;border-bottom:12px solid transparent;border-left:12px solid #36c2f6}", "" ]), 
        // exports
        exports.locals = {
            node: "rst__node",
            nodeContent: "rst__nodeContent",
            lineBlock: "rst__lineBlock",
            absoluteLineBlock: "rst__absoluteLineBlock",
            lineHalfHorizontalRight: "rst__lineHalfHorizontalRight",
            lineFullVertical: "rst__lineFullVertical",
            lineHalfVerticalTop: "rst__lineHalfVerticalTop",
            lineHalfVerticalBottom: "rst__lineHalfVerticalBottom",
            highlightLineVertical: "rst__highlightLineVertical",
            "arrow-pulse": "rst__arrow-pulse",
            highlightTopLeftCorner: "rst__highlightTopLeftCorner",
            highlightBottomLeftCorner: "rst__highlightBottomLeftCorner"
        };
    }, /* 16 */
    /***/
    function(module, exports, __webpack_require__) {
        // style-loader: Adds some css to the DOM by adding a <style> tag
        // load the styles
        var content = __webpack_require__(12);
        "string" == typeof content && (content = [ [ module.id, content, "" ] ]);
        // add the styles to the DOM
        __webpack_require__(3)(content, {
            insertAt: "top"
        });
        content.locals && (module.exports = content.locals);
    }, /* 17 */
    /***/
    function(module, exports, __webpack_require__) {
        // style-loader: Adds some css to the DOM by adding a <style> tag
        // load the styles
        var content = __webpack_require__(13);
        "string" == typeof content && (content = [ [ module.id, content, "" ] ]);
        // add the styles to the DOM
        __webpack_require__(3)(content, {
            insertAt: "top"
        });
        content.locals && (module.exports = content.locals);
    }, /* 18 */
    /***/
    function(module, exports, __webpack_require__) {
        // style-loader: Adds some css to the DOM by adding a <style> tag
        // load the styles
        var content = __webpack_require__(14);
        "string" == typeof content && (content = [ [ module.id, content, "" ] ]);
        // add the styles to the DOM
        __webpack_require__(3)(content, {
            insertAt: "top"
        });
        content.locals && (module.exports = content.locals);
    }, /* 19 */
    /***/
    function(module, exports, __webpack_require__) {
        // style-loader: Adds some css to the DOM by adding a <style> tag
        // load the styles
        var content = __webpack_require__(15);
        "string" == typeof content && (content = [ [ module.id, content, "" ] ]);
        // add the styles to the DOM
        __webpack_require__(3)(content, {
            insertAt: "top"
        });
        content.locals && (module.exports = content.locals);
    }, /* 20 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_20__;
    }, /* 21 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_21__;
    }, /* 22 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_22__;
    }, /* 23 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_23__;
    }, /* 24 */
    /***/
    function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_24__;
    } ]);
});
//# sourceMappingURL=react-sortable-tree.js.map