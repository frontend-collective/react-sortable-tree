!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define([], factory) : "object" == typeof exports ? exports.ReactSortableTree = factory() : root.ReactSortableTree = factory();
}(window, function() {
    /******/
    return function(modules) {
        // webpackBootstrap
        /******/ // The module cache
        /******/ var installedModules = {};
        /******/
        /******/ // The require function
        /******/        function __webpack_require__(moduleId) {
            /******/
            /******/ // Check if module is in cache
            /******/ if (installedModules[moduleId]) 
            /******/ return installedModules[moduleId].exports;
            /******/
            /******/ // Create a new module (and put it into the cache)
            /******/            var module = installedModules[moduleId] = {
                /******/ i: moduleId,
                /******/ l: !1,
                /******/ exports: {}
                /******/            };
            /******/
            /******/ // Execute the module function
            /******/            
            /******/
            /******/ // Return the exports of the module
            /******/ return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            /******/
            /******/ // Flag the module as loaded
            /******/ module.l = !0, module.exports;
            /******/        }
        /******/
        /******/
        /******/ // expose the modules object (__webpack_modules__)
        /******/        
        /******/
        /******/
        /******/ // Load entry module and return exports
        /******/ return __webpack_require__.m = modules, 
        /******/
        /******/ // expose the module cache
        /******/ __webpack_require__.c = installedModules, 
        /******/
        /******/ // define getter function for harmony exports
        /******/ __webpack_require__.d = function(exports, name, getter) {
            /******/ __webpack_require__.o(exports, name) || 
            /******/ Object.defineProperty(exports, name, {
                enumerable: !0,
                get: getter
            })
            /******/;
        }, 
        /******/
        /******/ // define __esModule on exports
        /******/ __webpack_require__.r = function(exports) {
            /******/ "undefined" != typeof Symbol && Symbol.toStringTag && 
            /******/ Object.defineProperty(exports, Symbol.toStringTag, {
                value: "Module"
            })
            /******/ , Object.defineProperty(exports, "__esModule", {
                value: !0
            });
        }, 
        /******/
        /******/ // create a fake namespace object
        /******/ // mode & 1: value is a module id, require it
        /******/ // mode & 2: merge all properties of value into the ns
        /******/ // mode & 4: return value when already ns object
        /******/ // mode & 8|1: behave like require
        /******/ __webpack_require__.t = function(value, mode) {
            /******/ if (
            /******/ 1 & mode && (value = __webpack_require__(value)), 8 & mode) return value;
            /******/            if (4 & mode && "object" == typeof value && value && value.__esModule) return value;
            /******/            var ns = Object.create(null);
            /******/            
            /******/ if (__webpack_require__.r(ns), 
            /******/ Object.defineProperty(ns, "default", {
                enumerable: !0,
                value: value
            }), 2 & mode && "string" != typeof value) for (var key in value) __webpack_require__.d(ns, key, function(key) {
                return value[key];
            }.bind(null, key));
            /******/            return ns;
            /******/        }, 
        /******/
        /******/ // getDefaultExport function for compatibility with non-harmony modules
        /******/ __webpack_require__.n = function(module) {
            /******/ var getter = module && module.__esModule ? 
            /******/ function() {
                return module.default;
            } : 
            /******/ function() {
                return module;
            };
            /******/            
            /******/ return __webpack_require__.d(getter, "a", getter), getter;
            /******/        }, 
        /******/
        /******/ // Object.prototype.hasOwnProperty.call
        /******/ __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, 
        /******/
        /******/ // __webpack_public_path__
        /******/ __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 6);
        /******/    }
    /************************************************************************/
    /******/ ([ 
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
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
 */        function getNodeDataAtTreeIndexOrNextIndex(_ref) {
            var targetIndex = _ref.targetIndex, node = _ref.node, currentIndex = _ref.currentIndex, getNodeKey = _ref.getNodeKey, _ref$path = _ref.path, path = void 0 === _ref$path ? [] : _ref$path, _ref$lowerSiblingCoun = _ref.lowerSiblingCounts, lowerSiblingCounts = void 0 === _ref$lowerSiblingCoun ? [] : _ref$lowerSiblingCoun, _ref$ignoreCollapsed = _ref.ignoreCollapsed, ignoreCollapsed = void 0 === _ref$ignoreCollapsed || _ref$ignoreCollapsed, _ref$isPseudoRoot = _ref.isPseudoRoot, selfPath = void 0 !== _ref$isPseudoRoot && _ref$isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                node: node,
                treeIndex: currentIndex
            }) ]);
            // The pseudo-root is not considered in the path
                        // Return target node when found
            if (currentIndex === targetIndex) return {
                node: node,
                lowerSiblingCounts: lowerSiblingCounts,
                path: selfPath
            };
            // Add one and continue for nodes with no children or hidden children
                        if (!node.children || ignoreCollapsed && !0 !== node.expanded) return {
                nextIndex: currentIndex + 1
            };
            // Iterate over each child and their descendants and return the
            // target node if childIndex reaches the targetIndex
                        for (var childIndex = currentIndex + 1, childCount = node.children.length, i = 0; i < childCount; i += 1) {
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
            var node = _ref2.node, _ref2$ignoreCollapsed = _ref2.ignoreCollapsed;
            return getNodeDataAtTreeIndexOrNextIndex({
                getNodeKey: function() {},
                ignoreCollapsed: void 0 === _ref2$ignoreCollapsed || _ref2$ignoreCollapsed,
                node: node,
                currentIndex: 0,
                targetIndex: -1
            }).nextIndex - 1;
        }
        /**
 * Walk all descendants of the given node, depth-first
 *
 * @param {Object} args - Function parameters
 * @param {function} args.callback - Function to call on each node
 * @param {function} args.getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean} args.ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} args.isPseudoRoot - If true, this node has no real data, and only serves
 *                                        as the parent of all the nodes in the tree
 * @param {Object} args.node - A tree node
 * @param {Object=} args.parentNode - The parent node of `node`
 * @param {number} args.currentIndex - The treeIndex of `node`
 * @param {number[]|string[]} args.path - Array of keys leading up to node to be changed
 * @param {number[]} args.lowerSiblingCounts - An array containing the count of siblings beneath the
 *                                             previous nodes in this path
 *
 * @return {number|false} nextIndex - Index of the next sibling of `node`,
 *                                    or false if the walk should be terminated
 */        
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
            !treeData || treeData.length < 1 || function walkDescendants(_ref3) {
                var callback = _ref3.callback, getNodeKey = _ref3.getNodeKey, ignoreCollapsed = _ref3.ignoreCollapsed, _ref3$isPseudoRoot = _ref3.isPseudoRoot, isPseudoRoot = void 0 !== _ref3$isPseudoRoot && _ref3$isPseudoRoot, node = _ref3.node, _ref3$parentNode = _ref3.parentNode, parentNode = void 0 === _ref3$parentNode ? null : _ref3$parentNode, currentIndex = _ref3.currentIndex, _ref3$path = _ref3.path, path = void 0 === _ref3$path ? [] : _ref3$path, _ref3$lowerSiblingCou = _ref3.lowerSiblingCounts, lowerSiblingCounts = void 0 === _ref3$lowerSiblingCou ? [] : _ref3$lowerSiblingCou, selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                    node: node,
                    treeIndex: currentIndex
                }) ]);
                // The pseudo-root is not considered in the path
                                if (!isPseudoRoot && !1 === callback(isPseudoRoot ? null : {
                    node: node,
                    parentNode: parentNode,
                    path: selfPath,
                    lowerSiblingCounts: lowerSiblingCounts,
                    treeIndex: currentIndex
                })) return !1;
                // Return self on nodes with no children or hidden children
                                if (!node.children || !0 !== node.expanded && ignoreCollapsed && !isPseudoRoot) return currentIndex;
                // Get all descendants
                                var childIndex = currentIndex, childCount = node.children.length;
                if ("function" != typeof node.children) for (var i = 0; i < childCount; i += 1) 
                // Cut walk short if the callback returned false
                if (!1 === (childIndex = walkDescendants({
                    callback: callback,
                    getNodeKey: getNodeKey,
                    ignoreCollapsed: ignoreCollapsed,
                    node: node.children[i],
                    parentNode: isPseudoRoot ? null : node,
                    currentIndex: childIndex + 1,
                    lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [ childCount - i - 1 ]),
                    path: selfPath
                }))) return !1;
                return childIndex;
            }
            /**
 * Perform a change on the given node and all its descendants, traversing the tree depth-first
 *
 * @param {Object} args - Function parameters
 * @param {function} args.callback - Function to call on each node
 * @param {function} args.getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean} args.ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 * @param {boolean=} args.isPseudoRoot - If true, this node has no real data, and only serves
 *                                        as the parent of all the nodes in the tree
 * @param {Object} args.node - A tree node
 * @param {Object=} args.parentNode - The parent node of `node`
 * @param {number} args.currentIndex - The treeIndex of `node`
 * @param {number[]|string[]} args.path - Array of keys leading up to node to be changed
 * @param {number[]} args.lowerSiblingCounts - An array containing the count of siblings beneath the
 *                                             previous nodes in this path
 *
 * @return {number|false} nextIndex - Index of the next sibling of `node`,
 *                                    or false if the walk should be terminated
 */ ({
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
 */        function map(_ref8) {
            var treeData = _ref8.treeData, getNodeKey = _ref8.getNodeKey, callback = _ref8.callback, _ref8$ignoreCollapsed = _ref8.ignoreCollapsed, ignoreCollapsed = void 0 === _ref8$ignoreCollapsed || _ref8$ignoreCollapsed;
            return !treeData || treeData.length < 1 ? [] : function mapDescendants(_ref4) {
                var callback = _ref4.callback, getNodeKey = _ref4.getNodeKey, ignoreCollapsed = _ref4.ignoreCollapsed, _ref4$isPseudoRoot = _ref4.isPseudoRoot, isPseudoRoot = void 0 !== _ref4$isPseudoRoot && _ref4$isPseudoRoot, node = _ref4.node, _ref4$parentNode = _ref4.parentNode, parentNode = void 0 === _ref4$parentNode ? null : _ref4$parentNode, currentIndex = _ref4.currentIndex, _ref4$path = _ref4.path, path = void 0 === _ref4$path ? [] : _ref4$path, _ref4$lowerSiblingCou = _ref4.lowerSiblingCounts, lowerSiblingCounts = void 0 === _ref4$lowerSiblingCou ? [] : _ref4$lowerSiblingCou, nextNode = _extends({}, node), selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                    node: nextNode,
                    treeIndex: currentIndex
                }) ]), selfInfo = {
                    node: nextNode,
                    parentNode: parentNode,
                    path: selfPath,
                    lowerSiblingCounts: lowerSiblingCounts,
                    treeIndex: currentIndex
                };
                // Return self on nodes with no children or hidden children
                if (!nextNode.children || !0 !== nextNode.expanded && ignoreCollapsed && !isPseudoRoot) return {
                    treeIndex: currentIndex,
                    node: callback(selfInfo)
                };
                // Get all descendants
                                var childIndex = currentIndex, childCount = nextNode.children.length;
                return "function" != typeof nextNode.children && (nextNode.children = nextNode.children.map(function(child, i) {
                    var mapResult = mapDescendants({
                        callback: callback,
                        getNodeKey: getNodeKey,
                        ignoreCollapsed: ignoreCollapsed,
                        node: child,
                        parentNode: isPseudoRoot ? null : nextNode,
                        currentIndex: childIndex + 1,
                        lowerSiblingCounts: [].concat(_toConsumableArray(lowerSiblingCounts), [ childCount - i - 1 ]),
                        path: selfPath
                    });
                    return childIndex = mapResult.treeIndex, mapResult.node;
                })), {
                    node: callback(selfInfo),
                    treeIndex: childIndex
                };
            }
            /**
 * Count all the visible (expanded) descendants in the tree data.
 *
 * @param {!Object[]} treeData - Tree data
 *
 * @return {number} count
 */ ({
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
            var treeData = _ref12.treeData, path = _ref12.path, newNode = _ref12.newNode, getNodeKey = _ref12.getNodeKey, _ref12$ignoreCollapse = _ref12.ignoreCollapsed, ignoreCollapsed = void 0 === _ref12$ignoreCollapse || _ref12$ignoreCollapse, result = function traverse(_ref13) {
                var _ref13$isPseudoRoot = _ref13.isPseudoRoot, isPseudoRoot = void 0 !== _ref13$isPseudoRoot && _ref13$isPseudoRoot, node = _ref13.node, currentTreeIndex = _ref13.currentTreeIndex, pathIndex = _ref13.pathIndex;
                if (!isPseudoRoot && getNodeKey({
                    node: node,
                    treeIndex: currentTreeIndex
                }) !== path[pathIndex]) return "RESULT_MISS";
                if (pathIndex >= path.length - 1) 
                // If this is the final location in the path, return its changed form
                return "function" == typeof newNode ? newNode({
                    node: node,
                    treeIndex: currentTreeIndex
                }) : newNode;
                if (!node.children) 
                // If this node is part of the path, but has no children, return the unchanged node
                throw new Error("Path referenced children of node with no children.");
                for (var nextTreeIndex = currentTreeIndex + 1, i = 0; i < node.children.length; i += 1) {
                    var _result = traverse({
                        node: node.children[i],
                        currentTreeIndex: nextTreeIndex,
                        pathIndex: pathIndex + 1
                    });
                    // If the result went down the correct path
                                        if ("RESULT_MISS" !== _result) return _extends({}, node, _result ? {
                        children: [].concat(_toConsumableArray(node.children.slice(0, i)), [ _result ], _toConsumableArray(node.children.slice(i + 1)))
                    } : {
                        children: [].concat(_toConsumableArray(node.children.slice(0, i)), _toConsumableArray(node.children.slice(i + 1)))
                    });
                    // If the result was falsy (returned from the newNode function), then
                    //  delete the node from the array.
                                        nextTreeIndex += 1 + getDescendantCount({
                        node: node.children[i],
                        ignoreCollapsed: ignoreCollapsed
                    });
                }
                return "RESULT_MISS";
            }({
                node: {
                    children: treeData
                },
                currentTreeIndex: -1,
                pathIndex: -1,
                isPseudoRoot: !0
            });
            if ("RESULT_MISS" === result) throw new Error("No node found at the given path.");
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
 */        exports.getDescendantCount = getDescendantCount, exports.getVisibleNodeCount = function(_ref5) {
            return _ref5.treeData.reduce(function(total, currentNode) {
                return total + function traverse(node) {
                    if (!node.children || !0 !== node.expanded || "function" == typeof node.children) return 1;
                    return 1 + node.children.reduce(function(total, currentNode) {
                        return total + traverse(currentNode);
                    }, 0);
                }(currentNode);
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
 */ , exports.getVisibleNodeInfoAtIndex = function(_ref6) {
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
            if (result.node) return result;
            return null;
        }, exports.walk = walk, exports.map = map, exports.toggleExpandedForAll = function(_ref9) {
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
        }, exports.changeNodeAtPath = changeNodeAtPath, exports.removeNodeAtPath = function(_ref14) {
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
 * Removes the node at the specified path and returns the resulting treeData.
 *
 * @param {!Object[]} treeData
 * @param {number[]|string[]} path - Array of keys leading up to node to be deleted
 * @param {!function} getNodeKey - Function to get the key from the nodeData and tree index
 * @param {boolean=} ignoreCollapsed - Ignore children of nodes without `expanded` set to `true`
 *
 * @return {Object} result
 * @return {Object[]} result.treeData - The tree data with the node removed
 * @return {Object} result.node - The node that was removed
 * @return {number} result.treeIndex - The previous treeIndex of the removed node
 */ , exports.removeNode = function(_ref15) {
            var treeData = _ref15.treeData, path = _ref15.path, getNodeKey = _ref15.getNodeKey, _ref15$ignoreCollapse = _ref15.ignoreCollapsed, ignoreCollapsed = void 0 === _ref15$ignoreCollapse || _ref15$ignoreCollapse, removedNode = null, removedTreeIndex = null;
            return {
                treeData: changeNodeAtPath({
                    treeData: treeData,
                    path: path,
                    getNodeKey: getNodeKey,
                    ignoreCollapsed: ignoreCollapsed,
                    newNode: function(_ref16) {
                        var node = _ref16.node, treeIndex = _ref16.treeIndex;
                        // Store the target node and delete it from the tree
                                                return removedNode = node, removedTreeIndex = treeIndex, 
                        null;
                    }
                }),
                node: removedNode,
                treeIndex: removedTreeIndex
            };
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
 */ , exports.getNodeAtPath = function(_ref17) {
            var treeData = _ref17.treeData, path = _ref17.path, getNodeKey = _ref17.getNodeKey, _ref17$ignoreCollapse = _ref17.ignoreCollapsed, ignoreCollapsed = void 0 === _ref17$ignoreCollapse || _ref17$ignoreCollapse, foundNodeInfo = null;
            try {
                changeNodeAtPath({
                    treeData: treeData,
                    path: path,
                    getNodeKey: getNodeKey,
                    ignoreCollapsed: ignoreCollapsed,
                    newNode: function(_ref18) {
                        var node = _ref18.node, treeIndex = _ref18.treeIndex;
                        return foundNodeInfo = {
                            node: node,
                            treeIndex: treeIndex
                        }, node;
                    }
                });
            } catch (err) {
                // Ignore the error -- the null return will be explanation enough
            }
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
 */ , exports.addNodeUnderParent = function(_ref19) {
            var treeData = _ref19.treeData, newNode = _ref19.newNode, _ref19$parentKey = _ref19.parentKey, parentKey = void 0 === _ref19$parentKey ? null : _ref19$parentKey, getNodeKey = _ref19.getNodeKey, _ref19$ignoreCollapse = _ref19.ignoreCollapsed, ignoreCollapsed = void 0 === _ref19$ignoreCollapse || _ref19$ignoreCollapse, _ref19$expandParent = _ref19.expandParent, expandParent = void 0 !== _ref19$expandParent && _ref19$expandParent;
            if (null === parentKey) return {
                treeData: [].concat(_toConsumableArray(treeData || []), [ newNode ]),
                treeIndex: (treeData || []).length
            };
            var insertedTreeIndex = null, hasBeenAdded = !1, changedTreeData = map({
                treeData: treeData,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                callback: function(_ref20) {
                    var node = _ref20.node, treeIndex = _ref20.treeIndex, path = _ref20.path, key = path ? path[path.length - 1] : null;
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
                    for (var nextTreeIndex = treeIndex + 1, i = 0; i < parentNode.children.length; i += 1) nextTreeIndex += 1 + getDescendantCount({
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
        }, exports.insertNode = 
        /**
 * Insert a node into the tree at the given depth, after the minimum index
 *
 * @param {!Object[]} treeData - Tree data
 * @param {!number} depth - The depth to insert the node at (the first level of the array being depth 0)
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
 * @return {Object} result.parentNode - The parent node of the inserted node
 */
        function(_ref22) {
            var treeData = _ref22.treeData, targetDepth = _ref22.depth, minimumTreeIndex = _ref22.minimumTreeIndex, newNode = _ref22.newNode, _ref22$getNodeKey = _ref22.getNodeKey, getNodeKey = void 0 === _ref22$getNodeKey ? function() {} : _ref22$getNodeKey, _ref22$ignoreCollapse = _ref22.ignoreCollapsed, ignoreCollapsed = void 0 === _ref22$ignoreCollapse || _ref22$ignoreCollapse, _ref22$expandParent = _ref22.expandParent, expandParent = void 0 !== _ref22$expandParent && _ref22$expandParent;
            if (!treeData && 0 === targetDepth) return {
                treeData: [ newNode ],
                treeIndex: 0,
                path: [ getNodeKey({
                    node: newNode,
                    treeIndex: 0
                }) ],
                parentNode: null
            };
            var insertResult = function addNodeAtDepthAndIndex(_ref21) {
                var targetDepth = _ref21.targetDepth, minimumTreeIndex = _ref21.minimumTreeIndex, newNode = _ref21.newNode, ignoreCollapsed = _ref21.ignoreCollapsed, expandParent = _ref21.expandParent, _ref21$isPseudoRoot = _ref21.isPseudoRoot, isPseudoRoot = void 0 !== _ref21$isPseudoRoot && _ref21$isPseudoRoot, isLastChild = _ref21.isLastChild, node = _ref21.node, currentIndex = _ref21.currentIndex, currentDepth = _ref21.currentDepth, getNodeKey = _ref21.getNodeKey, _ref21$path = _ref21.path, path = void 0 === _ref21$path ? [] : _ref21$path;
                var selfPath = function(n) {
                    return isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
                        node: n,
                        treeIndex: currentIndex
                    }) ]);
                };
                // If the current position is the only possible place to add, add it
                                if (currentIndex >= minimumTreeIndex - 1 || isLastChild && (!node.children || !node.children.length)) {
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
                        parentPath: selfPath(_nextNode),
                        parentNode: isPseudoRoot ? null : _nextNode
                    };
                }
                // If this is the target depth for the insertion,
                // i.e., where the newNode can be added to the current node's children
                                if (currentDepth >= targetDepth - 1) {
                    // Skip over nodes with no children or hidden children
                    if (!node.children || "function" == typeof node.children || !0 !== node.expanded && ignoreCollapsed && !isPseudoRoot) return {
                        node: node,
                        nextIndex: currentIndex + 1
                    };
                    // Scan over the children to see if there's a place among them that fulfills
                    // the minimumTreeIndex requirement
                                        for (var _childIndex = currentIndex + 1, _insertedTreeIndex = null, insertIndex = null, i = 0; i < node.children.length; i += 1) {
                        // If a valid location is found, mark it as the insertion location and
                        // break out of the loop
                        if (_childIndex >= minimumTreeIndex) {
                            _insertedTreeIndex = _childIndex, insertIndex = i;
                            break;
                        }
                        // Increment the index by the child itself plus the number of descendants it has
                                                _childIndex += 1 + getDescendantCount({
                            node: node.children[i],
                            ignoreCollapsed: ignoreCollapsed
                        });
                    }
                    // If no valid indices to add the node were found
                                        if (null === insertIndex) {
                        // If the last position in this node's children is less than the minimum index
                        // and there are more children on the level of this node, return without insertion
                        if (_childIndex < minimumTreeIndex && !isLastChild) return {
                            node: node,
                            nextIndex: _childIndex
                        };
                        // Use the last position in the children array to insert the newNode
                                                _insertedTreeIndex = _childIndex, insertIndex = node.children.length;
                    }
                    // Insert the newNode at the insertIndex
                                        var _nextNode2 = _extends({}, node, {
                        children: [].concat(_toConsumableArray(node.children.slice(0, insertIndex)), [ newNode ], _toConsumableArray(node.children.slice(insertIndex)))
                    });
                    // Return node with successful insert result
                                        return {
                        node: _nextNode2,
                        nextIndex: _childIndex,
                        insertedTreeIndex: _insertedTreeIndex,
                        parentPath: selfPath(_nextNode2),
                        parentNode: isPseudoRoot ? null : _nextNode2
                    };
                }
                // Skip over nodes with no children or hidden children
                                if (!node.children || "function" == typeof node.children || !0 !== node.expanded && ignoreCollapsed && !isPseudoRoot) return {
                    node: node,
                    nextIndex: currentIndex + 1
                };
                // Get all descendants
                                var insertedTreeIndex = null;
                var pathFragment = null;
                var parentNode = null;
                var childIndex = currentIndex + 1;
                var newChildren = node.children;
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
                    parentNode = mapResult.parentNode, pathFragment = mapResult.parentPath), childIndex = mapResult.nextIndex, 
                    mapResult.node;
                }));
                var nextNode = _extends({}, node, {
                    children: newChildren
                });
                var result = {
                    node: nextNode,
                    nextIndex: childIndex
                };
                null !== insertedTreeIndex && (result.insertedTreeIndex = insertedTreeIndex, result.parentPath = [].concat(_toConsumableArray(selfPath(nextNode)), _toConsumableArray(pathFragment)), 
                result.parentNode = parentNode);
                return result;
            }({
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
                }) ]),
                parentNode: insertResult.parentNode
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
 */ , exports.getFlatDataFromTree = function(_ref23) {
            var treeData = _ref23.treeData, getNodeKey = _ref23.getNodeKey, _ref23$ignoreCollapse = _ref23.ignoreCollapsed, ignoreCollapsed = void 0 === _ref23$ignoreCollapse || _ref23$ignoreCollapse;
            if (!treeData || treeData.length < 1) return [];
            var flattened = [];
            return walk({
                treeData: treeData,
                getNodeKey: getNodeKey,
                ignoreCollapsed: ignoreCollapsed,
                callback: function(nodeInfo) {
                    flattened.push(nodeInfo);
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
 */ , exports.getTreeFromFlatData = function(_ref24) {
            var flatData = _ref24.flatData, _ref24$getKey = _ref24.getKey, getKey = void 0 === _ref24$getKey ? function(node) {
                return node.id;
            } : _ref24$getKey, _ref24$getParentKey = _ref24.getParentKey, getParentKey = void 0 === _ref24$getParentKey ? function(node) {
                return node.parentId;
            } : _ref24$getParentKey, _ref24$rootKey = _ref24.rootKey, rootKey = void 0 === _ref24$rootKey ? "0" : _ref24$rootKey;
            if (!flatData) return [];
            var childrenToParents = {};
            if (flatData.forEach(function(child) {
                var parentKey = getParentKey(child);
                parentKey in childrenToParents ? childrenToParents[parentKey].push(child) : childrenToParents[parentKey] = [ child ];
            }), !(rootKey in childrenToParents)) return [];
            return childrenToParents[rootKey].map(function(child) {
                return function trav(parent) {
                    var parentKey = getKey(parent);
                    if (parentKey in childrenToParents) return _extends({}, parent, {
                        children: childrenToParents[parentKey].map(function(child) {
                            return trav(child);
                        })
                    });
                    return _extends({}, parent);
                }(child);
            });
        }
        /**
 * Check if a node is a descendant of another node.
 *
 * @param {!Object} older - Potential ancestor of younger node
 * @param {!Object} younger - Potential descendant of older node
 *
 * @return {boolean}
 */ , exports.isDescendant = function isDescendant(older, younger) {
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
 */ , exports.getDepth = function getDepth(node) {
            var depth = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            if (!node.children) return depth;
            if ("function" == typeof node.children) return depth + 1;
            return node.children.reduce(function(deepest, child) {
                return Math.max(deepest, getDepth(child, depth + 1));
            }, depth);
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
 */ , exports.find = function(_ref25) {
            var getNodeKey = _ref25.getNodeKey, treeData = _ref25.treeData, searchQuery = _ref25.searchQuery, searchMethod = _ref25.searchMethod, searchFocusOffset = _ref25.searchFocusOffset, _ref25$expandAllMatch = _ref25.expandAllMatchPaths, expandAllMatchPaths = void 0 !== _ref25$expandAllMatch && _ref25$expandAllMatch, _ref25$expandFocusMat = _ref25.expandFocusMatchPaths, expandFocusMatchPaths = void 0 === _ref25$expandFocusMat || _ref25$expandFocusMat, matchCount = 0, result = function trav(_ref26) {
                var _ref26$isPseudoRoot = _ref26.isPseudoRoot, isPseudoRoot = void 0 !== _ref26$isPseudoRoot && _ref26$isPseudoRoot, node = _ref26.node, currentIndex = _ref26.currentIndex, _ref26$path = _ref26.path, path = void 0 === _ref26$path ? [] : _ref26$path, matches = [], isSelfMatch = !1, hasFocusMatch = !1, selfPath = isPseudoRoot ? [] : [].concat(_toConsumableArray(path), [ getNodeKey({
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
                })) && (matchCount === searchFocusOffset && (hasFocusMatch = !0), 
                // Keep track of the number of matching nodes, so we know when the searchFocusOffset
                //  is reached
                matchCount += 1, 
                // We cannot add this node to the matches right away, as it may be changed
                //  during the search of the descendants. The entire node is used in
                //  comparisons between nodes inside the `matches` and `treeData` results
                //  of this method (`find`)
                isSelfMatch = !0);
                var childIndex = currentIndex, newNode = _extends({}, node);
                return hasChildren && (
                // Get all descendants
                newNode.children = newNode.children.map(function(child) {
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
                                        return mapResult.node.expanded ? childIndex = mapResult.treeIndex : childIndex += 1, 
                    (mapResult.matches.length > 0 || mapResult.hasFocusMatch) && (matches = [].concat(_toConsumableArray(matches), _toConsumableArray(mapResult.matches)), 
                    mapResult.hasFocusMatch && (hasFocusMatch = !0), 
                    // Expand the current node if it has descendants matching the search
                    // and the settings are set to do so.
                    (expandAllMatchPaths && mapResult.matches.length > 0 || (expandAllMatchPaths || expandFocusMatchPaths) && mapResult.hasFocusMatch) && (newNode.expanded = !0)), 
                    mapResult.node;
                })), 
                // Cannot assign a treeIndex to hidden nodes
                isPseudoRoot || newNode.expanded || (matches = matches.map(function(match) {
                    return _extends({}, match, {
                        treeIndex: null
                    });
                })), 
                // Add this node to the matches if it fits the search criteria.
                // This is performed at the last minute so newNode can be sent in its final form.
                isSelfMatch && (matches = [ _extends({}, extraInfo, {
                    node: newNode
                }) ].concat(_toConsumableArray(matches))), {
                    node: matches.length > 0 ? newNode : node,
                    matches: matches,
                    hasFocusMatch: hasFocusMatch,
                    treeIndex: childIndex
                };
            }({
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
        /***/;
    }, 
    /* 1 */
    /***/ function(module, exports) {
        module.exports = require("react");
        /***/    }, 
    /* 2 */
    /***/ function(module, exports) {
        module.exports = require("prop-types");
        /***/    }, 
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = 
        // very simple className utility for creating a classname string...
        // Falsy arguments are ignored:
        //
        // const active = true
        // const className = classnames(
        //    "class1",
        //    !active && "class2",
        //    active && "class3"
        // ); // returns -> class1 class3";
        //
        function() {
            for (var _len = arguments.length, classes = Array(_len), _key = 0; _key < _len; _key++) classes[_key] = arguments[_key];
            // Use Boolean constructor as a filter callback
            // Allows for loose type truthy/falsey checks
            // Boolean("") === false;
            // Boolean(false) === false;
            // Boolean(undefined) === false;
            // Boolean(null) === false;
            // Boolean(0) === false;
            // Boolean("classname") === true;
                        return classes.filter(Boolean).join(" ");
        }
        /***/;
    }, 
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        // Search for a query string inside a node property
        function stringSearch(key, searchQuery, node, path, treeIndex) {
            return "function" == typeof node[key] ? String(node[key]({
                node: node,
                path: path,
                treeIndex: treeIndex
            })).indexOf(searchQuery) > -1 : "object" === _typeof(node[key]) ? 
            // Cheap hack to get the text of a react object
            function getReactElementText(parent) {
                return "string" == typeof parent ? parent : "object" !== (void 0 === parent ? "undefined" : _typeof(parent)) || !parent.props || !parent.props.children || "string" != typeof parent.props.children && "object" !== _typeof(parent.props.children) ? "" : "string" == typeof parent.props.children ? parent.props.children : parent.props.children.map(function(child) {
                    return getReactElementText(child);
                }).join("");
            }(node[key]).indexOf(searchQuery) > -1 : node[key] && String(node[key]).indexOf(searchQuery) > -1;
            // Search within string
                }
        exports.defaultGetNodeKey = function(_ref) {
            return _ref.treeIndex;
        }, exports.defaultSearchMethod = function(_ref2) {
            var node = _ref2.node, path = _ref2.path, treeIndex = _ref2.treeIndex, searchQuery = _ref2.searchQuery;
            return stringSearch("title", searchQuery, node, path, treeIndex) || stringSearch("subtitle", searchQuery, node, path, treeIndex);
        }
        /***/;
    }, 
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.memoizedGetDescendantCount = exports.memoizedGetFlatDataFromTree = exports.memoizedInsertNode = void 0;
        var _treeDataUtils = __webpack_require__(0), memoize = function(f) {
            var savedArgsArray = [], savedKeysArray = [], savedResult = null;
            return function(args) {
                var keysArray = Object.keys(args).sort(), argsArray = keysArray.map(function(key) {
                    return args[key];
                });
                // If the arguments for the last insert operation are different than this time,
                // recalculate the result
                return (argsArray.length !== savedArgsArray.length || argsArray.some(function(arg, index) {
                    return arg !== savedArgsArray[index];
                }) || keysArray.some(function(key, index) {
                    return key !== savedKeysArray[index];
                })) && (savedArgsArray = argsArray, savedKeysArray = keysArray, savedResult = f(args)), 
                savedResult;
            };
        };
        exports.memoizedInsertNode = memoize(_treeDataUtils.insertNode), exports.memoizedGetFlatDataFromTree = memoize(_treeDataUtils.getFlatDataFromTree), 
        exports.memoizedGetDescendantCount = memoize(_treeDataUtils.getDescendantCount);
    }, 
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.SortableTreeWithoutDndContext = void 0;
        var _defaultHandlers = __webpack_require__(4);
        Object.keys(_defaultHandlers).forEach(function(key) {
            "default" !== key && "__esModule" !== key && Object.defineProperty(exports, key, {
                enumerable: !0,
                get: function() {
                    return _defaultHandlers[key];
                }
            });
        });
        var _treeDataUtils = __webpack_require__(0);
        Object.keys(_treeDataUtils).forEach(function(key) {
            "default" !== key && "__esModule" !== key && Object.defineProperty(exports, key, {
                enumerable: !0,
                get: function() {
                    return _treeDataUtils[key];
                }
            });
        });
        var obj, _reactSortableTree = __webpack_require__(7), _reactSortableTree2 = (obj = _reactSortableTree) && obj.__esModule ? obj : {
            default: obj
        };
        exports.default = _reactSortableTree2.default, 
        // Export the tree component without the react-dnd DragDropContext,
        // for when component is used with other components using react-dnd.
        // see: https://github.com/gaearon/react-dnd/issues/186
        exports.SortableTreeWithoutDndContext = _reactSortableTree.SortableTreeWithoutDndContext;
    }, 
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.SortableTreeWithoutDndContext = void 0;
        var _createClass = function() {
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
        }(), _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
            }
            return target;
        }, _react = __webpack_require__(1), _react2 = _interopRequireDefault(_react), _propTypes2 = _interopRequireDefault(__webpack_require__(2)), _reactVirtualized = __webpack_require__(8), _lodash2 = _interopRequireDefault(__webpack_require__(9)), _reactDndScrollzone = __webpack_require__(10), _reactDndScrollzone2 = _interopRequireDefault(_reactDndScrollzone);
        __webpack_require__(20);
        var _treeNode2 = _interopRequireDefault(__webpack_require__(11)), _nodeRendererDefault2 = _interopRequireDefault(__webpack_require__(12)), _treePlaceholder2 = _interopRequireDefault(__webpack_require__(13)), _placeholderRendererDefault2 = _interopRequireDefault(__webpack_require__(14)), _treeDataUtils = __webpack_require__(0), _memoizedTreeDataUtils = __webpack_require__(5), _genericUtils = __webpack_require__(15), _defaultHandlers = __webpack_require__(4), _dndManager2 = _interopRequireDefault(__webpack_require__(16)), _classnames2 = _interopRequireDefault(__webpack_require__(3));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        __webpack_require__(31);
        var treeIdCounter = 1, mergeTheme = function(props) {
            var merged = _extends({}, props, {
                style: _extends({}, props.theme.style, props.style),
                innerStyle: _extends({}, props.theme.innerStyle, props.innerStyle),
                reactVirtualizedListProps: _extends({}, props.theme.reactVirtualizedListProps, props.reactVirtualizedListProps)
            }), overridableDefaults = {
                nodeContentRenderer: _nodeRendererDefault2.default,
                placeholderRenderer: _placeholderRendererDefault2.default,
                rowHeight: 62,
                scaffoldBlockPxWidth: 44,
                slideRegionSize: 100,
                treeNodeRenderer: _treeNode2.default
            };
            return Object.keys(overridableDefaults).forEach(function(propKey) {
                // If prop has been specified, do not change it
                // If prop is specified in theme, use the theme setting
                // If all else fails, fall back to the default
                null === props[propKey] && (merged[propKey] = void 0 !== props.theme[propKey] ? props.theme[propKey] : overridableDefaults[propKey]);
            }), merged;
        }, ReactSortableTree = function(_Component) {
            function ReactSortableTree(props) {
                !function(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                }(this, ReactSortableTree);
                var _this = function(self, call) {
                    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !call || "object" != typeof call && "function" != typeof call ? self : call;
                }(this, (ReactSortableTree.__proto__ || Object.getPrototypeOf(ReactSortableTree)).call(this, props)), _mergeTheme = mergeTheme(props), dndType = _mergeTheme.dndType, nodeContentRenderer = _mergeTheme.nodeContentRenderer, treeNodeRenderer = _mergeTheme.treeNodeRenderer, isVirtualized = _mergeTheme.isVirtualized, slideRegionSize = _mergeTheme.slideRegionSize;
                return _this.dndManager = new _dndManager2.default(_this), 
                // Wrapping classes for use with react-dnd
                _this.treeId = "rst__" + treeIdCounter, treeIdCounter += 1, _this.dndType = dndType || _this.treeId, 
                _this.nodeContentRenderer = _this.dndManager.wrapSource(nodeContentRenderer), _this.treePlaceholderRenderer = _this.dndManager.wrapPlaceholder(_treePlaceholder2.default), 
                _this.treeNodeRenderer = _this.dndManager.wrapTarget(treeNodeRenderer), 
                // Prepare scroll-on-drag options for this list
                isVirtualized && (_this.scrollZoneVirtualList = (0, _reactDndScrollzone2.default)(_reactVirtualized.List), 
                _this.vStrength = (0, _reactDndScrollzone.createVerticalStrength)(slideRegionSize), 
                _this.hStrength = (0, _reactDndScrollzone.createHorizontalStrength)(slideRegionSize)), 
                _this.state = {
                    draggingTreeData: null,
                    draggedNode: null,
                    draggedMinimumTreeIndex: null,
                    draggedDepth: null,
                    searchMatches: [],
                    searchFocusTreeIndex: null,
                    dragging: !1
                }, _this.toggleChildrenVisibility = _this.toggleChildrenVisibility.bind(_this), 
                _this.moveNode = _this.moveNode.bind(_this), _this.startDrag = _this.startDrag.bind(_this), 
                _this.dragHover = _this.dragHover.bind(_this), _this.endDrag = _this.endDrag.bind(_this), 
                _this.drop = _this.drop.bind(_this), _this.handleDndMonitorChange = _this.handleDndMonitorChange.bind(_this), 
                _this;
            }
            return function(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
            }(ReactSortableTree, _react.Component), _createClass(ReactSortableTree, [ {
                key: "componentDidMount",
                value: function() {
                    this.loadLazyChildren(), this.search(this.props), 
                    // Hook into react-dnd state changes to detect when the drag ends
                    // TODO: This is very brittle, so it needs to be replaced if react-dnd
                    // offers a more official way to detect when a drag ends
                    this.clearMonitorSubscription = this.context.dragDropManager.getMonitor().subscribeToStateChange(this.handleDndMonitorChange);
                }
            }, {
                key: "componentWillReceiveProps",
                value: function(nextProps) {
                    this.props.treeData !== nextProps.treeData ? (
                    // Ignore updates caused by search, in order to avoid infinite looping
                    this.ignoreOneTreeUpdate ? this.ignoreOneTreeUpdate = !1 : (
                    // Reset the focused index if the tree has changed
                    this.setState({
                        searchFocusTreeIndex: null
                    }), 
                    // Load any children defined by a function
                    this.loadLazyChildren(nextProps), this.search(nextProps, !1, !1)), 
                    // Reset the drag state
                    this.setState({
                        draggingTreeData: null,
                        draggedNode: null,
                        draggedMinimumTreeIndex: null,
                        draggedDepth: null,
                        dragging: !1
                    })) : (0, _lodash2.default)(this.props.searchQuery, nextProps.searchQuery) ? this.props.searchFocusOffset !== nextProps.searchFocusOffset && this.search(nextProps, !0, !0, !0) : this.search(nextProps);
                }
                // listen to dragging
                        }, {
                key: "componentDidUpdate",
                value: function(prevProps, prevState) {
                    // if it is not the same then call the onDragStateChanged
                    this.state.dragging !== prevState.dragging && this.props.onDragStateChanged && this.props.onDragStateChanged({
                        isDragging: this.state.dragging,
                        draggedNode: this.state.draggedNode
                    });
                }
            }, {
                key: "componentWillUnmount",
                value: function() {
                    this.clearMonitorSubscription();
                }
            }, {
                key: "getRows",
                value: function(treeData) {
                    return (0, _memoizedTreeDataUtils.memoizedGetFlatDataFromTree)({
                        ignoreCollapsed: !0,
                        getNodeKey: this.props.getNodeKey,
                        treeData: treeData
                    });
                }
            }, {
                key: "handleDndMonitorChange",
                value: function() {
                    // If the drag ends and the tree is still in a mid-drag state,
                    // it means that the drag was canceled or the dragSource dropped
                    // elsewhere, and we should reset the state of this tree
                    !this.context.dragDropManager.getMonitor().isDragging() && this.state.draggingTreeData && this.endDrag();
                }
            }, {
                key: "toggleChildrenVisibility",
                value: function(_ref) {
                    var targetNode = _ref.node, path = _ref.path, treeData = (0, _treeDataUtils.changeNodeAtPath)({
                        treeData: this.props.treeData,
                        path: path,
                        newNode: function(_ref2) {
                            var node = _ref2.node;
                            return _extends({}, node, {
                                expanded: !node.expanded
                            });
                        },
                        getNodeKey: this.props.getNodeKey
                    });
                    this.props.onChange(treeData), this.props.onVisibilityToggle({
                        treeData: treeData,
                        node: targetNode,
                        expanded: !targetNode.expanded,
                        path: path
                    });
                }
            }, {
                key: "moveNode",
                value: function(_ref3) {
                    var node = _ref3.node, prevPath = _ref3.path, prevTreeIndex = _ref3.treeIndex, depth = _ref3.depth, minimumTreeIndex = _ref3.minimumTreeIndex, _insertNode = (0, 
                    _treeDataUtils.insertNode)({
                        treeData: this.state.draggingTreeData,
                        newNode: node,
                        depth: depth,
                        minimumTreeIndex: minimumTreeIndex,
                        expandParent: !0,
                        getNodeKey: this.props.getNodeKey
                    }), treeData = _insertNode.treeData, treeIndex = _insertNode.treeIndex, path = _insertNode.path, nextParentNode = _insertNode.parentNode;
                    this.props.onChange(treeData), this.props.onMoveNode({
                        treeData: treeData,
                        node: node,
                        treeIndex: treeIndex,
                        path: path,
                        nextPath: path,
                        nextTreeIndex: treeIndex,
                        prevPath: prevPath,
                        prevTreeIndex: prevTreeIndex,
                        nextParentNode: nextParentNode
                    });
                }
            }, {
                key: "search",
                value: function() {
                    var props = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props, seekIndex = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], expand = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], singleSearch = arguments.length > 3 && void 0 !== arguments[3] && arguments[3], treeData = props.treeData, onChange = props.onChange, searchFinishCallback = props.searchFinishCallback, searchQuery = props.searchQuery, searchMethod = props.searchMethod, searchFocusOffset = props.searchFocusOffset, onlyExpandSearchedNodes = props.onlyExpandSearchedNodes;
                    // Skip search if no conditions are specified
                    if ((null === searchQuery || void 0 === searchQuery || "" === String(searchQuery)) && !searchMethod) return this.setState({
                        searchMatches: []
                    }), void (searchFinishCallback && searchFinishCallback([]));
                    // if onlyExpandSearchedNodes collapse the tree and search
                                        var _find = (0, _treeDataUtils.find)({
                        getNodeKey: this.props.getNodeKey,
                        treeData: onlyExpandSearchedNodes ? (0, _treeDataUtils.toggleExpandedForAll)({
                            treeData: treeData,
                            expanded: !1
                        }) : treeData,
                        searchQuery: searchQuery,
                        searchMethod: searchMethod || _defaultHandlers.defaultSearchMethod,
                        searchFocusOffset: searchFocusOffset,
                        expandAllMatchPaths: expand && !singleSearch,
                        expandFocusMatchPaths: !!expand
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
                    var _this2 = this, path = _ref4.path;
                    this.setState(function() {
                        var _removeNode = (0, _treeDataUtils.removeNode)({
                            treeData: _this2.props.treeData,
                            path: path,
                            getNodeKey: _this2.props.getNodeKey
                        }), draggingTreeData = _removeNode.treeData, draggedNode = _removeNode.node, draggedMinimumTreeIndex = _removeNode.treeIndex;
                        return {
                            draggingTreeData: draggingTreeData,
                            draggedNode: draggedNode,
                            draggedDepth: path.length - 1,
                            draggedMinimumTreeIndex: draggedMinimumTreeIndex,
                            dragging: !0
                        };
                    });
                }
            }, {
                key: "dragHover",
                value: function(_ref5) {
                    var draggedNode = _ref5.node, draggedDepth = _ref5.depth, draggedMinimumTreeIndex = _ref5.minimumTreeIndex;
                    // Ignore this hover if it is at the same position as the last hover
                                        if (this.state.draggedDepth !== draggedDepth || this.state.draggedMinimumTreeIndex !== draggedMinimumTreeIndex) {
                        // Fall back to the tree data if something is being dragged in from
                        //  an external element
                        var draggingTreeData = this.state.draggingTreeData || this.props.treeData, addedResult = (0, 
                        _memoizedTreeDataUtils.memoizedInsertNode)({
                            treeData: draggingTreeData,
                            newNode: draggedNode,
                            depth: draggedDepth,
                            minimumTreeIndex: draggedMinimumTreeIndex,
                            expandParent: !0,
                            getNodeKey: this.props.getNodeKey
                        }), expandedParentPath = this.getRows(addedResult.treeData)[addedResult.treeIndex].path;
                        this.setState({
                            draggedNode: draggedNode,
                            draggedDepth: draggedDepth,
                            draggedMinimumTreeIndex: draggedMinimumTreeIndex,
                            draggingTreeData: (0, _treeDataUtils.changeNodeAtPath)({
                                treeData: draggingTreeData,
                                path: expandedParentPath.slice(0, -1),
                                newNode: function(_ref6) {
                                    var node = _ref6.node;
                                    return _extends({}, node, {
                                        expanded: !0
                                    });
                                },
                                getNodeKey: this.props.getNodeKey
                            }),
                            // reset the scroll focus so it doesn't jump back
                            // to a search result while dragging
                            searchFocusTreeIndex: null,
                            dragging: !0
                        });
                    }
                }
            }, {
                key: "endDrag",
                value: function(dropResult) {
                    var _this3 = this;
                    // Drop was cancelled
                    if (dropResult) {
                        if (dropResult.treeId !== this.treeId) {
                            // The node was dropped in an external drop target or tree
                            var node = dropResult.node, path = dropResult.path, treeIndex = dropResult.treeIndex, shouldCopy = this.props.shouldCopyOnOutsideDrop;
                            "function" == typeof shouldCopy && (shouldCopy = shouldCopy({
                                node: node,
                                prevTreeIndex: treeIndex,
                                prevPath: path
                            }));
                            var treeData = this.state.draggingTreeData || this.props.treeData;
                            // If copying is enabled, a drop outside leaves behind a copy in the
                            //  source tree
                                                        shouldCopy && (treeData = (0, _treeDataUtils.changeNodeAtPath)({
                                treeData: this.props.treeData,
                                // use treeData unaltered by the drag operation
                                path: path,
                                newNode: function(_ref7) {
                                    var copyNode = _ref7.node;
                                    return _extends({}, copyNode);
                                },
                                // create a shallow copy of the node
                                getNodeKey: this.props.getNodeKey
                            })), this.props.onChange(treeData), this.props.onMoveNode({
                                treeData: treeData,
                                node: node,
                                treeIndex: null,
                                path: null,
                                nextPath: null,
                                nextTreeIndex: null,
                                prevPath: path,
                                prevTreeIndex: treeIndex
                            });
                        }
                    } else _this3.setState({
                        draggingTreeData: null,
                        draggedNode: null,
                        draggedMinimumTreeIndex: null,
                        draggedDepth: null,
                        dragging: !1
                    });
                }
            }, {
                key: "drop",
                value: function(dropResult) {
                    this.moveNode(dropResult);
                }
                // Load any children in the tree that are given by a function
                        }, {
                key: "loadLazyChildren",
                value: function() {
                    var _this4 = this, props = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : this.props;
                    (0, _treeDataUtils.walk)({
                        treeData: props.treeData,
                        getNodeKey: this.props.getNodeKey,
                        callback: function(_ref8) {
                            var node = _ref8.node, path = _ref8.path, lowerSiblingCounts = _ref8.lowerSiblingCounts, treeIndex = _ref8.treeIndex;
                            // If the node has children defined by a function, and is either expanded
                            //  or set to load even before expansion, run the function.
                                                        node.children && "function" == typeof node.children && (node.expanded || props.loadCollapsedLazyChildren) && 
                            // Call the children fetching function
                            node.children({
                                node: node,
                                path: path,
                                lowerSiblingCounts: lowerSiblingCounts,
                                treeIndex: treeIndex,
                                // Provide a helper to append the new data when it is received
                                done: function(childrenArray) {
                                    return _this4.props.onChange((0, _treeDataUtils.changeNodeAtPath)({
                                        treeData: _this4.props.treeData,
                                        path: path,
                                        newNode: function(_ref9) {
                                            var oldNode = _ref9.node;
                                            return 
                                            // Only replace the old node if it's the one we set off to find children
                                            //  for in the first place
                                            oldNode === node ? _extends({}, oldNode, {
                                                children: childrenArray
                                            }) : oldNode;
                                        },
                                        getNodeKey: _this4.props.getNodeKey
                                    }));
                                }
                            });
                        }
                    });
                }
            }, {
                key: "renderRow",
                value: function(_ref10, _ref11) {
                    var node = _ref10.node, parentNode = _ref10.parentNode, path = _ref10.path, lowerSiblingCounts = _ref10.lowerSiblingCounts, treeIndex = _ref10.treeIndex, listIndex = _ref11.listIndex, style = _ref11.style, getPrevRow = _ref11.getPrevRow, matchKeys = _ref11.matchKeys, swapFrom = _ref11.swapFrom, swapDepth = _ref11.swapDepth, swapLength = _ref11.swapLength, _mergeTheme2 = mergeTheme(this.props), canDrag = _mergeTheme2.canDrag, generateNodeProps = _mergeTheme2.generateNodeProps, scaffoldBlockPxWidth = _mergeTheme2.scaffoldBlockPxWidth, searchFocusOffset = _mergeTheme2.searchFocusOffset, TreeNodeRenderer = this.treeNodeRenderer, NodeContentRenderer = this.nodeContentRenderer, nodeKey = path[path.length - 1], isSearchMatch = nodeKey in matchKeys, isSearchFocus = isSearchMatch && matchKeys[nodeKey] === searchFocusOffset, callbackParams = {
                        node: node,
                        parentNode: parentNode,
                        path: path,
                        lowerSiblingCounts: lowerSiblingCounts,
                        treeIndex: treeIndex,
                        isSearchMatch: isSearchMatch,
                        isSearchFocus: isSearchFocus
                    }, nodeProps = generateNodeProps ? generateNodeProps(callbackParams) : {}, rowCanDrag = "function" != typeof canDrag ? canDrag : canDrag(callbackParams), sharedProps = {
                        treeIndex: treeIndex,
                        scaffoldBlockPxWidth: scaffoldBlockPxWidth,
                        node: node,
                        path: path,
                        treeId: this.treeId
                    };
                    return _react2.default.createElement(TreeNodeRenderer, _extends({
                        style: style,
                        key: nodeKey,
                        listIndex: listIndex,
                        getPrevRow: getPrevRow,
                        lowerSiblingCounts: lowerSiblingCounts,
                        swapFrom: swapFrom,
                        swapLength: swapLength,
                        swapDepth: swapDepth
                    }, sharedProps), _react2.default.createElement(NodeContentRenderer, _extends({
                        parentNode: parentNode,
                        isSearchMatch: isSearchMatch,
                        isSearchFocus: isSearchFocus,
                        canDrag: rowCanDrag,
                        toggleChildrenVisibility: this.toggleChildrenVisibility
                    }, sharedProps, nodeProps)));
                }
            }, {
                key: "render",
                value: function() {
                    var _this5 = this, _mergeTheme3 = mergeTheme(this.props), style = _mergeTheme3.style, className = _mergeTheme3.className, innerStyle = _mergeTheme3.innerStyle, rowHeight = _mergeTheme3.rowHeight, isVirtualized = _mergeTheme3.isVirtualized, placeholderRenderer = _mergeTheme3.placeholderRenderer, reactVirtualizedListProps = _mergeTheme3.reactVirtualizedListProps, getNodeKey = _mergeTheme3.getNodeKey, _state = this.state, searchMatches = _state.searchMatches, searchFocusTreeIndex = _state.searchFocusTreeIndex, draggedNode = _state.draggedNode, draggedDepth = _state.draggedDepth, draggedMinimumTreeIndex = _state.draggedMinimumTreeIndex, treeData = this.state.draggingTreeData || this.props.treeData, rows = void 0, swapFrom = null, swapLength = null;
                    if (draggedNode && null !== draggedMinimumTreeIndex) {
                        var addedResult = (0, _memoizedTreeDataUtils.memoizedInsertNode)({
                            treeData: treeData,
                            newNode: draggedNode,
                            depth: draggedDepth,
                            minimumTreeIndex: draggedMinimumTreeIndex,
                            expandParent: !0,
                            getNodeKey: getNodeKey
                        }), swapTo = draggedMinimumTreeIndex;
                        swapFrom = addedResult.treeIndex, swapLength = 1 + (0, _memoizedTreeDataUtils.memoizedGetDescendantCount)({
                            node: draggedNode
                        }), rows = (0, _genericUtils.slideRows)(this.getRows(addedResult.treeData), swapFrom, swapTo, swapLength);
                    } else rows = this.getRows(treeData);
                    // Get indices for rows that match the search conditions
                                        var matchKeys = {};
                    searchMatches.forEach(function(_ref12, i) {
                        var path = _ref12.path;
                        matchKeys[path[path.length - 1]] = i;
                    });
                    // Seek to the focused search result if there is one specified
                    var scrollToInfo = null !== searchFocusTreeIndex ? {
                        scrollToIndex: searchFocusTreeIndex
                    } : {}, containerStyle = style, list = void 0;
                    if (rows.length < 1) {
                        var Placeholder = this.treePlaceholderRenderer, PlaceholderContent = placeholderRenderer;
                        list = _react2.default.createElement(Placeholder, {
                            treeId: this.treeId,
                            drop: this.drop
                        }, _react2.default.createElement(PlaceholderContent, null));
                    } else if (isVirtualized) {
                        containerStyle = _extends({
                            height: "100%"
                        }, containerStyle);
                        var ScrollZoneVirtualList = this.scrollZoneVirtualList;
                        // Render list with react-virtualized
                                                list = _react2.default.createElement(_reactVirtualized.AutoSizer, null, function(_ref13) {
                            var height = _ref13.height, width = _ref13.width;
                            return _react2.default.createElement(ScrollZoneVirtualList, _extends({}, scrollToInfo, {
                                verticalStrength: _this5.vStrength,
                                horizontalStrength: _this5.hStrength,
                                speed: 30,
                                scrollToAlignment: "start",
                                className: "rst__virtualScrollOverride",
                                width: width,
                                onScroll: function(_ref14) {
                                    var scrollTop = _ref14.scrollTop;
                                    _this5.scrollTop = scrollTop;
                                },
                                height: height,
                                style: innerStyle,
                                rowCount: rows.length,
                                estimatedRowSize: "function" != typeof rowHeight ? rowHeight : void 0,
                                rowHeight: "function" != typeof rowHeight ? rowHeight : function(_ref15) {
                                    var index = _ref15.index;
                                    return rowHeight({
                                        index: index,
                                        treeIndex: index,
                                        node: rows[index].node,
                                        path: rows[index].path
                                    });
                                },
                                rowRenderer: function(_ref16) {
                                    var index = _ref16.index, rowStyle = _ref16.style;
                                    return _this5.renderRow(rows[index], {
                                        listIndex: index,
                                        style: rowStyle,
                                        getPrevRow: function() {
                                            return rows[index - 1] || null;
                                        },
                                        matchKeys: matchKeys,
                                        swapFrom: swapFrom,
                                        swapDepth: draggedDepth,
                                        swapLength: swapLength
                                    });
                                }
                            }, reactVirtualizedListProps));
                        });
                    } else 
                    // Render list without react-virtualized
                    list = rows.map(function(row, index) {
                        return _this5.renderRow(row, {
                            listIndex: index,
                            style: {
                                height: "function" != typeof rowHeight ? rowHeight : rowHeight({
                                    index: index,
                                    treeIndex: index,
                                    node: row.node,
                                    path: row.path
                                })
                            },
                            getPrevRow: function() {
                                return rows[index - 1] || null;
                            },
                            matchKeys: matchKeys,
                            swapFrom: swapFrom,
                            swapDepth: draggedDepth,
                            swapLength: swapLength
                        });
                    });
                    return _react2.default.createElement("div", {
                        className: (0, _classnames2.default)("rst__tree", className),
                        style: containerStyle
                    }, list);
                }
            } ]), ReactSortableTree;
        }();
        ReactSortableTree.propTypes = {
            // Tree data in the following format:
            // [{title: 'main', subtitle: 'sub'}, { title: 'value2', expanded: true, children: [{ title: 'value3') }] }]
            // `title` is the primary label for the node
            // `subtitle` is a secondary label for the node
            // `expanded` shows children of the node if true, or hides them if false. Defaults to false.
            // `children` is an array of child nodes belonging to the node.
            treeData: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
            // Style applied to the container wrapping the tree (style defaults to {height: '100%'})
            style: _propTypes2.default.shape({}),
            // Class name for the container wrapping the tree
            className: _propTypes2.default.string,
            // Style applied to the inner, scrollable container (for padding, etc.)
            innerStyle: _propTypes2.default.shape({}),
            // Used by react-virtualized
            // Either a fixed row height (number) or a function that returns the
            // height of a row given its index: `({ index: number }): number`
            rowHeight: _propTypes2.default.oneOfType([ _propTypes2.default.number, _propTypes2.default.func ]),
            // Size in px of the region near the edges that initiates scrolling on dragover
            slideRegionSize: _propTypes2.default.number,
            // Custom properties to hand to the react-virtualized list
            // https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md#prop-types
            reactVirtualizedListProps: _propTypes2.default.shape({}),
            // The width of the blocks containing the lines representing the structure of the tree.
            scaffoldBlockPxWidth: _propTypes2.default.number,
            // Maximum depth nodes can be inserted at. Defaults to infinite.
            maxDepth: _propTypes2.default.number,
            // The method used to search nodes.
            // Defaults to a function that uses the `searchQuery` string to search for nodes with
            // matching `title` or `subtitle` values.
            // NOTE: Changing `searchMethod` will not update the search, but changing the `searchQuery` will.
            searchMethod: _propTypes2.default.func,
            // Used by the `searchMethod` to highlight and scroll to matched nodes.
            // Should be a string for the default `searchMethod`, but can be anything when using a custom search.
            searchQuery: _propTypes2.default.any,
            // eslint-disable-line react/forbid-prop-types
            // Outline the <`searchFocusOffset`>th node and scroll to it.
            searchFocusOffset: _propTypes2.default.number,
            // Get the nodes that match the search criteria. Used for counting total matches, etc.
            searchFinishCallback: _propTypes2.default.func,
            // Generate an object with additional props to be passed to the node renderer.
            // Use this for adding buttons via the `buttons` key,
            // or additional `style` / `className` settings.
            generateNodeProps: _propTypes2.default.func,
            // Set to false to disable virtualization.
            // NOTE: Auto-scrolling while dragging, and scrolling to the `searchFocusOffset` will be disabled.
            isVirtualized: _propTypes2.default.bool,
            treeNodeRenderer: _propTypes2.default.func,
            // Override the default component for rendering nodes (but keep the scaffolding generator)
            // This is an advanced option for complete customization of the appearance.
            // It is best to copy the component in `node-renderer-default.js` to use as a base, and customize as needed.
            nodeContentRenderer: _propTypes2.default.func,
            // Override the default component for rendering an empty tree
            // This is an advanced option for complete customization of the appearance.
            // It is best to copy the component in `placeholder-renderer-default.js` to use as a base,
            // and customize as needed.
            placeholderRenderer: _propTypes2.default.func,
            theme: _propTypes2.default.shape({
                style: _propTypes2.default.shape({}),
                innerStyle: _propTypes2.default.shape({}),
                reactVirtualizedListProps: _propTypes2.default.shape({}),
                scaffoldBlockPxWidth: _propTypes2.default.number,
                slideRegionSize: _propTypes2.default.number,
                rowHeight: _propTypes2.default.oneOfType([ _propTypes2.default.number, _propTypes2.default.func ]),
                treeNodeRenderer: _propTypes2.default.func,
                nodeContentRenderer: _propTypes2.default.func,
                placeholderRenderer: _propTypes2.default.func
            }),
            // Determine the unique key used to identify each node and
            // generate the `path` array passed in callbacks.
            // By default, returns the index in the tree (omitting hidden nodes).
            getNodeKey: _propTypes2.default.func,
            // Called whenever tree data changed.
            // Just like with React input elements, you have to update your
            // own component's data to see the changes reflected.
            onChange: _propTypes2.default.func.isRequired,
            // Called after node move operation.
            onMoveNode: _propTypes2.default.func,
            // Determine whether a node can be dragged. Set to false to disable dragging on all nodes.
            canDrag: _propTypes2.default.oneOfType([ _propTypes2.default.func, _propTypes2.default.bool ]),
            // Determine whether a node can be dropped based on its path and parents'.
            canDrop: _propTypes2.default.func,
            // When true, or a callback returning true, dropping nodes to react-dnd
            // drop targets outside of this tree will not remove them from this tree
            shouldCopyOnOutsideDrop: _propTypes2.default.oneOfType([ _propTypes2.default.func, _propTypes2.default.bool ]),
            // Called after children nodes collapsed or expanded.
            onVisibilityToggle: _propTypes2.default.func,
            dndType: _propTypes2.default.string,
            // Called to track between dropped and dragging
            onDragStateChanged: _propTypes2.default.func,
            // Specify that nodes that do not match search will be collapsed
            onlyExpandSearchedNodes: _propTypes2.default.bool
        }, ReactSortableTree.defaultProps = {
            canDrag: !0,
            canDrop: null,
            className: "",
            dndType: null,
            generateNodeProps: null,
            getNodeKey: _defaultHandlers.defaultGetNodeKey,
            innerStyle: {},
            isVirtualized: !0,
            maxDepth: null,
            treeNodeRenderer: null,
            nodeContentRenderer: null,
            onMoveNode: function() {},
            onVisibilityToggle: function() {},
            placeholderRenderer: null,
            reactVirtualizedListProps: {},
            rowHeight: null,
            scaffoldBlockPxWidth: null,
            searchFinishCallback: null,
            searchFocusOffset: null,
            searchMethod: null,
            searchQuery: null,
            shouldCopyOnOutsideDrop: !1,
            slideRegionSize: null,
            style: {},
            theme: {},
            onDragStateChanged: function() {},
            onlyExpandSearchedNodes: !1
        }, ReactSortableTree.contextTypes = {
            dragDropManager: _propTypes2.default.shape({})
        }, 
        // Export the tree component without the react-dnd DragDropContext,
        // for when component is used with other components using react-dnd.
        // see: https://github.com/gaearon/react-dnd/issues/186
        exports.SortableTreeWithoutDndContext = ReactSortableTree, exports.default = _dndManager2.default.wrapRoot(ReactSortableTree);
    }, 
    /* 8 */
    /***/ function(module, exports) {
        module.exports = require("react-virtualized");
        /***/    }, 
    /* 9 */
    /***/ function(module, exports) {
        module.exports = require("lodash.isequal");
        /***/    }, 
    /* 10 */
    /***/ function(module, exports) {
        module.exports = require("react-dnd-scrollzone");
        /***/    }, 
    /* 11 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
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
        }(), _react = __webpack_require__(1), _react2 = _interopRequireDefault(_react), _propTypes2 = _interopRequireDefault(__webpack_require__(2)), _classnames2 = _interopRequireDefault(__webpack_require__(3));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        __webpack_require__(25);
        var TreeNode = function(_Component) {
            function TreeNode() {
                return function(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                }(this, TreeNode), function(self, call) {
                    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !call || "object" != typeof call && "function" != typeof call ? self : call;
                }(this, (TreeNode.__proto__ || Object.getPrototypeOf(TreeNode)).apply(this, arguments));
            }
            return function(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
            }(TreeNode, _react.Component), _createClass(TreeNode, [ {
                key: "render",
                value: function() {
                    var _props = this.props, children = _props.children, listIndex = _props.listIndex, swapFrom = _props.swapFrom, swapLength = _props.swapLength, swapDepth = _props.swapDepth, scaffoldBlockPxWidth = _props.scaffoldBlockPxWidth, lowerSiblingCounts = _props.lowerSiblingCounts, connectDropTarget = _props.connectDropTarget, isOver = _props.isOver, draggedNode = _props.draggedNode, canDrop = _props.canDrop, treeIndex = _props.treeIndex, otherProps = (_props.treeId, 
                    _props.getPrevRow, _props.node, _props.path, function(obj, keys) {
                        var target = {};
                        for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
                        return target;
                    }(_props, [ "children", "listIndex", "swapFrom", "swapLength", "swapDepth", "scaffoldBlockPxWidth", "lowerSiblingCounts", "connectDropTarget", "isOver", "draggedNode", "canDrop", "treeIndex", "treeId", "getPrevRow", "node", "path" ])), scaffoldBlockCount = lowerSiblingCounts.length, scaffold = [];
                    // Construct the scaffold representing the structure of the tree
                                        return lowerSiblingCounts.forEach(function(lowerSiblingCount, i) {
                        var lineClass = "";
                        if (lowerSiblingCount > 0 ? 
                        // At this level in the tree, the nodes had sibling nodes further down
                        // Top-left corner of the tree
                        // +-----+
                        // |     |
                        // |  +--+
                        // |  |  |
                        // +--+--+
                        lineClass = 0 === listIndex ? "rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom" : i === scaffoldBlockCount - 1 ? "rst__lineHalfHorizontalRight rst__lineFullVertical" : "rst__lineFullVertical" : 0 === listIndex ? 
                        // Top-left corner of the tree, but has no siblings
                        // +-----+
                        // |     |
                        // |  +--+
                        // |     |
                        // +-----+
                        lineClass = "rst__lineHalfHorizontalRight" : i === scaffoldBlockCount - 1 && (
                        // The last or only node in this level of the tree
                        // +--+--+
                        // |  |  |
                        // |  +--+
                        // |     |
                        // +-----+
                        lineClass = "rst__lineHalfVerticalTop rst__lineHalfHorizontalRight"), scaffold.push(_react2.default.createElement("div", {
                            key: "pre_" + (1 + i),
                            style: {
                                width: scaffoldBlockPxWidth
                            },
                            className: "rst__lineBlock " + lineClass
                        })), treeIndex !== listIndex && i === swapDepth) {
                            // This row has been shifted, and is at the depth of
                            // the line pointing to the new destination
                            var highlightLineClass = "";
                            // This block is on the bottom (target) line
                            // This block points at the target block (where the row will go when released)
                            highlightLineClass = listIndex === swapFrom + swapLength - 1 ? "rst__highlightBottomLeftCorner" : treeIndex === swapFrom ? "rst__highlightTopLeftCorner" : "rst__highlightLineVertical", 
                            scaffold.push(_react2.default.createElement("div", {
                                // eslint-disable-next-line react/no-array-index-key
                                key: i,
                                style: {
                                    width: scaffoldBlockPxWidth,
                                    left: scaffoldBlockPxWidth * i
                                },
                                className: (0, _classnames2.default)("rst__absoluteLineBlock", highlightLineClass)
                            }));
                        }
                    }), connectDropTarget(_react2.default.createElement("div", _extends({}, otherProps, {
                        className: "rst__node"
                    }), scaffold, _react2.default.createElement("div", {
                        className: "rst__nodeContent",
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
                }
            } ]), TreeNode;
        }();
        TreeNode.defaultProps = {
            swapFrom: null,
            swapDepth: null,
            swapLength: null,
            canDrop: !1,
            draggedNode: null
        }, TreeNode.propTypes = {
            treeIndex: _propTypes2.default.number.isRequired,
            treeId: _propTypes2.default.string.isRequired,
            swapFrom: _propTypes2.default.number,
            swapDepth: _propTypes2.default.number,
            swapLength: _propTypes2.default.number,
            scaffoldBlockPxWidth: _propTypes2.default.number.isRequired,
            lowerSiblingCounts: _propTypes2.default.arrayOf(_propTypes2.default.number).isRequired,
            listIndex: _propTypes2.default.number.isRequired,
            children: _propTypes2.default.node.isRequired,
            // Drop target
            connectDropTarget: _propTypes2.default.func.isRequired,
            isOver: _propTypes2.default.bool.isRequired,
            canDrop: _propTypes2.default.bool,
            draggedNode: _propTypes2.default.shape({}),
            // used in dndManager
            getPrevRow: _propTypes2.default.func.isRequired,
            node: _propTypes2.default.shape({}).isRequired,
            path: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([ _propTypes2.default.string, _propTypes2.default.number ])).isRequired
        }, exports.default = TreeNode;
    }, 
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
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
        }(), _react = __webpack_require__(1), _react2 = _interopRequireDefault(_react), _propTypes2 = _interopRequireDefault(__webpack_require__(2)), _treeDataUtils = __webpack_require__(0), _classnames2 = _interopRequireDefault(__webpack_require__(3));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        __webpack_require__(27);
        var NodeRendererDefault = function(_Component) {
            function NodeRendererDefault() {
                return function(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                }(this, NodeRendererDefault), function(self, call) {
                    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !call || "object" != typeof call && "function" != typeof call ? self : call;
                }(this, (NodeRendererDefault.__proto__ || Object.getPrototypeOf(NodeRendererDefault)).apply(this, arguments));
            }
            return function(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
            }(NodeRendererDefault, _react.Component), _createClass(NodeRendererDefault, [ {
                key: "render",
                value: function() {
                    var _props = this.props, scaffoldBlockPxWidth = _props.scaffoldBlockPxWidth, toggleChildrenVisibility = _props.toggleChildrenVisibility, connectDragPreview = _props.connectDragPreview, connectDragSource = _props.connectDragSource, isDragging = _props.isDragging, canDrop = _props.canDrop, canDrag = _props.canDrag, node = _props.node, title = _props.title, subtitle = _props.subtitle, draggedNode = _props.draggedNode, path = _props.path, treeIndex = _props.treeIndex, isSearchMatch = _props.isSearchMatch, isSearchFocus = _props.isSearchFocus, buttons = _props.buttons, className = _props.className, style = _props.style, didDrop = _props.didDrop, otherProps = (_props.treeId, 
                    _props.isOver, _props.parentNode, function(obj, keys) {
                        var target = {};
                        for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
                        return target;
                    }(_props, [ "scaffoldBlockPxWidth", "toggleChildrenVisibility", "connectDragPreview", "connectDragSource", "isDragging", "canDrop", "canDrag", "node", "title", "subtitle", "draggedNode", "path", "treeIndex", "isSearchMatch", "isSearchFocus", "buttons", "className", "style", "didDrop", "treeId", "isOver", "parentNode" ])), nodeTitle = title || node.title, nodeSubtitle = subtitle || node.subtitle, handle = void 0;
                    canDrag && (
                    // Show a loading symbol on the handle when the children are expanded
                    //  and yet still defined by a function (a callback to fetch the children)
                    handle = "function" == typeof node.children && node.expanded ? _react2.default.createElement("div", {
                        className: "rst__loadingHandle"
                    }, _react2.default.createElement("div", {
                        className: "rst__loadingCircle"
                    }, [].concat(function(arr) {
                        if (Array.isArray(arr)) {
                            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                            return arr2;
                        }
                        return Array.from(arr);
                    }(new Array(12))).map(function(_, index) {
                        return _react2.default.createElement("div", {
                            // eslint-disable-next-line react/no-array-index-key
                            key: index,
                            className: "rst__loadingCirclePoint"
                        });
                    }))) : connectDragSource(_react2.default.createElement("div", {
                        className: "rst__moveHandle"
                    }), {
                        dropEffect: "copy"
                    }));
                    var isDraggedDescendant = draggedNode && (0, _treeDataUtils.isDescendant)(draggedNode, node), isLandingPadActive = !didDrop && isDragging;
                    return _react2.default.createElement("div", _extends({
                        style: {
                            height: "100%"
                        }
                    }, otherProps), toggleChildrenVisibility && node.children && (node.children.length > 0 || "function" == typeof node.children) && _react2.default.createElement("div", null, _react2.default.createElement("button", {
                        type: "button",
                        "aria-label": node.expanded ? "Collapse" : "Expand",
                        className: node.expanded ? "rst__collapseButton" : "rst__expandButton",
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
                        className: "rst__lineChildren"
                    })), _react2.default.createElement("div", {
                        className: "rst__rowWrapper"
                    }, connectDragPreview(_react2.default.createElement("div", {
                        className: (0, _classnames2.default)("rst__row", isLandingPadActive && "rst__rowLandingPad", isLandingPadActive && !canDrop && "rst__rowCancelPad", isSearchMatch && "rst__rowSearchMatch", isSearchFocus && "rst__rowSearchFocus", className),
                        style: _extends({
                            opacity: isDraggedDescendant ? .5 : 1
                        }, style)
                    }, handle, _react2.default.createElement("div", {
                        className: (0, _classnames2.default)("rst__rowContents", !canDrag && "rst__rowContentsDragDisabled")
                    }, _react2.default.createElement("div", {
                        className: "rst__rowLabel"
                    }, _react2.default.createElement("span", {
                        className: (0, _classnames2.default)("rst__rowTitle", node.subtitle && "rst__rowTitleWithSubtitle")
                    }, "function" == typeof nodeTitle ? nodeTitle({
                        node: node,
                        path: path,
                        treeIndex: treeIndex
                    }) : nodeTitle), nodeSubtitle && _react2.default.createElement("span", {
                        className: "rst__rowSubtitle"
                    }, "function" == typeof nodeSubtitle ? nodeSubtitle({
                        node: node,
                        path: path,
                        treeIndex: treeIndex
                    }) : nodeSubtitle)), _react2.default.createElement("div", {
                        className: "rst__rowToolbar"
                    }, buttons.map(function(btn, index) {
                        return _react2.default.createElement("div", {
                            key: index,
                            className: "rst__toolbarButton"
                        }, btn);
                    })))))));
                }
            } ]), NodeRendererDefault;
        }();
        NodeRendererDefault.defaultProps = {
            isSearchMatch: !1,
            isSearchFocus: !1,
            canDrag: !1,
            toggleChildrenVisibility: null,
            buttons: [],
            className: "",
            style: {},
            parentNode: null,
            draggedNode: null,
            canDrop: !1,
            title: null,
            subtitle: null
        }, NodeRendererDefault.propTypes = {
            node: _propTypes2.default.shape({}).isRequired,
            title: _propTypes2.default.oneOfType([ _propTypes2.default.func, _propTypes2.default.node ]),
            subtitle: _propTypes2.default.oneOfType([ _propTypes2.default.func, _propTypes2.default.node ]),
            path: _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([ _propTypes2.default.string, _propTypes2.default.number ])).isRequired,
            treeIndex: _propTypes2.default.number.isRequired,
            treeId: _propTypes2.default.string.isRequired,
            isSearchMatch: _propTypes2.default.bool,
            isSearchFocus: _propTypes2.default.bool,
            canDrag: _propTypes2.default.bool,
            scaffoldBlockPxWidth: _propTypes2.default.number.isRequired,
            toggleChildrenVisibility: _propTypes2.default.func,
            buttons: _propTypes2.default.arrayOf(_propTypes2.default.node),
            className: _propTypes2.default.string,
            style: _propTypes2.default.shape({}),
            // Drag and drop API functions
            // Drag source
            connectDragPreview: _propTypes2.default.func.isRequired,
            connectDragSource: _propTypes2.default.func.isRequired,
            parentNode: _propTypes2.default.shape({}),
            // Needed for dndManager
            isDragging: _propTypes2.default.bool.isRequired,
            didDrop: _propTypes2.default.bool.isRequired,
            draggedNode: _propTypes2.default.shape({}),
            // Drop target
            isOver: _propTypes2.default.bool.isRequired,
            canDrop: _propTypes2.default.bool
        }, exports.default = NodeRendererDefault;
    }, 
    /* 13 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
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
        }(), _react = __webpack_require__(1), _react2 = _interopRequireDefault(_react), _propTypes2 = _interopRequireDefault(__webpack_require__(2));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        var TreePlaceholder = function(_Component) {
            function TreePlaceholder() {
                return function(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                }(this, TreePlaceholder), function(self, call) {
                    if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                    return !call || "object" != typeof call && "function" != typeof call ? self : call;
                }(this, (TreePlaceholder.__proto__ || Object.getPrototypeOf(TreePlaceholder)).apply(this, arguments));
            }
            return function(subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
                subClass.prototype = Object.create(superClass && superClass.prototype, {
                    constructor: {
                        value: subClass,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass);
            }(TreePlaceholder, _react.Component), _createClass(TreePlaceholder, [ {
                key: "render",
                value: function() {
                    var _props = this.props, children = _props.children, connectDropTarget = _props.connectDropTarget, otherProps = (_props.treeId, 
                    _props.drop, function(obj, keys) {
                        var target = {};
                        for (var i in obj) keys.indexOf(i) >= 0 || Object.prototype.hasOwnProperty.call(obj, i) && (target[i] = obj[i]);
                        return target;
                    }(_props, [ "children", "connectDropTarget", "treeId", "drop" ]));
                    return connectDropTarget(_react2.default.createElement("div", null, _react.Children.map(children, function(child) {
                        return (0, _react.cloneElement)(child, _extends({}, otherProps));
                    })));
                }
            } ]), TreePlaceholder;
        }();
        TreePlaceholder.defaultProps = {
            canDrop: !1,
            draggedNode: null
        }, TreePlaceholder.propTypes = {
            children: _propTypes2.default.node.isRequired,
            // Drop target
            connectDropTarget: _propTypes2.default.func.isRequired,
            isOver: _propTypes2.default.bool.isRequired,
            canDrop: _propTypes2.default.bool,
            draggedNode: _propTypes2.default.shape({}),
            treeId: _propTypes2.default.string.isRequired,
            drop: _propTypes2.default.func.isRequired
        }, exports.default = TreePlaceholder;
    }, 
    /* 14 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var _react2 = _interopRequireDefault(__webpack_require__(1)), _propTypes2 = _interopRequireDefault(__webpack_require__(2)), _classnames2 = _interopRequireDefault(__webpack_require__(3));
        function _interopRequireDefault(obj) {
            return obj && obj.__esModule ? obj : {
                default: obj
            };
        }
        __webpack_require__(29);
        var PlaceholderRendererDefault = function(_ref) {
            var isOver = _ref.isOver, canDrop = _ref.canDrop;
            return _react2.default.createElement("div", {
                className: (0, _classnames2.default)("rst__placeholder", canDrop && "rst__placeholderLandingPad", canDrop && !isOver && "rst__placeholderCancelPad")
            });
        };
        PlaceholderRendererDefault.defaultProps = {
            isOver: !1,
            canDrop: !1
        }, PlaceholderRendererDefault.propTypes = {
            isOver: _propTypes2.default.bool,
            canDrop: _propTypes2.default.bool
        }, exports.default = PlaceholderRendererDefault;
    }, 
    /* 15 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        function _toConsumableArray(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
                return arr2;
            }
            return Array.from(arr);
        }
        /* eslint-disable import/prefer-default-export */        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.slideRows = function(rows, fromIndex, toIndex) {
            var count = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, rowsWithoutMoved = [].concat(_toConsumableArray(rows.slice(0, fromIndex)), _toConsumableArray(rows.slice(fromIndex + count)));
            return [].concat(_toConsumableArray(rowsWithoutMoved.slice(0, toIndex)), _toConsumableArray(rows.slice(fromIndex, fromIndex + count)), _toConsumableArray(rowsWithoutMoved.slice(toIndex)));
        }
        /***/;
    }, 
    /* 16 */
    /***/ function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var obj, _createClass = function() {
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
        }(), _reactDnd = __webpack_require__(17), _reactDndHtml5Backend = __webpack_require__(18), _reactDndHtml5Backend2 = (obj = _reactDndHtml5Backend) && obj.__esModule ? obj : {
            default: obj
        }, _reactDom = __webpack_require__(19), _treeDataUtils = __webpack_require__(0), _memoizedTreeDataUtils = __webpack_require__(5);
        var DndManager = function() {
            function DndManager(treeRef) {
                !function(instance, Constructor) {
                    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
                }(this, DndManager), this.treeRef = treeRef;
            }
            return _createClass(DndManager, [ {
                key: "getTargetDepth",
                value: function(dropTargetProps, monitor, component) {
                    var draggedNode = monitor.getItem().node;
                    if (draggedNode.depth) {
                        var depth = draggedNode.depth;
                        if (void 0 === this.maxDepth || null === this.maxDepth || this.maxDepth >= depth) return depth;
                    }
                    var dropTargetDepth = 0, rowAbove = dropTargetProps.getPrevRow();
                    rowAbove && (
                    // Limit the length of the path to the deepest possible
                    dropTargetDepth = Math.min(rowAbove.path.length, dropTargetProps.path.length));
                    var blocksOffset = void 0, dragSourceInitialDepth = (monitor.getItem().path || []).length;
                    // When adding node from external source
                    if (monitor.getItem().treeId !== this.treeId) if (
                    // Ignore the tree depth of the source, if it had any to begin with
                    dragSourceInitialDepth = 0, component) {
                        var relativePosition = (0, _reactDom.findDOMNode)(component).getBoundingClientRect(), leftShift = monitor.getSourceClientOffset().x - relativePosition.left;
 // eslint-disable-line react/no-find-dom-node
                                                blocksOffset = Math.round(leftShift / dropTargetProps.scaffoldBlockPxWidth);
                    } else blocksOffset = dropTargetProps.path.length; else blocksOffset = Math.round(monitor.getDifferenceFromInitialOffset().x / dropTargetProps.scaffoldBlockPxWidth);
                    var targetDepth = Math.min(dropTargetDepth, Math.max(0, dragSourceInitialDepth + blocksOffset - 1));
                    // If a maxDepth is defined, constrain the target depth
                                        if (void 0 !== this.maxDepth && null !== this.maxDepth) {
                        var _draggedNode = monitor.getItem().node, draggedChildDepth = (0, _treeDataUtils.getDepth)(_draggedNode);
                        targetDepth = Math.max(0, Math.min(targetDepth, this.maxDepth - draggedChildDepth - 1));
                    }
                    return targetDepth;
                }
            }, {
                key: "canDrop",
                value: function(dropTargetProps, monitor) {
                    if (!monitor.isOver()) return !1;
                    var rowAbove = dropTargetProps.getPrevRow(), abovePath = rowAbove ? rowAbove.path : [], aboveNode = rowAbove ? rowAbove.node : {}, targetDepth = this.getTargetDepth(dropTargetProps, monitor, null);
                    // Cannot drop if we're adding to the children of the row above and
                    //  the row above is a function
                    if (targetDepth >= abovePath.length && "function" == typeof aboveNode.children) return !1;
                    if ("function" == typeof this.customCanDrop) {
                        var node = monitor.getItem().node, addedResult = (0, _memoizedTreeDataUtils.memoizedInsertNode)({
                            treeData: this.treeData,
                            newNode: node,
                            depth: targetDepth,
                            getNodeKey: this.getNodeKey,
                            minimumTreeIndex: dropTargetProps.listIndex,
                            expandParent: !0
                        });
                        return this.customCanDrop({
                            node: node,
                            prevPath: monitor.getItem().path,
                            prevParent: monitor.getItem().parentNode,
                            prevTreeIndex: monitor.getItem().treeIndex,
                            // Equals -1 when dragged from external tree
                            nextPath: addedResult.path,
                            nextParent: addedResult.parentNode,
                            nextTreeIndex: addedResult.treeIndex
                        });
                    }
                    return !0;
                }
            }, {
                key: "wrapSource",
                value: function(el) {
                    var _this = this, nodeDragSource = {
                        beginDrag: function(props) {
                            return _this.startDrag(props), {
                                node: props.node,
                                parentNode: props.parentNode,
                                path: props.path,
                                treeIndex: props.treeIndex,
                                treeId: props.treeId
                            };
                        },
                        endDrag: function(props, monitor) {
                            _this.endDrag(monitor.getDropResult());
                        },
                        isDragging: function(props, monitor) {
                            var dropTargetNode = monitor.getItem().node;
                            return props.node === dropTargetNode;
                        }
                    };
                    return (0, _reactDnd.DragSource)(this.dndType, nodeDragSource, function(connect, monitor) {
                        return {
                            connectDragSource: connect.dragSource(),
                            connectDragPreview: connect.dragPreview(),
                            isDragging: monitor.isDragging(),
                            didDrop: monitor.didDrop()
                        };
                    })(el);
                }
            }, {
                key: "wrapTarget",
                value: function(el) {
                    var _this2 = this, nodeDropTarget = {
                        drop: function(dropTargetProps, monitor, component) {
                            var result = {
                                node: monitor.getItem().node,
                                path: monitor.getItem().path,
                                treeIndex: monitor.getItem().treeIndex,
                                treeId: _this2.treeId,
                                minimumTreeIndex: dropTargetProps.treeIndex,
                                depth: _this2.getTargetDepth(dropTargetProps, monitor, component)
                            };
                            return _this2.drop(result), result;
                        },
                        hover: function(dropTargetProps, monitor, component) {
                            var targetDepth = _this2.getTargetDepth(dropTargetProps, monitor, component), draggedNode = monitor.getItem().node;
                            (
                            // Redraw if hovered above different nodes
                            dropTargetProps.node !== draggedNode || 
                            // Or hovered above the same node but at a different depth
                            targetDepth !== dropTargetProps.path.length - 1) && _this2.dragHover({
                                node: draggedNode,
                                path: monitor.getItem().path,
                                minimumTreeIndex: dropTargetProps.listIndex,
                                depth: targetDepth
                            });
                        },
                        canDrop: this.canDrop.bind(this)
                    };
                    return (0, _reactDnd.DropTarget)(this.dndType, nodeDropTarget, function(connect, monitor) {
                        var dragged = monitor.getItem();
                        return {
                            connectDropTarget: connect.dropTarget(),
                            isOver: monitor.isOver(),
                            canDrop: monitor.canDrop(),
                            draggedNode: dragged ? dragged.node : null
                        };
                    })(el);
                }
            }, {
                key: "wrapPlaceholder",
                value: function(el) {
                    var _this3 = this, placeholderDropTarget = {
                        drop: function(dropTargetProps, monitor) {
                            var _monitor$getItem2 = monitor.getItem(), result = {
                                node: _monitor$getItem2.node,
                                path: _monitor$getItem2.path,
                                treeIndex: _monitor$getItem2.treeIndex,
                                treeId: _this3.treeId,
                                minimumTreeIndex: 0,
                                depth: 0
                            };
                            return _this3.drop(result), result;
                        }
                    };
                    return (0, _reactDnd.DropTarget)(this.dndType, placeholderDropTarget, function(connect, monitor) {
                        var dragged = monitor.getItem();
                        return {
                            connectDropTarget: connect.dropTarget(),
                            isOver: monitor.isOver(),
                            canDrop: monitor.canDrop(),
                            draggedNode: dragged ? dragged.node : null
                        };
                    })(el);
                }
            }, {
                key: "startDrag",
                get: function() {
                    return this.treeRef.startDrag;
                }
            }, {
                key: "dragHover",
                get: function() {
                    return this.treeRef.dragHover;
                }
            }, {
                key: "endDrag",
                get: function() {
                    return this.treeRef.endDrag;
                }
            }, {
                key: "drop",
                get: function() {
                    return this.treeRef.drop;
                }
            }, {
                key: "treeId",
                get: function() {
                    return this.treeRef.treeId;
                }
            }, {
                key: "dndType",
                get: function() {
                    return this.treeRef.dndType;
                }
            }, {
                key: "treeData",
                get: function() {
                    return this.treeRef.state.draggingTreeData || this.treeRef.props.treeData;
                }
            }, {
                key: "getNodeKey",
                get: function() {
                    return this.treeRef.props.getNodeKey;
                }
            }, {
                key: "customCanDrop",
                get: function() {
                    return this.treeRef.props.canDrop;
                }
            }, {
                key: "maxDepth",
                get: function() {
                    return this.treeRef.props.maxDepth;
                }
            } ], [ {
                key: "wrapRoot",
                value: function(el) {
                    return (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(el);
                }
            } ]), DndManager;
        }();
        exports.default = DndManager;
    }, 
    /* 17 */
    /***/ function(module, exports) {
        module.exports = require("react-dnd");
        /***/    }, 
    /* 18 */
    /***/ function(module, exports) {
        module.exports = require("react-dnd-html5-backend");
        /***/    }, 
    /* 19 */
    /***/ function(module, exports) {
        module.exports = require("react-dom");
        /***/    }, 
    /* 20 */
    /***/ function(module, exports) {
        // removed by extract-text-webpack-plugin
        /***/}, 
    /* 21 */ 
    /* 22 */ , 
    /* 23 */ , 
    /* 24 */ , 
    /* 25 */
    /***/ , 
    /* 25 */
    /***/ function(module, exports) {
        // removed by extract-text-webpack-plugin
        /***/}, 
    /* 26 */ 
    /* 27 */
    /***/ , 
    /* 27 */
    /***/ function(module, exports) {
        // removed by extract-text-webpack-plugin
        /***/}, 
    /* 28 */ 
    /* 29 */
    /***/ , 
    /* 29 */
    /***/ function(module, exports) {
        // removed by extract-text-webpack-plugin
        /***/}, 
    /* 30 */ 
    /* 31 */
    /***/ , 
    /* 31 */
    /***/ function(module, exports) {
        // removed by extract-text-webpack-plugin
        /***/}
    /******/ ]);
});