import { useState, useRef, useCallback } from 'react';

/**
 * Custom hook to manage the recording state machine.
 * States: idle | permissions | recording | paused | reviewing | processing | success
 */
export const useRecording = () => {
  const [status, setStatus] = useState('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      setStatus('permissions');
      
      // Try to get real mic access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        // Audio analysis setup
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        setAnalyser(analyserNode);

        // Recorder setup
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          setAudioBlob(blob);
          setStatus('reviewing');
        };

        recorder.start();
        setStatus('recording');
      } catch (micError) {
        console.warn('Microphone access denied or failed. Falling back to simulation mode.', micError);
        // SIMULATION FALLBACK
        setStatus('recording');
      }

      // Timer
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording initialization error:', err);
      setStatus('idle');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (status === 'recording' || status === 'paused') {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
      } else {
        // Simulation stop
        setStatus('reviewing');
      }
      clearInterval(timerRef.current);
    }
  }, [status]);

  const pauseRecording = useCallback(() => {
    if (status === 'recording') {
      if (mediaRecorderRef.current) mediaRecorderRef.current.pause();
      setStatus('paused');
      clearInterval(timerRef.current);
    }
  }, [status]);

  const resumeRecording = useCallback(() => {
    if (status === 'paused') {
      if (mediaRecorderRef.current) mediaRecorderRef.current.resume();
      setStatus('recording');
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  }, [status]);

  const startAnalysis = useCallback(() => {
    setStatus('processing');
  }, []);

  const resetRecording = useCallback(() => {
    setStatus('idle');
    setDuration(0);
    setAudioBlob(null);
    setAnalyser(null);
    chunksRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    status,
    duration,
    audioBlob,
    analyser,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    startAnalysis,
    resetRecording
  };
};
