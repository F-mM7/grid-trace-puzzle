import React from 'react';
import { Puzzle, Edge } from '../types/puzzle';
import LineOverlay from './LineOverlay';

interface PuzzleGridProps {
  puzzle: Puzzle;
  drawnLines: Edge[];
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: () => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
  onClick: (e: React.MouseEvent) => void;
}

const PuzzleGrid: React.FC<PuzzleGridProps> = ({
  puzzle,
  drawnLines,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onClick
}) => {
  // グリッドサイズを計算（訪問済みセルの最大座標から）
  const maxX = Math.max(...puzzle.visitedCells.map(c => c.x));
  const maxY = Math.max(...puzzle.visitedCells.map(c => c.y));
  const gridWidth = maxX + 1;
  const gridHeight = maxY + 1;
  const cellSize = 60;

  // セルが訪問済みかどうかをチェック
  const isVisited = (x: number, y: number): boolean => {
    return puzzle.visitedCells.some(cell => cell.x === x && cell.y === y);
  };

  // セルが端点かどうかをチェック
  const isEndpoint = (x: number, y: number): boolean => {
    return puzzle.endpoints.some(ep => ep.x === x && ep.y === y);
  };

  // グリッドセルをレンダリング
  const renderCell = (x: number, y: number) => {
    const visited = isVisited(x, y);
    const endpoint = isEndpoint(x, y);

    let className = 'grid-cell';
    if (visited) {
      className += ' visited';
      if (endpoint) {
        className += ' endpoint';
      }
    } else {
      className += ' unvisited';
    }

    return (
      <div
        key={`${x}-${y}`}
        className={className}
        data-x={x}
        data-y={y}
      >
        {endpoint && <div className="endpoint-dot" />}
      </div>
    );
  };

  return (
    <div className="puzzle-container">
      <div
        className="puzzle-grid"
        style={{
          gridTemplateColumns: `repeat(${gridWidth}, 1fr)`,
          gridTemplateRows: `repeat(${gridHeight}, 1fr)`,
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
      >
        {Array.from({ length: gridHeight }, (_, y) =>
          Array.from({ length: gridWidth }, (_, x) =>
            renderCell(x, y)
          )
        )}
      </div>
      <LineOverlay
        drawnLines={drawnLines}
        cellSize={cellSize}
        gridWidth={gridWidth}
        gridHeight={gridHeight}
      />
    </div>
  );
};

export default PuzzleGrid;