import { Auth } from '@/components/Auth';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useKindeAuth } from '@kinde/expo';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTimeBasedTheme } from '@/context/ThemeContext';

export default function HomeScreen() {
  const kinde = useKindeAuth();
  const [isAuth, setIsAuth] = useState(kinde.isAuthenticated);
  const { isDark } = useTimeBasedTheme();
  const insets = useSafeAreaInsets();
  
  useEffect(() => {
    setIsAuth(kinde.isAuthenticated);
    
    if (kinde.isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [kinde.isAuthenticated]);

  return (
    <ScrollView 
      style={[styles.scrollView, {backgroundColor: isDark ? 'black' : 'white'}]} 
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.container, {backgroundColor: isDark ? 'black' : 'white'}]}>
        <ThemedText style={[styles.mainHeading, {color: isDark ? 'white' : 'black'}]}>
          Auth for{'\n'}modern{'\n'}applications
        </ThemedText>
        
        <View style={styles.labelContainer}>
          <ThemedText style={styles.label}>
            First things first
          </ThemedText>
        </View>
        
        {/* Card 1 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}>
              <ThemedText style={styles.stepBadgeText}>1</ThemedText>
            </View>
            <ThemedText style={styles.cardTitle}>Instructions</ThemedText>
          </View>
          
          <ThemedText style={styles.cardText}>
            A. In Kinde, go to <ThemedText style={styles.boldText}>Applications {'>'} [Your app] {'>'} View details</ThemedText>.
          </ThemedText>
          
          <ThemedText style={styles.cardText}>
            B. Add your <ThemedText style={styles.boldText}>callback URLs</ThemedText> in the relevant fields. You'll need to include your development URL with the following patterns:
          </ThemedText>
          
          <View style={styles.codeBlock}>
            <ThemedText style={styles.codeText}>[scheme]://[host]:[port]/--/</ThemedText>
            <ThemedText style={styles.codeText}>Example: exp://localhost:19000/--/</ThemedText>
          </View>
          
          <View style={styles.codeBlock}>
            <ThemedText style={styles.codeText}>[scheme]://[host]:[port]</ThemedText>
            <ThemedText style={styles.codeText}>Example: exp://localhost:19000</ThemedText>
          </View>
          
          <ThemedText style={styles.cardText}>
            Note: The port may vary (common values: 8081, 19000, 19006). Check your Expo dev server output for the correct URL.
          </ThemedText>
          
          <ThemedText style={styles.cardText}>
            C. Select <ThemedText style={styles.boldText}>Save</ThemedText>.
          </ThemedText>
        </View>
        
        {/* Card 2 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.stepBadge}>
              <ThemedText style={styles.stepBadgeText}>2</ThemedText>
            </View>
            <ThemedText style={styles.cardTitle}>Get building!</ThemedText>
          </View>
          
          <Auth />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'black',
  },
  scrollContent: {
    paddingTop: 50,
    paddingBottom: 40,
  },
  container: {
    padding: 16,
    backgroundColor: 'black',
  },
  mainHeading: {
    fontSize: 38,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 42,
  },
  labelContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: 'black',
    backgroundColor: '#f1f5f9',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },
  cardText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '600',
    color: 'black',
  },
  codeBlock: {
    backgroundColor: '#111827',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#e2e8f0',
    fontSize: 14,
  }
});
