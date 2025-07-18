// components/Auth.tsx
import { useKindeAuth } from '@kinde/expo';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export function Auth() {
  const kinde = useKindeAuth();

  const handleSignIn = async () => {
    try {
      const token = await kinde.login({});
      if (token) {
        console.log('User signed in successfully');
        router.replace('/dashboard');
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
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await kinde.logout({ revokeToken: true });
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return !kinde.isAuthenticated ? (
    <View style={styles.buttonContainer}>
      <Pressable
        style={styles.signInButton}
        onPress={handleSignIn}
      >
        <Text style={styles.signInText}>Sign in</Text>
      </Pressable>
      <Pressable
        style={styles.registerButton}
        onPress={handleSignUp}
      >
        <Text style={styles.registerText}>Register</Text>
      </Pressable>
    </View>
  ) : (
    <Pressable
      style={styles.logoutButton}
      onPress={handleLogout}
    >
      <Text style={styles.logoutText}>Log out</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  signInButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  registerButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  signInText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
  registerText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
  logoutText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  }
});