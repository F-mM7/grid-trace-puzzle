import { Puzzle, Cell } from '../types/puzzle';

/**
 * セルの隣接リストを構築
 * @param visitedCells 訪問済みセルのリスト
 * @returns 隣接リスト（キーはセルの文字列表現、値は隣接セルの配列）
 */
function buildAdjacencyList(visitedCells: Cell[]): Map<string, Cell[]> {
  const adjacencyList = new Map<string, Cell[]>();
  const cellSet = new Set(visitedCells.map(cell => `${cell.x},${cell.y}`));

  for (const cell of visitedCells) {
    const key = `${cell.x},${cell.y}`;
    const neighbors: Cell[] = [];

    // 上下左右の隣接セルをチェック
    const directions = [
      { dx: 0, dy: -1 }, // 上
      { dx: 0, dy: 1 },  // 下
      { dx: -1, dy: 0 }, // 左
      { dx: 1, dy: 0 }   // 右
    ];

    for (const { dx, dy } of directions) {
      const neighborX = cell.x + dx;
      const neighborY = cell.y + dy;
      const neighborKey = `${neighborX},${neighborY}`;

      if (cellSet.has(neighborKey)) {
        neighbors.push({ x: neighborX, y: neighborY });
      }
    }

    adjacencyList.set(key, neighbors);
  }

  return adjacencyList;
}

/**
 * 深さ優先探索で全ての経路を列挙
 * @param start 開始セル
 * @param end 終了セル
 * @param visitedCells 訪問済みセルのリスト
 * @param adjacencyList 隣接リスト
 * @returns 全ての有効な経路の数
 */
function countAllPaths(
  start: Cell,
  end: Cell,
  visitedCells: Cell[],
  adjacencyList: Map<string, Cell[]>
): number {
  const totalCells = visitedCells.length;
  let pathCount = 0;

  // DFSのヘルパー関数
  function dfs(
    current: Cell,
    visited: Set<string>
  ): void {
    const currentKey = `${current.x},${current.y}`;

    // 終点に到達し、全てのセルを訪問した場合
    if (current.x === end.x && current.y === end.y && visited.size === totalCells) {
      pathCount++;
      return;
    }

    // 隣接セルを探索
    const neighbors = adjacencyList.get(currentKey) || [];
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;

      // 未訪問のセルの場合
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        dfs(neighbor, visited);
        // バックトラック
        visited.delete(neighborKey);
      }
    }
  }

  // 開始点から探索開始
  const startKey = `${start.x},${start.y}`;
  const visited = new Set<string>([startKey]);
  dfs(start, visited);

  return pathCount;
}

/**
 * パズルの解が一意かどうかを検証する
 *
 * @param puzzle 検証するパズル
 * @returns 解が一意の場合true、複数解がある場合false
 */
export const isUniqueSolution = (puzzle: Puzzle): boolean => {
  // エラーチェック
  if (puzzle.endpoints.length !== 2) {
    console.error('端点は2つである必要があります');
    return false;
  }

  if (puzzle.visitedCells.length === 0) {
    console.error('訪問済みセルが空です');
    return false;
  }

  // 隣接リストを構築
  const adjacencyList = buildAdjacencyList(puzzle.visitedCells);

  // 全ての経路を数える
  const pathCount = countAllPaths(
    puzzle.endpoints[0],
    puzzle.endpoints[1],
    puzzle.visitedCells,
    adjacencyList
  );

  // 解が1つだけの場合、一意
  return pathCount === 1;
};

/**
 * パズルが有効かどうかを検証する
 * （将来的に追加の検証ロジックを実装する場合に使用）
 *
 * @param puzzle 検証するパズル
 * @returns パズルが有効な場合true
 */
export const isValidPuzzle = (puzzle: Puzzle): boolean => {
  // 基本的な検証
  if (!puzzle || !puzzle.endpoints || !puzzle.visitedCells || !puzzle.edges) {
    return false;
  }

  // 端点が2つあることを確認
  if (puzzle.endpoints.length !== 2) {
    return false;
  }

  // 訪問済みセルが少なくとも1つあることを確認
  if (puzzle.visitedCells.length < 1) {
    return false;
  }

  // グリッドサイズが有効な範囲内か確認
  if (puzzle.gridSize < 4 || puzzle.gridSize > 10) {
    return false;
  }

  return true;
};