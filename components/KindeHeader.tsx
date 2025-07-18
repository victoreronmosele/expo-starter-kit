// components/KindeHeader.tsx
import { useKindeAuth } from '@kinde/expo';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function KindeHeader() {
  const insets = useSafeAreaInsets();
  const kinde = useKindeAuth();

  const handleSignIn = async (): Promise<void> => {
    try {
      const token = await kinde.login({});
      if (token) {
        console.log('User signed in successfully');
      }
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const token = await kinde.register({});
      if (token) {
        console.log('User registered successfully');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

    const handleAccount = async () => {
      try {
        await kinde.portal();
      } catch (error) {
        console.error('Generate portal URL error:', error);
      }
    };

  const handleLogout = async () => {
    try {
      await kinde.logout({ revokeToken: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 4 }]}>
      <View style={styles.logoContainer}>
        <Text style={styles.kindeLogo}>Kinde</Text>
        <Text style={styles.divider}>/</Text>
        <Text style={styles.expoLogo}>Expo</Text>
      </View>
      
      <View style={styles.authButtons}>
        {!kinde.isAuthenticated ? (
          <>
            <Pressable onPress={handleSignIn} style={styles.signInButton}>
              <Text style={styles.signInText}>Sign in</Text>
            </Pressable>
            <Pressable onPress={handleSignUp} style={styles.registerButton}>
              <Text style={styles.registerText}>Register</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={styles.signInButton}
              onPress={handleAccount}
            >
              <Text style={styles.signInText}>Account</Text>
            </Pressable>
            <Pressable onPress={handleLogout} style={styles.registerButton}>
              <Text style={styles.registerText}>Log out</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kindeLogo: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  expoLogo: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    marginHorizontal: 8,
    color: '#666',
    fontSize: 18,
  },
  authButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signInButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  registerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  signInText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  registerText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
});