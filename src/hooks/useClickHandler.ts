import { useCallback } from 'react';
import { Cell } from '../types/puzzle';

interface UseClickHandlerProps {
  onCellClick: (cell: Cell) => void;
}

export const useClickHandler = ({ onCellClick }: UseClickHandlerProps) => {
  // セルの座標を取得
  const getCellFromElement = (element: HTMLElement): Cell | null => {
    const x = parseInt(element.dataset.x || '-1');
    const y = parseInt(element.dataset.y || '-1');

    if (x >= 0 && y >= 0) {
      return { x, y };
    }
    return null;
  };

  // クリック処理
  const handleCellClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // grid-cellをクリックしたか確認
    if (!target.classList.contains('grid-cell')) return;

    // 訪問済みセルかチェック
    if (!target.classList.contains('visited')) return;

    const cell = getCellFromElement(target);
    if (!cell) return;

    // セルクリックを通知
    onCellClick(cell);
  }, [onCellClick]);

  return {
    handleCellClick
  };
};