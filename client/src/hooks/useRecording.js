import { useState, useRef, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to manage the recording state machine.
 * States: idle | permissions | recording | paused | reviewing | processing | success
 */
export const useRecording = () => {
  const [status, setStatus] = useState('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyser, setAnalyser] = useState(null);

  const [sessionId, setSessionId] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
 
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
 
  const startRecording = useCallback(async () => {
    try {
      setStatus('permissions');
      setAnalysisError(null);
      setSessionId(null);
 
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
 
  const startAnalysis = useCallback(async (passageId, expectedText) => {
    if (!audioBlob && status !== 'reviewing') return;
    
    setStatus('processing');
    setAnalysisError(null);
    
    try {
      const formData = new FormData();
      // Ensure we have a valid blob (if simulation, we might not have chunks)
      const finalBlob = audioBlob || new Blob([], { type: 'audio/webm' });
      formData.append('audio', finalBlob, 'recording.webm');
      
      if (passageId) formData.append('passageId', passageId);
      if (expectedText) formData.append('expectedText', expectedText);
 
      const response = await api.post('/sessions/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000 // 2 minutes
      });
 
      if (response.data?.session?._id) {
        setSessionId(response.data.session._id);
        setStatus('success');
      } else {
        throw new Error('Analysis completed but no session ID returned');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.response?.data?.message || err.message || 'Failed to analyze audio');
      setStatus('error');
    }
  }, [audioBlob, status]);
 
  const resetRecording = useCallback(() => {
    setStatus('idle');
    setDuration(0);
    setAudioBlob(null);
    setAnalyser(null);
    setSessionId(null);
    setAnalysisError(null);
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
