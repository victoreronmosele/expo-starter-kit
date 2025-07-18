import { HapticTab } from '@/components/HapticTab';
import { KindeHeader } from '@/components/KindeHeader';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useKindeAuth } from '@kinde/expo';
import { Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const kinde = useKindeAuth();
  const [isAuth, setIsAuth] = useState(false); // Initialize as false to be safe
  
  // Force a re-render when auth state changes
  useEffect(() => {
    // Ensure this is a boolean and updates when auth changes
    setIsAuth(Boolean(kinde.isAuthenticated));
    console.log("Auth state updated:", Boolean(kinde.isAuthenticated));
  }, [kinde.isAuthenticated]);

  // Only show Home and Explore for unauthenticated users
  if (!isAuth) {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: true,
          header: () => <KindeHeader />,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: [
            styles.tabBar,
            Platform.select({
              ios: { position: 'absolute' },
              default: {},
            }),
          ],
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
      </Tabs>
    );
  }
  
  // Show all tabs including dashboard for authenticated users
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        header: () => <KindeHeader />,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: [
          styles.tabBar,
          Platform.select({
            ios: { position: 'absolute' },
            default: {},
          }),
        ],
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gauge" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000000',
    borderTopColor: '#262626',
  },
});
