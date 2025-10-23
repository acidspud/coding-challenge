import React from 'react';
import spinner from '../assets/images/spin.gif';

function Loading() {
  return (
    <>
      <div className="loading-container">
        <img src={spinner} alt="Loading..." />
      </div>
    </>
  );
};

export default Loading;
