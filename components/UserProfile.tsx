// components/UserProfile.tsx
import { getUserProfile } from '@kinde/expo/utils';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface UserProfileProps {
  showTitle?: boolean;
}

interface UserData {
  id: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  [key: string]: any;
}

export function UserProfile({ showTitle = false }: UserProfileProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile as UserData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading user data...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {showTitle && (
        <ThemedText style={styles.title}>User Profile</ThemedText>
      )}
      
      {user ? (
        <View style={styles.profileContainer}>
          <View style={styles.profileRow}>
            <View style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              <Text style={styles.fieldLabelText}>id</Text>
            </View>
            <View style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
              <Text style={[styles.fieldValueText, isDark && styles.textDark]} numberOfLines={1}>{user.id}</Text>
            </View>
          </View>
          
          <View style={styles.profileRow}>
            <View style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              <Text style={styles.fieldLabelText}>email</Text>
            </View>
            <View style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
              <Text style={[styles.fieldValueText, isDark && styles.textDark]} numberOfLines={1}>{user.email ?? '—'}</Text>
            </View>
          </View>
          
          <View style={styles.profileRow}>
            <View style={[styles.fieldLabel, isDark && styles.fieldLabelDark]}>
              <Text style={styles.fieldLabelText}>name</Text>
            </View>
            <View style={[styles.fieldValue, isDark && styles.fieldValueDark]}>
              <Text style={[styles.fieldValueText, isDark && styles.textDark]} numberOfLines={1}>
                {[user.given_name, user.family_name].filter(Boolean).join(' ') || '—'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <ThemedText>No user data available</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16, 
  },
  profileContainer: {
    width: '100%',
    gap: 12,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldLabel: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldLabelDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  fieldLabelText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#000',
  },
  fieldValue: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  fieldValueDark: {
    backgroundColor: '#000',
    borderColor: '#334155',
  },
  fieldValueText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#334155',
  },
  textDark: {
    color: '#fff',
  },
});