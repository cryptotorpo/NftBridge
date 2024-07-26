import React from 'react';
import { useTheme } from 'next-themes';


const Spinner = () => {
  const { theme } = useTheme();
  
  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        borderRadius: '50%'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 'inherit',
          background: 'conic-gradient(from 180deg at 50% 50%, #FECE00 0deg, rgba(254, 206, 0, 0) 360deg)',
          animation: 'spin 1.5s infinite linear'
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          width: '65%',
          height: '65%',
          backgroundColor: theme === 'dark' ? '#272727' : '#FFFFFF',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '100%'
        }}
      ></div>
    </div>
  );
};

export default Spinner;
