import { Screen } from '../components/Screen';
import { contacts } from '../data/mock';
import { StyleSheet, Text, View } from 'react-native';

export function ContactsScreen() {
  return (
    <Screen title="Contatos">
      {contacts.map((contact) => (
        <View key={contact.id} style={styles.row}>
          <Text style={styles.name}>{contact.name}</Text>
          <Text style={[styles.status, contact.online ? styles.online : styles.offline]}>
            {contact.online ? 'Online' : 'Offline'}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: { color: '#f9fafb', fontWeight: '600' },
  status: { fontWeight: '700' },
  online: { color: '#4ade80' },
  offline: { color: '#f87171' },
});
