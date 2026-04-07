import { Screen } from '../components/Screen';
import { StyleSheet, Text, View } from 'react-native';

const settings = ['Tema escuro ativo', 'Notificações habilitadas', 'Privacidade reforçada'];

export function SettingsScreen() {
  return (
    <Screen title="Configurações">
      {settings.map((setting) => (
        <View key={setting} style={styles.item}>
          <Text style={styles.text}>{setting}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  text: { color: '#e5e7eb' },
});
