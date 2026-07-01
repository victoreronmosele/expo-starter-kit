import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useKindeAuth } from '@kinde/expo';
import { PromptTypes } from '@kinde/expo/utils';
import { useTimeBasedTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
// import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const kinde = useKindeAuth();
  const { isDark } = useTimeBasedTheme();
  const insets = useSafeAreaInsets();

  const [currentOrg, setCurrentOrg] = useState<string | null>(null);
  const [orgs, setOrgs] = useState<string[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  // const [isSilentSwitching, setIsSilentSwitching] = useState(false);
  // const [silentSwitchResult, setSilentSwitchResult] = useState<string | null>(null);

  const refreshOrgInfo = async () => {
    try {
      const org = await kinde.getCurrentOrganization();
      setCurrentOrg(org);

      const userOrgs = await kinde.getUserOrganizations();
      if (userOrgs) {
        setOrgs(userOrgs);
        if (userOrgs.length > 0) {
          setSelectedOrg(org && userOrgs.includes(org) ? org : userOrgs[0]);
        }
      }
    } catch (e) {
      console.error('Error refreshing org details:', e);
    }
  };

  useEffect(() => {
    if (kinde?.isAuthenticated) {
      refreshOrgInfo();
    }
  }, [kinde?.isAuthenticated]);

  const handleSignIn = async () => {
    try {
      await kinde.login({});
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await kinde.logout({ revokeToken: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSwitchOrg = async () => {
    if (!selectedOrg) return;
    setIsSwitching(true);
    try {
      console.log('Switching to organization silently:', selectedOrg);
      const result = await kinde.switchOrg(selectedOrg);
      console.log('Login result after switch:', result);
      await refreshOrgInfo();
    } catch (error) {
      console.error('Switch org error:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  /**
   * EXPERIMENTAL: Test if Kinde supports org_code on the refresh_token grant.
   * This would allow a completely silent (no browser) org switch.
   * Kinde likely does NOT support this, but this is the proof-of-concept test.
   */
  /*
  const handleSilentRefreshGrantSwitch = async () => {
    if (!selectedOrg) return;
    setIsSilentSwitching(true);
    setSilentSwitchResult(null);

    try {
      const kindeDomain = process.env.EXPO_PUBLIC_KINDE_DOMAIN;
      const clientId = process.env.EXPO_PUBLIC_KINDE_CLIENT_ID;

      // ExpoSecureStore uses prefix "kinde-" and splits long tokens into chunks
      // Keys are: kinde-refreshToken0, kinde-refreshToken1, etc.
      const KEY_PREFIX = 'kinde-';
      const KEY_NAME = 'refreshToken';
      let refreshToken = '';
      let chunkIndex = 0;
      // let chunk = await SecureStore.getItemAsync(`${KEY_PREFIX}${KEY_NAME}${chunkIndex}`);
      // while (chunk) {
      //   refreshToken += chunk;
      //   chunkIndex++;
      //   chunk = await SecureStore.getItemAsync(`${KEY_PREFIX}${KEY_NAME}${chunkIndex}`);
      // }

      console.log('SILENT_GRANT_TEST: refresh token found in SecureStore:', refreshToken.length > 0, `(${chunkIndex} chunks)`);

      if (!refreshToken) {
        setSilentSwitchResult(`❌ No refresh token found in SecureStore.\nLooked for keys: ${KEY_PREFIX}${KEY_NAME}0, ${KEY_PREFIX}${KEY_NAME}1, ...`);
        return;
      }

      console.log('SILENT_GRANT_TEST: Attempting refresh_token grant with org_code:', selectedOrg);

      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId!,
        org_code: selectedOrg,
      });

      const response = await fetch(`${kindeDomain}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      const data = await response.json();
      console.log('SILENT_GRANT_TEST: Response status:', response.status);
      console.log('SILENT_GRANT_TEST: Response body:', JSON.stringify(data, null, 2));

      if (response.ok && data.access_token) {
        // Decode and check the org in the returned access token
        const payload = JSON.parse(atob(data.access_token.split('.')[1]));
        const returnedOrg = payload.org_code ?? payload.org_name ?? 'unknown';
        setSilentSwitchResult(
          `✅ SUCCESS! Kinde returned a token for org: ${returnedOrg}\n` +
          `This means silent org switching WITHOUT a browser is possible!`
        );
      } else {
        setSilentSwitchResult(
          `❌ FAILED (${response.status}):\n` +
          `${data.error ?? 'Unknown error'}: ${data.error_description ?? JSON.stringify(data)}`
        );
      }
    } catch (error: any) {
      console.error('SILENT_GRANT_TEST: Error:', error);
      setSilentSwitchResult(`❌ Network error: ${error?.message ?? String(error)}`);
    } finally {
      setIsSilentSwitching(false);
    }
  };
  */

  if (kinde?.isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}>
        <ActivityIndicator size="large" color={isDark ? '#ffffff' : '#000000'} />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: isDark ? '#000000' : '#FFFFFF' }]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: insets.bottom + 20 }
      ]}
    >
      <View style={styles.container}>
        <ThemedText style={[styles.mainHeading, { color: isDark ? 'white' : 'black' }]}>
          Organization Manager
        </ThemedText>

        {!kinde.isAuthenticated ? (
          <ThemedView style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
            <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>
              Please Log In
            </ThemedText>
            <ThemedText style={styles.cardText}>
              You need to be authenticated to view and switch organizations.
            </ThemedText>
            <Pressable
              style={[styles.button, isDark && styles.buttonDark]}
              onPress={handleSignIn}
            >
              <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
                Sign In
              </Text>
            </Pressable>
          </ThemedView>
        ) : (
          <>
            <ThemedView style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
              <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>
                Current Organization
              </ThemedText>
              <View style={styles.orgInfoContainer}>
                <Text style={styles.orgLabel}>Organization from Token:</Text>
                <Text style={[styles.orgValue, { color: isDark ? '#fff' : '#000' }]}>
                  {currentOrg || 'None (Default Org)'}
                </Text>
              </View>
            </ThemedView>

            <ThemedView style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
              <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>
                Switch Organization
              </ThemedText>
              <Text style={[styles.switchLabel, { color: isDark ? '#fff' : '#000' }]}>
                Select Organization:
              </Text>

              {orgs.length === 0 ? (
                <Text style={[styles.noOrgsText, { color: isDark ? '#a0aec0' : '#718096' }]}>
                  No organizations found in token. Make sure organization claims are enabled.
                </Text>
              ) : (
                <>
                  <Pressable
                    style={[
                      styles.dropdownTrigger,
                      {
                        borderColor: isDark ? '#444' : '#e2e8f0',
                        backgroundColor: isDark ? '#2d3748' : '#f8fafc',
                      },
                    ]}
                    onPress={() => setIsDropdownOpen(true)}
                  >
                    <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 16 }}>
                      {selectedOrg || 'Select an organization'}
                    </Text>
                    <Text style={{ color: isDark ? '#a0aec0' : '#718096', fontSize: 14 }}>▼</Text>
                  </Pressable>

                  <Pressable
                    style={[
                      styles.button,
                      isDark && styles.buttonDark,
                      (!selectedOrg || isSwitching) && styles.buttonDisabled,
                    ]}
                    onPress={handleSwitchOrg}
                    disabled={!selectedOrg || isSwitching}
                  >
                    {isSwitching ? (
                      <ActivityIndicator size="small" color={isDark ? '#000000' : '#ffffff'} />
                    ) : (
                      <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
                        Switch Organization
                      </Text>
                    )}
                  </Pressable>
                </>
              )}
            </ThemedView>

            <Modal
              visible={isDropdownOpen}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsDropdownOpen(false)}
            >
              <Pressable
                style={styles.modalOverlay}
                onPress={() => setIsDropdownOpen(false)}
              >
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: isDark ? '#1a202c' : '#ffffff' },
                  ]}
                >
                  <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
                    Select an Organization
                  </Text>
                  <FlatList
                    data={orgs}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <Pressable
                        style={[
                          styles.orgItem,
                          item === selectedOrg && {
                            backgroundColor: isDark ? '#2d3748' : '#e2e8f0',
                          },
                        ]}
                        onPress={() => {
                          setSelectedOrg(item);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <Text style={[styles.orgItemText, { color: isDark ? '#fff' : '#000' }]}>
                          {item}
                        </Text>
                        {item === selectedOrg && (
                          <Text style={{ color: isDark ? '#38a169' : '#2f855a' }}>✓</Text>
                        )}
                      </Pressable>
                    )}
                  />
                  <Pressable
                    style={[styles.closeButton, { backgroundColor: isDark ? '#4a5568' : '#cbd5e0' }]}
                    onPress={() => setIsDropdownOpen(false)}
                  >
                    <Text style={[styles.closeButtonText, { color: isDark ? '#fff' : '#000' }]}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>

            {/* EXPERIMENTAL: Silent org switch via refresh_token grant
            <ThemedView style={[styles.card, { backgroundColor: isDark ? '#1e1e1e' : '#ffffff' }]}>
              <ThemedText style={[styles.cardTitle, { color: isDark ? '#fff' : '#000' }]}>
                🧪 Silent Grant Test
              </ThemedText>
              <Text style={[styles.cardText, { color: isDark ? '#a0aec0' : '#64748b' }]}>
                Tests if Kinde supports passing org_code directly to the /oauth2/token refresh_token grant — no browser, no dialog.
              </Text>
              <Pressable
                style={[
                  styles.button,
                  isDark && styles.buttonDark,
                  (!selectedOrg || isSilentSwitching) && styles.buttonDisabled,
                ]}
                onPress={handleSilentRefreshGrantSwitch}
                disabled={!selectedOrg || isSilentSwitching}
              >
                {isSilentSwitching ? (
                  <ActivityIndicator size="small" color={isDark ? '#000000' : '#ffffff'} />
                ) : (
                  <Text style={[styles.buttonText, isDark && styles.buttonTextDark]}>
                    Test Silent Switch → {selectedOrg ?? 'select an org first'}
                  </Text>
                )}
              </Pressable>
              {silentSwitchResult && (
                <Text style={[styles.silentResultText, { color: isDark ? '#e2e8f0' : '#1a202c' }]}>
                  {silentSwitchResult}
                </Text>
              )}
            </ThemedView>
            */}

            <View style={styles.logoutButtonContainer}>
              <Pressable
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.logoutButtonText}>Sign Out</Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
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
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 38,
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
    marginBottom: 16,
  },
  cardText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
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
  buttonDisabled: {
    opacity: 0.5,
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
  },
  orgLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  orgValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  noOrgsText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '60%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  orgItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  orgItemText: {
    fontSize: 16,
    fontFamily: 'monospace',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    fontWeight: '600',
    fontSize: 16,
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
    marginTop: 16,
    fontSize: 16,
  },
  silentResultText: {
    marginTop: 16,
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});
