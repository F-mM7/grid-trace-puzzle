import { Edge, Puzzle } from '../types/puzzle';
import { isSameEdgeSet } from './edgeUtils';

/**
 * 描画された線がパズルの解答と一致するか判定
 *
 * @param drawnLines 描画された線のリスト
 * @param puzzle パズルデータ
 * @returns 正解の場合true
 */
export const checkSolution = (drawnLines: Edge[], puzzle: Puzzle): boolean => {
  // 線の数が一致しているかチェック
  if (drawnLines.length !== puzzle.edges.length) {
    return false;
  }

  // すべての線が一致しているかチェック（順序は関係ない）
  return isSameEdgeSet(drawnLines, puzzle.edges);
};