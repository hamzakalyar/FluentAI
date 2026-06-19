import { useState, useRef, useCallback, useEffect } from 'react';
import { sessionsService } from '../services/sessionsService';

/**
 * Custom hook to manage the recording state machine.
 * States: idle | permissions | recording | paused | reviewing | processing | success | error
 */
export const useRecording = () => {
  const [status, setStatus] = useState('idle');
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);
  const audioBlobRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      setStatus('permissions');
      setAnalysisError(null);
      setSessionId(null);
      setAnalysisResults(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyserNode = audioCtx.createAnalyser();
        analyserNode.fftSize = 256;
        source.connect(analyserNode);
        setAnalyser(analyserNode);

        // Detect best supported MIME type at runtime
        const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
          ? 'audio/ogg;codecs=opus'
          : '';
        const recorderOptions = mimeType ? { mimeType } : {};
        const recorder = new MediaRecorder(stream, recorderOptions);
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          // Use detected mimeType so blob is consistent with what was recorded
          const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
          setAudioBlob(blob);
          audioBlobRef.current = blob;
          setStatus('reviewing');
        };

        // Start with 1-second timeslice: fires ondataavailable every 1s
        // This prevents data loss if the tab is hidden or recording is very long
        recorder.start(1000);
        setStatus('recording');
      } catch (micError) {
        console.warn('Microphone access denied. Falling back to simulation.', micError);
        setStatus('recording');
      }

      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording initialization error:', err);
      setStatus('idle');
    }
  }, []);

  // Cleanup on unmount: close AudioContext and stop mic tracks to prevent resource leaks
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopRecording = useCallback(() => {
    if (status === 'recording' || status === 'paused') {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        streamRef.current?.getTracks().forEach(track => track.stop());
      } else {
        setStatus('reviewing');
      }
      // Close the AudioContext to free browser resources (browsers cap at ~6 concurrent)
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAnalyser(null);
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

  const startAnalysis = useCallback(async (passageId = null, expectedText = null) => {
    const finalBlob = audioBlob || audioBlobRef.current;
    if (!finalBlob && !localStorage.getItem('is_demo_mode')) return;
    
    setStatus('processing');
    setAnalysisError(null);

    const isDemo = localStorage.getItem('is_demo_mode') === 'true';
    if (isDemo) {
      setTimeout(() => {
        setSessionId('mock-session-1');
        setAnalysisResults({
          id: 'mock-session-1',
          _id: 'mock-session-1',
          type: 'Evaluation',
          name: 'Vocal Prompt Evaluation',
          fluencyScore: 84
        });
        setStatus('success');
      }, 2500);
      return;
    }
    
    try {
      const response = await sessionsService.analyzeSession(finalBlob, passageId, expectedText);
      const sessionData = response.data.session || response.data;
      
      if (sessionData?._id || sessionData?.id) {
        setSessionId(sessionData._id || sessionData.id);
        setAnalysisResults(sessionData);
        setStatus('success');
      } else {
        throw new Error('Analysis completed but no valid session data returned');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      setAnalysisError(err.response?.data?.message || err.message || 'Failed to analyze audio');
      setStatus('error');
    }
  }, [audioBlob]);

  const setExternalAudio = useCallback((blob, durationSec = 0) => {
    setAudioBlob(blob);
    audioBlobRef.current = blob;
    setDuration(durationSec);
    setStatus('reviewing');
  }, []);

  const resetRecording = useCallback(() => {
    setStatus('idle');
    setDuration(0);
    setAudioBlob(null);
    setAnalyser(null);
    setSessionId(null);
    setAnalysisResults(null);
    setAnalysisError(null);
    chunksRef.current = [];
    audioBlobRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    // Close AudioContext if it wasn't already closed by stopRecording
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    // Stop any lingering microphone tracks
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  return {
    status,
    duration,
    audioBlob,
    analyser,
    sessionId,
    analysisResults,
    analysisError,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    startAnalysis,
    resetRecording,
    setExternalAudio
  };
};
