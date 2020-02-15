export type Path = string[];
export type TreeNode = {
  nodeId: string;
  children?: TreeNode[] | Function;
  expanded?: boolean;
};
export type TreeData = TreeNode[];
