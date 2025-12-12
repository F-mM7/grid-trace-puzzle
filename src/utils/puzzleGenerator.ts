import { Cell, Edge, Move, PrimaryPuzzleResult } from '../types/puzzle';

// セルが同じかどうかを判定
const isSameCell = (a: Cell, b: Cell): boolean => {
  return a.x === b.x && a.y === b.y;
};

// セルが訪問済みリストに含まれているか
const isVisited = (cell: Cell, visitedCells: Cell[]): boolean => {
  return visitedCells.some(v => isSameCell(v, cell));
};

// 座標の正規化（最小値を0にする）
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

// 一次生成関数
export const generatePrimaryPuzzle = (gridSize: number): PrimaryPuzzleResult => {
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

  // ループ
  while (true) {
    const possibleMoves: Move[] = [];

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

        // この移動は可能
        possibleMoves.push({
          endpoint: endpointIndex as 0 | 1,
          from: currentCell,
          to: newCell
        });
      }
    }

    // 移動可能な選択肢がなければ終了
    if (possibleMoves.length === 0) {
      break;
    }

    // ランダムに1つ選択
    const selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    // 端点を更新
    endpoints[selectedMove.endpoint] = selectedMove.to;

    // 訪問済みセルリストに追加
    visitedCells.push(selectedMove.to);

    // 辺リストに追加（順序は関係ない配列として保存）
    edges.push([selectedMove.from, selectedMove.to]);
  }

  // 座標を正規化して返す
  return normalizeCoordinates({
    endpoints,
    visitedCells,
    edges
  });
};

