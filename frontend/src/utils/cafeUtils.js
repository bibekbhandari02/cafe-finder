// Utility functions for cafe operations

export const isOpenNow = (openingHours) => {
  if (!openingHours) return null;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight

  const todayHours = openingHours[currentDay];
  if (!todayHours || todayHours.toLowerCase() === 'closed') return false;

  try {
    // Parse "7:00 AM - 9:00 PM" format
    const [open, close] = todayHours.split(' - ');
    const openTime = parseTime(open);
    const closeTime = parseTime(close);

    return currentTime >= openTime && currentTime <= closeTime;
  } catch (error) {
    return null;
  }
};

const parseTime = (timeStr) => {
  const [time, period] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return hours * 60 + minutes;
};

export const getTodayHours = (openingHours) => {
  if (!openingHours) return 'Hours not available';
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = days[new Date().getDay()];
  
  return openingHours[currentDay] || 'Closed';
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};
