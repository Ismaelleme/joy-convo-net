export type CallType = 'VOICE' | 'VIDEO';
export type CallStatus = 'RINGING' | 'ONGOING' | 'ENDED' | 'MISSED' | 'DECLINED';

export type CallParticipant = {
  id: string;
  name: string;
  email: string;
};

export type CallSession = {
  id: string;
  type: CallType;
  status: CallStatus;
  callerId: string;
  calleeId: string;
  startedAt: string;
  answeredAt?: string;
  endedAt?: string;
  caller: CallParticipant;
  callee: CallParticipant;
};
