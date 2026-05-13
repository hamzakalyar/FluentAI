import { useState, useRef, useCallback } from 'react';
import api from '../services/api';

/**
 * Custom hook to manage the recording state machine.
 * States: idle | permissions | recording | paused | reviewing | processing | success | error
 */
export const useRecording = () => {
  const [status,    setStatus]    = useState('idle');
  const [duration,  setDuration]  = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyser,  setAnalyser]  = useState(null);
  const [sessionId, setSessionId] = useState(null); // ID of the saved session after analysis
  const [analysisError, setAnalysisError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioContextRef  = useRef(null);
  const streamRef        = useRef(null);
  const timerRef         = useRef(null);
  const chunksRef        = useRef([]);
  const audioBlobRef     = useRef(null); // keep a sync ref alongside state for use in callbacks

  const startRecording = useCallback(async () => {
    try {
      setStatus('permissions');
      setAnalysisError(null);

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
          audioBlobRef.current = blob;
          setStatus('reviewing');
        };

        recorder.start();
        setStatus('recording');
      } catch (micError) {
        console.warn('Microphone access denied. Falling back to simulation mode.', micError);
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

  /**
   * startAnalysis — upload the recorded audio to the backend for AI analysis.
   * Sets status to 'processing' while waiting, then 'success' on completion.
   */
  const startAnalysis = useCallback(async (passageId = null, expectedText = null) => {
    const blob = audioBlobRef.current || audioBlob;
    if (!blob) {
      console.error('No audio blob available for analysis');
      return;
    }

    setStatus('processing');
    setAnalysisError(null);

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'session.webm');
      if (passageId)    formData.append('passageId', passageId);
      if (expectedText) formData.append('expectedText', expectedText);

      const response = await api.post('/sessions/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 180000, // 3 min — Whisper can be slow
      });

      const savedSession = response.data.session;
      setSessionId(savedSession._id);
      setStatus('success');
      return savedSession;

    } catch (error) {
      const msg = error?.response?.data?.message || error.message || 'Analysis failed';
      setAnalysisError(msg);
      setStatus('error');
      console.error('Analysis error:', msg);
      throw error;
    }
  }, [audioBlob]);

  const resetRecording = useCallback(() => {
    setStatus('idle');
    setDuration(0);
    setAudioBlob(null);
    setAnalyser(null);
    setSessionId(null);
    setAnalysisError(null);
    audioBlobRef.current = null;
    chunksRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    status,
    duration,
    audioBlob,
    analyser,
    sessionId,
    analysisError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    startAnalysis,
    resetRecording,
  };
};
