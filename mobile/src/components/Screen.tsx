import { PropsWithChildren } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = PropsWithChildren<{ title: string }>;

export function Screen({ title, children }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView contentContainerStyle={styles.content}>
        <View>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#020617',
  },
  title: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  content: {
    padding: 16,
    gap: 12,
  },
});
