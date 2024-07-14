import React from 'react';
import notfound from '../assets/notfound.json';
import Lottie from 'lottie-react';

const NoTaskBill = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <Lottie loop={true} animationData={notfound} style={{ width: '30%', height: '30%' }} />
     
    </div>
  );
};

export default NoTaskBill;
