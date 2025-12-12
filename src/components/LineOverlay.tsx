import React from 'react';
import { Edge } from '../types/puzzle';

interface LineOverlayProps {
  drawnLines: Edge[];
  cellSize: number;
  gridWidth: number;
  gridHeight: number;
}

const LineOverlay: React.FC<LineOverlayProps> = ({
  drawnLines,
  cellSize,
  gridWidth,
  gridHeight
}) => {
  // セル座標からSVG座標への変換
  // グリッドのgap(2px)とpadding(2px)を考慮
  const gap = 2;
  const padding = 2;

  const getCellCenter = (x: number, y: number) => {
    return {
      x: padding + x * (cellSize + gap) + cellSize / 2,
      y: padding + y * (cellSize + gap) + cellSize / 2,
    };
  };

  // SVGのサイズ（padding + セル + gap）
  const svgWidth = padding * 2 + gridWidth * cellSize + (gridWidth - 1) * gap;
  const svgHeight = padding * 2 + gridHeight * cellSize + (gridHeight - 1) * gap;

  return (
    <svg
      className="line-overlay"
      width={svgWidth}
      height={svgHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      {drawnLines.map((edge, index) => {
        const start = getCellCenter(edge[0].x, edge[0].y);
        const end = getCellCenter(edge[1].x, edge[1].y);

        return (
          <line
            key={index}
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#4A90E2"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

export default LineOverlay;