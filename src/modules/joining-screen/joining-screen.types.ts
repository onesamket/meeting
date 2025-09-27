export interface JoinScreenProps {
  getMeetingAndToken: (meetingId: string | null) => Promise<void>;
  setMode: (mode: 'SEND_AND_RECV' | 'SIGNALLING_ONLY') => void;
  username: string;
  setUsername: (name: string) => void;
}
