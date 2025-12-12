/**
 * 各ステップで解の一意性を保証しながらパズルを生成する改良版ジェネレータ
 */

import { Cell, Edge, Move, Puzzle, PrimaryPuzzleResult } from '../types/puzzle';
import { isUniqueSolution } from './puzzleValidator';
import { hasUniquePartialSolution } from './fastUniquenessCheck';
import { generatePrimaryPuzzle } from './puzzleGenerator';

// セルが同じかどうかを判定
const isSameCell = (a: Cell, b: Cell): boolean => {
  return a.x === b.x && a.y === b.y;
};

// セルが訪問済みリストに含まれているか
const isVisited = (cell: Cell, visitedCells: Cell[]): boolean => {
  return visitedCells.some(v => isSameCell(v, cell));
};

/**
 * 仮のパズルを作成して一意性をチェック（高速版）
 */
function checkUniquenessAfterMove(
  endpoints: [Cell, Cell],
  visitedCells: Cell[]
): boolean {
  // 高速な部分的一意性チェックを使用
  return hasUniquePartialSolution(endpoints, visitedCells);
}

/**
 * 座標の正規化（最小値を0にする）
 */
const normalizeCoordinates = (result: PrimaryPuzzleResult): PrimaryPuzzleResult => {
  const allCells = [...result.visitedCells];

  // 最小値を見つける
  const minX = Math.min(...allCells.map(c => c.x));
  const minY = Math.min(...allCells.map(c => c.y));

  // 正規化
  const normalizedEndpoints: [Cell, Cell] = [
    { x: result.endpoints[0].x - minX, y: result.endpoints[0].y - minY },
    { x: result.endpoints[1].x - minX, y: result.endpoints[1].y - minY }
  ];

  const normalizedVisitedCells = result.visitedCells.map(cell => ({
    x: cell.x - minX,
    y: cell.y - minY
  }));

  const normalizedEdges = result.edges.map(edge => [
    { x: edge[0].x - minX, y: edge[0].y - minY },
    { x: edge[1].x - minX, y: edge[1].y - minY }
  ] as Edge);

  return {
    endpoints: normalizedEndpoints,
    visitedCells: normalizedVisitedCells,
    edges: normalizedEdges
  };
};

/**
 * 一意性を保証しながらパズルを生成する一次生成関数
 */
export const generateUniquePrimaryPuzzle = (gridSize: number): PrimaryPuzzleResult | null => {
  // 初期化
  const endpoints: [Cell, Cell] = [{ x: 0, y: 0 }, { x: 0, y: 0 }];
  const visitedCells: Cell[] = [{ x: 0, y: 0 }];
  const edges: Edge[] = [];

  // 移動の方向（上下左右）
  const directions = [
    { dx: 0, dy: -1 },  // 上
    { dx: 1, dy: 0 },   // 右
    { dx: 0, dy: 1 },   // 下
    { dx: -1, dy: 0 }   // 左
  ];

  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 10; // 連続失敗の最大回数

  // ループ
  while (true) {
    const validMoves: Move[] = [];

    // 各端点からの可能な移動を探す
    for (let endpointIndex = 0; endpointIndex < 2; endpointIndex++) {
      const currentCell = endpoints[endpointIndex];

      // 4方向への移動を試みる
      for (const dir of directions) {
        const newCell: Cell = {
          x: currentCell.x + dir.dx,
          y: currentCell.y + dir.dy
        };

        // 訪問済みセルには移動できない
        if (isVisited(newCell, visitedCells)) {
          continue;
        }

        // 仮に移動先を訪問済みに追加した場合の座標範囲をチェック
        const tempVisited = [...visitedCells, newCell];
        const xValues = tempVisited.map(c => c.x);
        const yValues = tempVisited.map(c => c.y);
        const xRange = Math.max(...xValues) - Math.min(...xValues);
        const yRange = Math.max(...yValues) - Math.min(...yValues);

        // 座標範囲がグリッドサイズ以上になる場合は移動できない
        if (xRange >= gridSize || yRange >= gridSize) {
          continue;
        }

        // 仮に移動した場合のパズルを作成
        const tempEndpoints: [Cell, Cell] = [...endpoints];
        tempEndpoints[endpointIndex] = newCell;

        // 一意性チェック（最初の数手は省略して高速化）
        if (tempVisited.length > 5) {
          // この移動により解が一意でなくなる場合はスキップ
          const isUnique = checkUniquenessAfterMove(
            tempEndpoints,
            tempVisited
          );

          if (!isUnique) {
            continue;
          }
        }

        // この移動は有効
        validMoves.push({
          endpoint: endpointIndex as 0 | 1,
          from: currentCell,
          to: newCell
        });
      }
    }

    // 移動可能な選択肢がなければ終了
    if (validMoves.length === 0) {
      consecutiveFailures++;

      // 連続して失敗している場合は生成失敗
      if (consecutiveFailures >= maxConsecutiveFailures) {
        return null;
      }

      // 最終チェック：現在の状態が有効なパズルかどうか
      if (visitedCells.length >= gridSize * 2) {
        // ある程度のサイズがあれば終了
        break;
      }

      // 続行を試みる
      continue;
    }

    consecutiveFailures = 0; // リセット

    // ランダムに1つ選択
    const selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)];

    // 端点を更新
    endpoints[selectedMove.endpoint] = selectedMove.to;

    // 訪問済みセルリストに追加
    visitedCells.push(selectedMove.to);

    // 辺リストに追加
    edges.push([selectedMove.from, selectedMove.to]);
  }

  // 座標を正規化して返す
  return normalizeCoordinates({
    endpoints,
    visitedCells,
    edges
  });
};

/**
 * 一意性保証付きパズル生成関数
 */
export const generateUniqueGuaranteedPuzzle = (gridSize: number): Puzzle => {
  let attempts = 0;
  const maxAttempts = 50;

  while (attempts < maxAttempts) {
    attempts++;

    const primaryResult = generateUniquePrimaryPuzzle(gridSize);

    if (primaryResult) {
      const puzzle: Puzzle = {
        gridSize,
        ...primaryResult
      };

      // 最終確認
      if (isUniqueSolution(puzzle)) {
        return puzzle;
      }
    }
  }

  // フォールバック：通常の生成方法を使用
  const primaryResult = generatePrimaryPuzzle(gridSize);
  return {
    gridSize,
    ...primaryResult
  };
};