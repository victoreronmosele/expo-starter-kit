import { KindeAuthProvider, useKindeAuth } from '@kinde/expo';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router/react-navigation";
import Constants from 'expo-constants';

import { Stack, usePathname, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTimeBasedTheme } from '../context/ThemeContext';
import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    console.log("SWITCH_ORG: RootLayout mounted (app startup)");
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AuthChecker() {
  const kinde = useKindeAuth();
  const pathname = usePathname();

  useEffect(() => {
    console.log("SWITCH_ORG: AuthChecker evaluated", { isAuthenticated: kinde?.isAuthenticated, pathname, isLoading: kinde?.isLoading });
    // Only kick the user out if the SDK has FINISHED loading and they are still not authenticated.
    if (kinde?.isLoading === false && kinde?.isAuthenticated === false && pathname !== '/') {
      console.log("SWITCH_ORG: AuthChecker routing back to /");
      router.replace('/');
    }
  }, [kinde?.isAuthenticated, kinde?.isLoading, pathname]);

  return null;
}

function RootLayoutContent() {
  useEffect(() => {
    console.log("SWITCH_ORG: RootLayoutContent mounted (app startup)");
  }, []);
  const { isDark, colorScheme } = useTimeBasedTheme();

  const CustomDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000',
      card: '#000000',
    },
  };

  const CustomLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#ffffff',
      card: '#ffffff',
    },
  };

  return (
    <KindeAuthProvider
      config={{
        domain: Constants.expoConfig?.extra?.EXPO_PUBLIC_KINDE_DOMAIN,
        clientId: Constants.expoConfig?.extra?.EXPO_PUBLIC_KINDE_CLIENT_ID,
        scopes: "openid profile email offline",
      }}
    >
      <AuthChecker />
      <NavigationThemeProvider value={isDark ? CustomDarkTheme : CustomLightTheme}>
        <View style={[styles.container, { backgroundColor: isDark ? CustomDarkTheme.colors.background : CustomLightTheme.colors.background }]}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: isDark ? CustomDarkTheme.colors.background : CustomLightTheme.colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={isDark ? "light" : "dark"} />
        </View>
      </NavigationThemeProvider>
    </KindeAuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});