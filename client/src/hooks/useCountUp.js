import { useState, useEffect } from 'react';

export const useCountUp = (targetString, duration = 2000, startDelay = 200) => {
  const [count, setCount] = useState('0');
  const [hasStarted, setHasStarted] = useState(false);

  // Extract numbers and suffix/prefix
  const numericMatch = targetString.match(/([\d.,]+)/);
  const targetNumber = numericMatch ? parseFloat(numericMatch[0].replace(/,/g, '')) : 0;
  
  const prefix = targetString.split(numericMatch ? numericMatch[0] : '')[0] || '';
  const suffix = targetString.split(numericMatch ? numericMatch[0] : '')[1] || '';
  const hasDecimals = targetString.includes('.');

  const start = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  useEffect(() => {
    if (!hasStarted) return;

    let startTime = null;
    let animationFrameId;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp + startDelay;
      
      const progress = timestamp - startTime;
      
      if (progress < 0) {
        animationFrameId = requestAnimationFrame(updateCount);
        return;
      }

      const percentage = Math.min(progress / duration, 1);
      const easedProgress = easeOutCubic(percentage);
      const currentNumber = targetNumber * easedProgress;

      let formattedNumber;
      if (hasDecimals) {
        formattedNumber = currentNumber.toFixed(1);
      } else {
        formattedNumber = Math.floor(currentNumber).toLocaleString();
      }

      setCount(`${prefix}${formattedNumber}${suffix}`);

      if (percentage < 1) {
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(targetString);
      }
    };

    animationFrameId = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasStarted, targetNumber, duration, startDelay, targetString, hasDecimals, prefix, suffix]);

  return { count, start };
};
