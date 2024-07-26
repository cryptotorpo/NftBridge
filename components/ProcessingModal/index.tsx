import React, { useRef, useEffect } from 'react';
import Spinner from '../Spinner'; 

interface ModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[black]/60 z-50">
      <div ref={modalRef} className="flex flex-col items-center justify-around py-6 px-6 bg-[#FFFFFF] dark:bg-[#272727] p-3 rounded lg:rounded-md text-center relative w-[480px] h-[260px]">        
        <div>
          <div className="text-xl font-bold mb-4">{title}</div>
          <div className="text-[#363636] dark:text-white text-sm mb-5">{content}</div>
        </div>
        <Spinner />
      </div>
    </div>
  );
};

export default Modal;
