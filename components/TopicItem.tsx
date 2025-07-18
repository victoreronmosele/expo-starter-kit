// components/TopicItem.tsx
import * as Linking from 'expo-linking';
import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

interface Topic {
  label: string;
  description: string;
  docsLink: string;
}

interface TopicItemProps {
  topic: Topic;
}

export function TopicItem({ topic }: TopicItemProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      style={[styles.container, isDark && styles.containerDark]}
      onPress={() => Linking.openURL(topic.docsLink)}
    >
      <View style={styles.iconContainer}>
        {/* Here we'd use SVG icons, but for simplicity using a placeholder */}
        <Text style={[styles.iconPlaceholder, isDark && styles.textDark]}>🔍</Text>
      </View>
      <Text style={[styles.title, isDark && styles.textDark]}>{topic.label}</Text>
      <Text style={[styles.description, isDark && styles.descriptionDark]}>{topic.description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flex: 1,
    minHeight: 200,
    gap: 12,
  },
  containerDark: {
    backgroundColor: '#000',
    borderColor: '#1e293b',
  },
  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    fontSize: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
  },
  description: {
    fontSize: 16,
    color: '#64748b',
    flexShrink: 1,
  },
  descriptionDark: {
    color: '#94a3b8',
  },
  textDark: {
    color: '#fff',
  },
});