import React, { useEffect } from 'react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  // モーダルが開いたら短時間で自動で閉じる（新しいパズル生成を即座に開始）
  useEffect(() => {
    if (isOpen) {
      // 0.5秒だけ表示してすぐに閉じる
      const timer = setTimeout(() => {
        onClose();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay">
      <div className="success-modal">
        <div className="success-icon">✨</div>
        <h2>正解！</h2>
        <p>お見事です！新しいパズルを生成します...</p>
      </div>
    </div>
  );
};

export default SuccessModal;