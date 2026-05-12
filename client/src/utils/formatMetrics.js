/**
 * Formats a fluency score as a percentage.
 */
export const formatScore = (score) => {
  return `${Math.round(score * 100)}%`;
};

/**
 * Formats duration in seconds to MM:SS.
 */
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Formats WPM (Words Per Minute).
 */
export const formatWPM = (wpm) => {
  return Math.round(wpm || 0).toString();
};

/**
 * Maps a disfluency type to a human-readable label.
 */
export const getDisfluencyLabel = (type) => {
  const labels = {
    'repetition': 'Word Repetition',
    'pause': 'Long Pause',
    'filler': 'Filler Word',
    'prolongation': 'Sound Prolongation'
  };
  return labels[type] || type;
};
