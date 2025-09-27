import { useTranscription as useSDKTranscription } from '@videosdk.live/react-sdk';
import { useState } from 'react';
import type{
  TranscriptionState,
  TranscriptionText,
  UseTranscriptionOptions,
  UseTranscriptionResult
} from './use-transcription.types';

/**
 * useTranscription hook for VideoSDK meetings (real-time transcription & summary).
 *
 * @param options - Optional event callbacks
 * @returns Transcription controls, state, and last text
 */
export function useTranscription(
  options: UseTranscriptionOptions = {}
): UseTranscriptionResult {
  const [transcriptionState, setTranscriptionState] =
    useState<TranscriptionState | null>(null);
  const [lastTranscriptionText, setLastTranscriptionText] =
    useState<TranscriptionText | null>(null);

  const { startTranscription, stopTranscription } = useSDKTranscription({
    onTranscriptionStateChanged: (data) => {
      setTranscriptionState(data);
      options.onTranscriptionStateChanged?.(data);
    },
    onTranscriptionText: (data) => {
      setLastTranscriptionText(data);
      options.onTranscriptionText?.(data);
    }
  });

  return {
    startTranscription,
    stopTranscription,
    transcriptionState,
    lastTranscriptionText
  };
}

/**
 * ----------------------
 * Usage Example (React):
 * ----------------------
 *
 * import { useTranscription } from './use-transcription';
 *
 * function TranscriptionPanel() {
 *   const {
 *     startTranscription,
 *     stopTranscription,
 *     transcriptionState,
 *     lastTranscriptionText,
 *   } = useTranscription({
 *     onTranscriptionStateChanged: (data) => console.log('Transcription state:', data),
 *     onTranscriptionText: (data) => console.log('Transcription text:', data),
 *   });
 *
 *   // Start transcription
 *   // startTranscription({ webhookUrl: 'https://www.example.com', summary: { enabled: true, prompt: 'Write summary...' } });
 *
 *   // Stop transcription
 *   // stopTranscription();
 *
 *   // Render last transcription text
 *   // <div>{lastTranscriptionText?.participantName}: {lastTranscriptionText?.text}</div>
 * }
 */
