import React, { useEffect, useRef } from 'react';

const WaveformCanvas = ({ analyser, isRecording, color = '#818CF8', bars = 60 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = 4;
      const barGap = 2; // Prompt spec: gap=2
      const totalBarWidth = barWidth + barGap;
      const startX = (canvas.width - (bars * totalBarWidth)) / 2;

      for (let i = 0; i < bars; i++) {
        // Map frequency data to 60 bars
        const dataIndex = Math.floor((i / bars) * (bufferLength / 2)) + 2;
        const amplitude = dataArray[dataIndex] / 255;
        
        // Spec: React in real-time to voice amplitude
        const minHeight = 4;
        const barHeight = Math.max(minHeight, amplitude * canvas.height * 0.8);
        
        // Vertical Centering
        const y = (canvas.height - barHeight) / 2;
        const x = startX + (i * totalBarWidth);

        // Resolve colors (Institutional Match)
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const silenceColor = isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
        const activeColor = color.startsWith('var') ? getComputedStyle(document.documentElement).getPropertyValue(color.match(/\(([^)]+)\)/)[1]).trim() : color;

        ctx.fillStyle = amplitude > 0.1 ? activeColor : silenceColor;

        drawRoundedRect(ctx, x, y, barWidth, barHeight, 2);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isRecording, color, bars]);

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <canvas 
      ref={canvasRef} 
      width={400} 
      height={80} 
      className="w-full h-full"
    />
  );
};

export default WaveformCanvas;
