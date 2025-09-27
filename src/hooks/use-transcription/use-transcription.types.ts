import { Constants } from '@videosdk.live/react-sdk';

/**
 * Types for transcription state and events.
 */
export type TranscriptionStatus =
  | typeof Constants.transcriptionEvents.TRANSCRIPTION_STARTING
  | typeof Constants.transcriptionEvents.TRANSCRIPTION_STARTED
  | typeof Constants.transcriptionEvents.TRANSCRIPTION_STOPPING
  | typeof Constants.transcriptionEvents.TRANSCRIPTION_STOPPED;

export interface TranscriptionState {
  status: TranscriptionStatus;
  id: string;
}

export interface TranscriptionText {
  participantId: string;
  participantName: string;
  text: string;
  timestamp: number;
  type: 'realtime';
}

export interface UseTranscriptionOptions {
  onTranscriptionStateChanged?: (data: TranscriptionState) => void;
  onTranscriptionText?: (data: TranscriptionText) => void;
}

export interface UseTranscriptionResult {
  startTranscription: (config: {
    webhookUrl?: string;
    summary?: { enabled: boolean; prompt?: string };
    language?: string;
    [key: string]: any;
  }) => void;
  stopTranscription: () => void;
  transcriptionState: TranscriptionState | null;
  lastTranscriptionText: TranscriptionText | null;
}
