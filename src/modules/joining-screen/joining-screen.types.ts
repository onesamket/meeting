export interface DeviceConfig {
  camera: {
    deviceId: string;
    enabled: boolean;
  };
  microphone: {
    deviceId: string;
    enabled: boolean;
  };
  speaker: {
    deviceId: string;
  };
}

export interface JoinScreenProps {
  getMeetingAndToken: (meetingId: string | null) => Promise<void>;
  setMode: (mode: 'SEND_AND_RECV' | 'SIGNALLING_ONLY') => void;
  username: string;
  setUsername: (name: string) => void;
  deviceConfig?: DeviceConfig;
  setDeviceConfig?: (config: DeviceConfig) => void;
  meetingId?: string | null;
  onShareLink?: (meetingId: string) => void;
}
