import React from 'react';

interface ClearButtonProps {
  onClear: () => void;
}

const ClearButton: React.FC<ClearButtonProps> = ({ onClear }) => {
  return (
    <button
      className="clear-button"
      onClick={onClear}
    >
      クリア
    </button>
  );
};

export default ClearButton;