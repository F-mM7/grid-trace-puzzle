// セルの座標を表す型
export interface Cell {
  x: number;
  y: number;
}

// セル間の辺を表す型
// 2つのセルを配列で持つ（順序は関係ない）
export type Edge = [Cell, Cell];

// 移動情報を表す型
export interface Move {
  endpoint: 0 | 1;  // どちらの端点からの移動か
  from: Cell;
  to: Cell;
}

// パズル全体のデータ構造
export interface Puzzle {
  gridSize: number;           // グリッドのサイズ (N x N)
  endpoints: [Cell, Cell];    // 端点セルのリスト（2つ）
  visitedCells: Cell[];       // 訪問済みセルのリスト
  edges: Edge[];              // セル間の辺のリスト
}

// 一次生成関数の結果
export interface PrimaryPuzzleResult {
  endpoints: [Cell, Cell];
  visitedCells: Cell[];
  edges: Edge[];
}