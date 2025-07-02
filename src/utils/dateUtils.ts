// Format time to HH:MM format
export const formatTime = (date: Date | null): string => {
  if (!date) return '--:--';
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Get today's date in YYYY-MM-DD format
export const getTodayString = (): string => {
  return formatDate(new Date());
};

// Calculate duration between two dates in hours
export const calculateDuration = (start: Date, end: Date): number => {
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60) * 10) / 10; // Round to 1 decimal place
};