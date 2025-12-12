import { useState, useRef, useCallback } from 'react';
import { Cell } from '../types/puzzle';

interface UseDragHandlerProps {
  onCellsTraversed: (cells: Cell[]) => void;
}

export const useDragHandler = ({ onCellsTraversed }: UseDragHandlerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const traversedCells = useRef<Cell[]>([]);
  const lastCell = useRef<Cell | null>(null);

  // セルの座標を取得
  const getCellFromElement = (element: HTMLElement): Cell | null => {
    const x = parseInt(element.dataset.x || '-1');
    const y = parseInt(element.dataset.y || '-1');

    if (x >= 0 && y >= 0) {
      return { x, y };
    }
    return null;
  };

  // ドラッグ開始
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('grid-cell')) return;
    if (!target.classList.contains('visited')) return;

    const cell = getCellFromElement(target);
    if (!cell) return;

    setIsDragging(true);
    traversedCells.current = [cell];
    lastCell.current = cell;

    // タッチイベントの場合、デフォルトの動作を防ぐ
    e.preventDefault();
  }, []);

  // ドラッグ中
  const handleDragMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    // 座標を取得
    let clientX: number, clientY: number;
    if ('touches' in e) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // 座標から要素を取得
    const element = document.elementFromPoint(clientX, clientY) as HTMLElement;
    if (!element || !element.classList.contains('grid-cell')) return;
    if (!element.classList.contains('visited')) return;

    const cell = getCellFromElement(element);
    if (!cell) return;

    // 前のセルと同じ場合はスキップ
    if (lastCell.current &&
        lastCell.current.x === cell.x &&
        lastCell.current.y === cell.y) {
      return;
    }

    // 隣接セルかチェック
    if (lastCell.current) {
      const dx = Math.abs(cell.x - lastCell.current.x);
      const dy = Math.abs(cell.y - lastCell.current.y);

      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        traversedCells.current.push(cell);
        lastCell.current = cell;

        // リアルタイムで通過したセルを通知（即座に線を追加）
        onCellsTraversed([...traversedCells.current]);
      }
    }
  }, [isDragging, onCellsTraversed]);

  // ドラッグ終了
  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);

    // クリア
    traversedCells.current = [];
    lastCell.current = null;
  }, [isDragging]);

  return {
    isDragging,
    handleDragStart,
    handleDragMove,
    handleDragEnd
  };
};