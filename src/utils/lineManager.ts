import { Cell, Edge, Puzzle } from '../types/puzzle';
import { isSameCell, getConnectedEdges, containsEdge } from './edgeUtils';

/**
 * セルから描画可能な線を追加する
 *
 * @param cells 通過したセルのリスト
 * @param existingLines 既存の線のリスト
 * @param puzzle パズルデータ
 * @returns 新しい線のリスト
 */
export const addLinesFromCells = (
  cells: Cell[],
  existingLines: Edge[],
  puzzle: Puzzle
): Edge[] => {
  const newLines = [...existingLines];

  // 隣接するセルのペアごとに処理
  for (let i = 0; i < cells.length - 1; i++) {
    const cell1 = cells[i];
    const cell2 = cells[i + 1];

    // 新しい辺を作成
    const newEdge: Edge = [cell1, cell2];

    // すでに同じ線が存在する場合はスキップ
    if (containsEdge(newLines, newEdge)) {
      continue;
    }

    // 各セルの接続数をチェック
    const cell1Connections = getConnectedEdges(newLines, cell1);
    const cell2Connections = getConnectedEdges(newLines, cell2);

    // 端点かどうかチェック
    const isCell1Endpoint = puzzle.endpoints.some(ep => isSameCell(ep, cell1));
    const isCell2Endpoint = puzzle.endpoints.some(ep => isSameCell(ep, cell2));

    // 接続制限をチェック
    // 端点は1本まで、通常セルは2本まで
    const cell1MaxConnections = isCell1Endpoint ? 1 : 2;
    const cell2MaxConnections = isCell2Endpoint ? 1 : 2;

    if (cell1Connections.length >= cell1MaxConnections ||
        cell2Connections.length >= cell2MaxConnections) {
      continue;
    }

    // 線を追加
    newLines.push(newEdge);
  }

  return newLines;
};

/**
 * クリックされたセルに接続されている線を削除する
 *
 * @param clickedCell クリックされたセル
 * @param existingLines 既存の線のリスト
 * @returns 新しい線のリスト
 */
export const removeLinesFromCell = (
  clickedCell: Cell,
  existingLines: Edge[]
): Edge[] => {
  // クリックされたセルに接続されていない線のみを残す
  return existingLines.filter(edge =>
    !isSameCell(edge[0], clickedCell) && !isSameCell(edge[1], clickedCell)
  );
};

/**
 * セルが線描画可能かチェック
 *
 * @param cell チェックするセル
 * @param puzzle パズルデータ
 * @returns 線描画可能な場合true
 */
export const isValidCell = (cell: Cell, puzzle: Puzzle): boolean => {
  return puzzle.visitedCells.some(visited => isSameCell(visited, cell));
};