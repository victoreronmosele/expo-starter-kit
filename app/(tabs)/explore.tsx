import { StyleSheet } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Kinde Features</ThemedText>
      </ThemedView>
      <ThemedText>Explore Kinde's authentication features and how to use them in your app.</ThemedText>
      
      <Collapsible title="Authentication Methods">
        <ThemedText>
          Kinde provides several authentication methods, including email/password, social logins, and more.
        </ThemedText>
        <ThemedText>
          The <ThemedText type="defaultSemiBold">useKindeAuth()</ThemedText> hook gives you access to login, register, and logout functions.
        </ThemedText>
        <ExternalLink href="https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/#authentication-methods">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="User Management">
        <ThemedText>
          Access user data with utilities like <ThemedText type="defaultSemiBold">getUserProfile()</ThemedText>, <ThemedText type="defaultSemiBold">getRoles()</ThemedText>, and <ThemedText type="defaultSemiBold">getPermissions()</ThemedText>.
        </ThemedText>
        <ExternalLink href="https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/#using-utility-functions">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Organizations">
        <ThemedText>
          Kinde supports multi-tenant applications with organization management.
        </ThemedText>
        <ExternalLink href="https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/#using-utility-functions">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Feature Flags">
        <ThemedText>
          Control access to features using Kinde's feature flags.
        </ThemedText>
        <ThemedText>
          Use <ThemedText type="defaultSemiBold">getFlag()</ThemedText> to check feature flag values.
        </ThemedText>
        <ExternalLink href="https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/#using-utility-functions">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Permissions and Roles">
        <ThemedText>
          Implement fine-grained access control with Kinde's permissions and roles system.
        </ThemedText>
        <ExternalLink href="https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/#using-utility-functions">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
      
      <Collapsible title="Token Management">
        <ThemedText>
          Kinde handles token management, including refreshing tokens automatically.
        </ThemedText>
        <ThemedText>
          You can manually refresh tokens with <ThemedText type="defaultSemiBold">refreshToken()</ThemedText>.
        </ThemedText>
        <ExternalLink href="https://docs.kinde.com/developer-tools/sdks/mobile/expo-sdk/#using-utility-functions">
          <ThemedText type="link">Learn more</ThemedText>
        </ExternalLink>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
