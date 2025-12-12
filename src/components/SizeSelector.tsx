import React, { useState, useEffect } from 'react';

interface SizeSelectorProps {
  gridSize: number;
  onSizeChange: (size: number) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ gridSize, onSizeChange }) => {
  // ローカル状態: スライダーの表示値を管理
  const [localValue, setLocalValue] = useState(gridSize);

  // propsのgridSizeが変更された場合、ローカル値も同期
  useEffect(() => {
    setLocalValue(gridSize);
  }, [gridSize]);

  // スライダー操作完了時の処理
  const handleChangeComplete = () => {
    if (localValue !== gridSize) {
      onSizeChange(localValue);
    }
  };

  return (
    <div className="size-selector">
      <label htmlFor="grid-size">
        最大サイズ: {localValue} × {localValue}
      </label>
      <input
        id="grid-size"
        type="range"
        min={4}
        max={12}
        value={localValue}
        onChange={(e) => setLocalValue(parseInt(e.target.value, 10))}
        onMouseUp={handleChangeComplete}
        onTouchEnd={handleChangeComplete}
      />
    </div>
  );
};

export default SizeSelector;