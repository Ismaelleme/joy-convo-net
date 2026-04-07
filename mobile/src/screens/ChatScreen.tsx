import { Screen } from '../components/Screen';
import { messages } from '../data/mock';
import { StyleSheet, Text, View } from 'react-native';

export function ChatScreen() {
  return (
    <Screen title="Chat">
      {messages.map((message) => (
        <View key={message.id} style={styles.bubble}>
          <Text style={styles.from}>{message.from}</Text>
          <Text style={styles.text}>{message.text}</Text>
          <Text style={styles.time}>{message.at}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  from: { color: '#93c5fd', fontWeight: '700' },
  text: { color: '#e2e8f0', marginTop: 4 },
  time: { color: '#94a3b8', fontSize: 12, marginTop: 6 },
});
