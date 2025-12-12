import { Edge, Cell } from '../types/puzzle';

/**
 * 2つのセルが同じかどうかを判定
 */
export const isSameCell = (a: Cell, b: Cell): boolean => {
  return a.x === b.x && a.y === b.y;
};

/**
 * 2つの辺が同じかどうかを判定（順序に依存しない）
 * 例: [(1,2), (3,4)] と [(3,4), (1,2)] は同じ辺として扱う
 */
export const isSameEdge = (edge1: Edge, edge2: Edge): boolean => {
  // edge1の最初のセルがedge2のどちらかのセルと一致し、
  // edge1の2番目のセルがedge2の残りのセルと一致する場合
  return (
    (isSameCell(edge1[0], edge2[0]) && isSameCell(edge1[1], edge2[1])) ||
    (isSameCell(edge1[0], edge2[1]) && isSameCell(edge1[1], edge2[0]))
  );
};

/**
 * 辺のリストに特定の辺が含まれているかチェック
 */
export const containsEdge = (edges: Edge[], targetEdge: Edge): boolean => {
  return edges.some(edge => isSameEdge(edge, targetEdge));
};

/**
 * 2つの辺のリストが同じかどうかを判定（順序に依存しない）
 */
export const isSameEdgeSet = (edges1: Edge[], edges2: Edge[]): boolean => {
  if (edges1.length !== edges2.length) {
    return false;
  }

  // edges1のすべての辺がedges2に含まれているかチェック
  return edges1.every(edge1 => containsEdge(edges2, edge1));
};

/**
 * セルが隣接しているかどうかを判定（上下左右）
 */
export const areAdjacent = (cell1: Cell, cell2: Cell): boolean => {
  const dx = Math.abs(cell1.x - cell2.x);
  const dy = Math.abs(cell1.y - cell2.y);

  // 上下左右の隣接（斜めは含まない）
  return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
};

/**
 * 特定のセルに接続されている辺を取得
 */
export const getConnectedEdges = (edges: Edge[], cell: Cell): Edge[] => {
  return edges.filter(edge =>
    isSameCell(edge[0], cell) || isSameCell(edge[1], cell)
  );
};

/**
 * 辺からもう一方のセルを取得
 */
export const getOtherCell = (edge: Edge, cell: Cell): Cell | null => {
  if (isSameCell(edge[0], cell)) {
    return edge[1];
  } else if (isSameCell(edge[1], cell)) {
    return edge[0];
  }
  return null;
};