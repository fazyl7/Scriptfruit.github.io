// utils/attendance.ts
export const pct = (attended: number, total: number) =>
  total <= 0 ? 0 : Math.round((attended / total) * 100);

// "Can I skip today's class and still be >= threshold?"
export const canSkipToday = (attended: number, total: number, threshold = 75) =>
  ((attended) / (total + 1)) * 100 >= threshold;

// Status buckets for easy UI coloring
export type AttendanceStatus = 'safe' | 'warning' | 'critical';
export const attendanceStatus = (attended: number, total: number, threshold = 75): AttendanceStatus => {
  const percentage = pct(attended, total);
  if (percentage >= threshold + 5) return 'safe';
  if (percentage >= threshold) return 'warning';
  return 'critical';
};

// How many more you can skip before falling below threshold
export const remainingSkips = (attended: number, total: number, threshold = 75) => {
  let skips = 0;
  while (((attended) / (total + skips + 1)) * 100 >= threshold) {
    skips++;
  }
  return skips;
};
