import { CallSession, CallType } from '../types/call';
import { apiFetch } from './api';

export function listUserCalls(userId: string) {
  return apiFetch<CallSession[]>(`/calls/user/${userId}`);
}

export function createCall(callerId: string, calleeId: string, type: CallType) {
  return apiFetch<CallSession>('/calls', {
    method: 'POST',
    body: JSON.stringify({ callerId, calleeId, type }),
  });
}

export function answerCall(callId: string) {
  return apiFetch<CallSession>(`/calls/${callId}/answer`, {
    method: 'PATCH',
  });
}

export function endCall(callId: string, reason: 'ENDED' | 'MISSED' | 'DECLINED' = 'ENDED') {
  return apiFetch<CallSession>(`/calls/${callId}/end`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  });
}
