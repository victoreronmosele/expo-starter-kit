// app/(tabs)/dashboard.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { UserProfile } from '@/components/UserProfile';
import { useKindeAuth } from '@kinde/expo';
import { useTimeBasedTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Pressable, ActivityIndicator, View, Text, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';

export default function DashboardScreen() {
  const kinde = useKindeAuth();
  const { isDark } = useTimeBasedTheme();
  const insets = useSafeAreaInsets();
  const [currentOrg, setCurrentOrg] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [targetOrg, setTargetOrg] = useState('');
  
  // Handle navigation redirect for unauthenticated users
  useEffect(() => {
    if (kinde?.isAuthenticated === false) {
      router.replace('/');
    }
  }, [kinde?.isAuthenticated]);

  const refreshOrgInfo = async () => {
    try {
      const idTokenDecoded = await kinde.getDecodedToken('idToken');
      const accessTokenDecoded = await kinde.getDecodedToken('accessToken');
      console.log('--- REFRESHED KINDE TOKENS ---');
      console.log('Decoded Access Token:', JSON.stringify(accessTokenDecoded, null, 2));
      
      const org = await kinde.getCurrentOrganization();
      console.log('kinde.getCurrentOrganization() returned:', org);
      setCurrentOrg(org);
      
      const userOrgs = await kinde.getUserOrganizations();
      console.log('kinde.getUserOrganizations() returned:', userOrgs);
      if (userOrgs) {
        setOrgs(userOrgs);
      }
    } catch (e) {
      console.error('Error refreshing org details:', e);
    }
  };

  // Load organization information when authenticated
  useEffect(() => {
    if (kinde?.isAuthenticated) {
      refreshOrgInfo();
    }
  }, [kinde?.isAuthenticated]);
  
  const handleLogout = async () => {
    try {
      await kinde.logout({ revokeToken: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSwitchOrg = async () => {
    if (!targetOrg.trim()) return;
    try {
      console.log('Switching to organization silently:', targetOrg);
      const result = await kinde.switchOrg(targetOrg.trim());
      console.log('Login result after switch:', result);
      
      // Explicitly refresh UI states with the newly fetched tokens
      await refreshOrgInfo();
    } catch (error) {
      console.error('Switch org error:', error);
    }
  };

  if (kinde?.isLoading || kinde?.isAuthenticated === undefined) {
    return (
      <SafeAreaView style={[styles.loadingContainer, {backgroundColor: isDark ? '#000000' : '#FFFFFF'}]}>
        <ActivityIndicator size="large" color={isDark ? "#ffffff" : "#000000"} />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  if (!kinde.isAuthenticated) {
    return null;
  }

  return (
    <ScrollView 
      style={[styles.scrollView, {backgroundColor: isDark ? '#000000' : '#FFFFFF'}]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <ThemedView style={[styles.container, { width: '100%', backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <ThemedText style={styles.mainHeading}>
          Your authentication{'\n'}is all sorted!
        </ThemedText>
        
        <ThemedView style={[styles.card, { width: '100%', backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
          <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>User Profile</ThemedText>
          <UserProfile showTitle={false} />
          <Pressable
            style={[styles.button, isDark && styles.buttonDark]}
            onPress={() => Linking.openURL('https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/')}
          >
            <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>See full Expo SDK docs</Text>
          </Pressable>
        </ThemedView>

        <ThemedView style={[styles.card, { width: '100%', backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
          <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>Organization Info & Switching</ThemedText>
          <View style={styles.orgInfoContainer}>
            <Text style={styles.orgLabel}>Current Org Code:</Text>
            <Text style={[styles.orgValue, { color: isDark ? '#fff' : '#000' }]}>{currentOrg || 'None (Default Org)'}</Text>
          </View>
          <View style={styles.orgInfoContainer}>
            <Text style={styles.orgLabel}>All Assigned Orgs:</Text>
            <Text style={[styles.orgValue, { color: isDark ? '#fff' : '#000' }]}>{orgs.join(', ') || 'None'}</Text>
          </View>
          
          <Text style={[styles.switchLabel, { color: isDark ? '#fff' : '#000' }]}>Enter Org Code to Switch:</Text>
          <TextInput
            style={[styles.input, { borderColor: isDark ? '#444' : '#e2e8f0', color: isDark ? '#fff' : '#000', backgroundColor: isDark ? '#2d3748' : '#f8fafc' }]}
            placeholder="org_xxxxxx"
            placeholderTextColor="#888"
            value={targetOrg}
            onChangeText={setTargetOrg}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Pressable
            style={[styles.button, isDark && styles.buttonDark, { marginTop: 12 }]}
            onPress={handleSwitchOrg}
          >
            <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>Switch Organization</Text>
          </Pressable>
        </ThemedView>
        
        <ThemedView style={[styles.card, { width: '100%', backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
          <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>Get started with Kinde</ThemedText>
          <ThemedText style={styles.cardText}>
            Now that you're authenticated, you can explore all the features Kinde has to offer.
          </ThemedText>
          
          <ThemedView style={styles.linkContainer}>
            <Pressable 
              style={styles.linkButton}
              onPress={() => Linking.openURL('https://docs.kinde.com/manage-users')}
            >
              <ThemedText style={styles.linkText}>Manage Users</ThemedText>
            </Pressable>
            
            <Pressable 
              style={styles.linkButton}
              onPress={() => Linking.openURL('https://docs.kinde.com/authentication')}
            >
              <ThemedText style={styles.linkText}>Authentication</ThemedText>
            </Pressable>
            
            <Pressable 
              style={styles.linkButton}
              onPress={() => Linking.openURL('https://docs.kinde.com/feature-flags')}
            >
              <ThemedText style={styles.linkText}>Feature Flags</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.logoutButtonContainer}>
          <Pressable 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 40,
  },
  container: {
    padding: 16,
    alignItems: 'center',
  },
  mainHeading: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 44,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16,
  },
  cardText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  linkButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  linkText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 14,
  },
  logoutButtonContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDark: {
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  buttonTextDark: {
    color: 'black',
  },
  orgInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orgLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  orgValue: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: 'monospace',
  }
});