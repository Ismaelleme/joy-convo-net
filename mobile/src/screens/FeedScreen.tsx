import { Screen } from '../components/Screen';
import { posts } from '../data/mock';
import { StyleSheet, Text, View } from 'react-native';

export function FeedScreen() {
  return (
    <Screen title="Feed">
      {posts.map((post) => (
        <View key={post.id} style={styles.card}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.content}>{post.content}</Text>
          <Text style={styles.likes}>❤️ {post.likes}</Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    gap: 6,
  },
  author: { color: '#f8fafc', fontWeight: '700', fontSize: 16 },
  content: { color: '#cbd5e1', fontSize: 14 },
  likes: { color: '#fb7185', fontWeight: '600' },
});
