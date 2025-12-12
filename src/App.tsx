import { useEffect, useState } from 'react';
import './App.css';
import { generateUniqueGuaranteedPuzzle } from './utils/puzzleGeneratorUnique';
import { Puzzle, Edge, Cell } from './types/puzzle';
import SizeSelector from './components/SizeSelector';
import PuzzleGrid from './components/PuzzleGrid';
import ClearButton from './components/ClearButton';
import SuccessModal from './components/SuccessModal';
import { useDragHandler } from './hooks/useDragHandler';
import { useClickHandler } from './hooks/useClickHandler';
import { addLinesFromCells, removeLinesFromCell } from './utils/lineManager';
import { checkSolution } from './utils/solutionChecker';

function App() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [gridSize, setGridSize] = useState<number>(7);
  const [loading, setLoading] = useState(true);
  const [drawnLines, setDrawnLines] = useState<Edge[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // パズル生成
  const generateNewPuzzle = (size: number) => {
    setLoading(true);
    setDrawnLines([]); // 線をクリア

    // 非同期処理として実行
    setTimeout(() => {
      try {
        const newPuzzle = generateUniqueGuaranteedPuzzle(size);
        setPuzzle(newPuzzle);
      } catch (error) {
        console.error('Error generating puzzle:', error);
      } finally {
        setLoading(false);
      }
    }, 0);
  };

  // 初期パズル生成
  useEffect(() => {
    generateNewPuzzle(gridSize);
  }, []);

  // 正解チェック
  useEffect(() => {
    if (puzzle && drawnLines.length > 0) {
      if (checkSolution(drawnLines, puzzle)) {
        setShowSuccess(true);
      }
    }
  }, [drawnLines, puzzle]);

  // ドラッグハンドラー
  const { handleDragStart, handleDragMove, handleDragEnd } = useDragHandler({
    onCellsTraversed: (cells: Cell[]) => {
      if (puzzle) {
        // リアルタイムで線を追加（ドラッグ中に即座に確定）
        const newLines = addLinesFromCells(cells, drawnLines, puzzle);
        setDrawnLines(newLines);
      }
    }
  });

  // クリックハンドラー
  const { handleCellClick } = useClickHandler({
    onCellClick: (cell: Cell) => {
      const newLines = removeLinesFromCell(cell, drawnLines);
      setDrawnLines(newLines);
    }
  });

  // サイズ変更時の処理
  const handleSizeChange = (newSize: number) => {
    setGridSize(newSize);
    generateNewPuzzle(newSize);
  };

  // 線をクリアする処理
  const handleClear = () => {
    setDrawnLines([]);
  };

  // 成功モーダルを閉じて新しいパズルを生成
  const handleSuccessClose = () => {
    setShowSuccess(false);
    // 即座に新しいパズルを生成
    generateNewPuzzle(gridSize);
  };

  return (
    <div className="app">
      <h1>grid-trace-puzzle</h1>

      <div className="controls">
        <SizeSelector
          gridSize={gridSize}
          onSizeChange={handleSizeChange}
        />
        <ClearButton onClear={handleClear} />
      </div>

      {loading ? (
        <div className="loading">パズルを生成中...</div>
      ) : puzzle ? (
        <div className="game-area">
          <PuzzleGrid
            puzzle={puzzle}
            drawnLines={drawnLines}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onClick={handleCellClick}
          />
        </div>
      ) : (
        <div className="error">パズルの生成に失敗しました</div>
      )}

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
      />
    </div>
  )
}

export default App