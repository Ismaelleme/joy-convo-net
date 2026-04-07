import { Screen } from '../components/Screen';
import { StyleSheet, Text, View } from 'react-native';

const sections = ['Vídeos curtos', 'Status de amigos', 'Chamadas recentes'];

export function ExploreScreen() {
  return (
    <Screen title="Explore">
      {sections.map((section) => (
        <View key={section} style={styles.item}>
          <Text style={styles.text}>{section}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#172554',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  text: { color: '#dbeafe', fontWeight: '600' },
});
