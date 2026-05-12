import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Formats a date for display in the UI.
 * @param {string|Date} date - Date to format.
 * @returns {string} - Formatted date string (e.g., "Today at 2:00 PM").
 */
export const formatDisplayDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  
  if (isToday(d)) {
    return `Today at ${format(d, 'h:mm a')}`;
  }
  if (isYesterday(d)) {
    return `Yesterday at ${format(d, 'h:mm a')}`;
  }
  
  return format(d, 'MMM d, yyyy');
};

/**
 * Returns a relative time string (e.g., "2 hours ago").
 * @param {string|Date} date - Date to format.
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};
