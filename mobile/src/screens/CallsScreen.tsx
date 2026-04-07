import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { io, Socket } from 'socket.io-client';
import { Screen } from '../components/Screen';
import { CallCard } from '../components/CallCard';
import { createCall, listUserCalls, answerCall, endCall } from '../services/calls';
import { CallSession, CallType } from '../types/call';

const CURRENT_USER = 'u2';
const CONTACT_USER = 'u1';

export function CallsScreen() {
  const [calls, setCalls] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = io('http://localhost:3001/calls', { transports: ['websocket'] });

    s.on('connect', () => {
      s.emit('join-user', { userId: CURRENT_USER });
    });

    s.on('call-offer', () => {
      refreshCalls();
    });

    s.on('call-answer', () => {
      refreshCalls();
    });

    s.on('hangup', () => {
      refreshCalls();
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const activeCall = useMemo(
    () => calls.find((call) => call.status === 'RINGING' || call.status === 'ONGOING'),
    [calls],
  );

  async function refreshCalls() {
    try {
      setLoading(true);
      setError(null);
      const data = await listUserCalls(CURRENT_USER);
      setCalls(data);
    } catch (e) {
      setError('Não foi possível carregar as ligações. Verifique backend e usuário.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshCalls();
  }, []);

  async function startCall(type: CallType) {
    try {
      const call = await createCall(CURRENT_USER, CONTACT_USER, type);
      socket?.emit('call-offer', {
        fromUserId: CURRENT_USER,
        toUserId: CONTACT_USER,
        callId: call.id,
        sdp: null,
      });
      await refreshCalls();
    } catch {
      setError('Falha ao iniciar ligação.');
    }
  }

  async function handleAnswer(callId: string) {
    try {
      const call = await answerCall(callId);
      socket?.emit('call-answer', {
        fromUserId: CURRENT_USER,
        toUserId: call.callerId,
        callId,
        sdp: null,
      });
      await refreshCalls();
    } catch {
      setError('Falha ao atender ligação.');
    }
  }

  async function handleEnd(callId: string) {
    try {
      const call = await endCall(callId, 'ENDED');
      const toUserId = call.callerId === CURRENT_USER ? call.calleeId : call.callerId;
      socket?.emit('hangup', {
        fromUserId: CURRENT_USER,
        toUserId,
        callId,
      });
      await refreshCalls();
    } catch {
      setError('Falha ao encerrar ligação.');
    }
  }

  return (
    <Screen title="Ligações">
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.cta, styles.voice]} onPress={() => startCall('VOICE')}>
          <Text style={styles.ctaText}>Nova chamada de voz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cta, styles.video]} onPress={() => startCall('VIDEO')}>
          <Text style={styles.ctaText}>Nova chamada de vídeo</Text>
        </TouchableOpacity>
      </View>

      {activeCall ? (
        <View style={styles.activeBadge}>
          <Text style={styles.activeText}>
            Em chamada agora: {activeCall.type === 'VIDEO' ? 'Vídeo' : 'Voz'}
          </Text>
        </View>
      ) : null}

      {loading ? <ActivityIndicator color="#93c5fd" /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {calls.map((call) => (
        <CallCard key={call.id} call={call} onAnswer={handleAnswer} onEnd={handleEnd} />
      ))}

      {!loading && calls.length === 0 ? <Text style={styles.empty}>Nenhuma ligação ainda.</Text> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  cta: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  voice: { backgroundColor: '#0f766e' },
  video: { backgroundColor: '#1d4ed8' },
  ctaText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  activeBadge: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#374151',
    padding: 10,
    marginBottom: 12,
  },
  activeText: { color: '#a7f3d0', fontWeight: '600' },
  error: { color: '#fca5a5', marginBottom: 8 },
  empty: { color: '#94a3b8' },
});
