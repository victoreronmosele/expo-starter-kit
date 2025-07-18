// hooks/useTheming.tsx
import { useColorScheme } from 'react-native';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  border: string;
  primaryButton: string;
  primaryButtonText: string;
  secondaryButton: string;
  secondaryButtonText: string;
  muted: string;
  code: {
    background: string;
    text: string;
    border: string;
  };
}

interface ThemeResult {
  isDark: boolean;
  colors: ThemeColors;
  resolveColor: (lightColor: string, darkColor: string) => string;
}

export function useTheming(): ThemeResult {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors: ThemeColors = {
    background: isDark ? '#000000' : '#0f172a',
    card: isDark ? '#0f172a' : '#1e293b',
    text: 'white',
    border: '#334155',
    primaryButton: 'white',
    primaryButtonText: 'black',
    secondaryButton: 'transparent',
    secondaryButtonText: 'white',
    muted: '#94a3b8',
    code: {
      background: '#111827',
      text: '#e2e8f0',
      border: '#334155'
    }
  };

  return {
    isDark,
    colors,
    resolveColor: (lightColor: string, darkColor: string) => isDark ? darkColor : lightColor,
  };
}