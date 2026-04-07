import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CallSession } from '../types/call';

type Props = {
  call: CallSession;
  onAnswer?: (callId: string) => void;
  onEnd?: (callId: string) => void;
};

const statusLabel: Record<CallSession['status'], string> = {
  RINGING: 'Tocando',
  ONGOING: 'Em andamento',
  ENDED: 'Encerrada',
  MISSED: 'Perdida',
  DECLINED: 'Recusada',
};

export function CallCard({ call, onAnswer, onEnd }: Props) {
  const isIncoming = call.calleeId === 'u2';

  return (
    <View style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.title}>{call.type === 'VIDEO' ? '📹 Vídeo' : '📞 Voz'}</Text>
        <Text style={styles.status}>{statusLabel[call.status]}</Text>
      </View>

      <Text style={styles.subtitle}>
        {isIncoming ? `De: ${call.caller.name}` : `Para: ${call.callee.name}`}
      </Text>

      <View style={styles.actions}>
        {call.status === 'RINGING' && isIncoming ? (
          <TouchableOpacity style={[styles.button, styles.accept]} onPress={() => onAnswer?.(call.id)}>
            <Text style={styles.buttonText}>Atender</Text>
          </TouchableOpacity>
        ) : null}

        {call.status === 'RINGING' || call.status === 'ONGOING' ? (
          <TouchableOpacity style={[styles.button, styles.end]} onPress={() => onEnd?.(call.id)}>
            <Text style={styles.buttonText}>Encerrar</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    backgroundColor: '#111827',
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#f9fafb', fontWeight: '700', fontSize: 16 },
  status: { color: '#93c5fd', fontWeight: '600', fontSize: 12 },
  subtitle: { color: '#cbd5e1', marginTop: 8 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  accept: { backgroundColor: '#16a34a' },
  end: { backgroundColor: '#dc2626' },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
