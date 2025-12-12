/**
 * 高速な一意性チェックのためのユーティリティ
 * パズル生成中の部分的な状態で使用
 */

import { Cell } from '../types/puzzle';

/**
 * 部分的なパズルの解の数を高速にカウント
 * @param endpoints 端点（2つ）
 * @param visitedCells 訪問済みセル
 * @returns 解の数（早期終了のため2以上は区別しない）
 */
export function countPartialPaths(
  endpoints: [Cell, Cell],
  visitedCells: Cell[]
): number {
  // 隣接リストを構築
  const adjacencyMap = new Map<string, string[]>();
  const cellSet = new Set(visitedCells.map(c => `${c.x},${c.y}`));

  for (const cell of visitedCells) {
    const key = `${cell.x},${cell.y}`;
    const neighbors: string[] = [];

    // 4方向をチェック
    const directions = [
      [0, -1], [1, 0], [0, 1], [-1, 0]
    ];

    for (const [dx, dy] of directions) {
      const neighborKey = `${cell.x + dx},${cell.y + dy}`;
      if (cellSet.has(neighborKey)) {
        neighbors.push(neighborKey);
      }
    }

    adjacencyMap.set(key, neighbors);
  }

  const totalCells = visitedCells.length;
  let pathCount = 0;
  const startKey = `${endpoints[0].x},${endpoints[0].y}`;
  const endKey = `${endpoints[1].x},${endpoints[1].y}`;

  // DFS with early termination
  function dfs(current: string, visited: Set<string>): void {
    // 2つ以上の解が見つかったら早期終了
    if (pathCount >= 2) return;

    // 終点に到達し、全セルを訪問した場合
    if (current === endKey && visited.size === totalCells) {
      pathCount++;
      return;
    }

    const neighbors = adjacencyMap.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        dfs(neighbor, visited);
        visited.delete(neighbor);
      }
    }
  }

  const visited = new Set<string>([startKey]);
  dfs(startKey, visited);

  return pathCount;
}

/**
 * 部分的なパズルが一意解を持つかを高速にチェック
 * @param endpoints 端点
 * @param visitedCells 訪問済みセル
 * @returns 一意解の場合true
 */
export function hasUniquePartialSolution(
  endpoints: [Cell, Cell],
  visitedCells: Cell[]
): boolean {
  const pathCount = countPartialPaths(endpoints, visitedCells);
  return pathCount === 1;
}

