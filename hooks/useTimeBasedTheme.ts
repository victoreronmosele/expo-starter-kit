import { useEffect, useState } from 'react';

export function useTimeBasedTheme() {
  const [isDark, setIsDark] = useState<boolean>(false);
  
  // Function to determine if it should be dark mode based on current time
  const checkShouldBeDarkMode = () => {
    const currentHour = new Date().getHours();
    return currentHour >= 18 || currentHour < 6; // Dark mode after 6PM or before 6AM
  };
  
  useEffect(() => {
    // Initial check
    setIsDark(checkShouldBeDarkMode());
    
    // Set up an interval to check every minute
    const interval = setInterval(() => {
      setIsDark(checkShouldBeDarkMode());
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  return { isDark, colorScheme: isDark ? 'dark' : 'light' };
}