import { useParticipant as useSDKParticipant } from '@videosdk.live/react-sdk';
import type { Participant } from '@videosdk.live/react-sdk/dist/types/participant';
import { useCallback, useMemo } from 'react';
import type{
  UseParticipantOptions,
  UseParticipantResult
} from './use-participant.types';

/**
 * useParticipant hook for VideoSDK meetings.
 *
 * @param participantId - The ID of the participant to observe/control.
 * @param options - Optional event callbacks.
 * @returns State and controls for the participant.
 */
export function useParticipant(
  participantId: string,
  options: UseParticipantOptions = {}
): UseParticipantResult {
  // Get participant state and controls from VideoSDK
  const sdk = useSDKParticipant(participantId, {
    onStreamEnabled: options.onStreamEnabled,
    onStreamDisabled: options.onStreamDisabled,
    onMediaStatusChanged: options.onMediaStatusChanged,
    onVideoQualityChanged: options.onVideoQualityChanged,
    onStreamPaused: options.onStreamPaused,
    onStreamResumed: options.onStreamResumed
  });

  // Memoize participant object
  const participant = useMemo<Participant | undefined>(
    () => sdk?.participant,
    [sdk]
  );

  // Streams
  const micStream = useMemo(() => {
    if (sdk?.micStream) {
      const stream = new MediaStream();
      stream.addTrack(sdk.micStream.track);
      return stream;
    }
    return null;
  }, [sdk?.micStream]);

  const webcamStream = useMemo(() => {
    if (sdk?.webcamStream) {
      const stream = new MediaStream();
      stream.addTrack(sdk.webcamStream.track);
      return stream;
    }
    return null;
  }, [sdk?.webcamStream]);

  const screenShareStream = useMemo(() => {
    if (sdk?.screenShareStream) {
      const stream = new MediaStream();
      stream.addTrack(sdk.screenShareStream.track);
      return stream;
    }
    return null;
  }, [sdk?.screenShareStream]);

  // Controls (only available for local participant or if allowed by SDK)
  const enableMic = useCallback(() => sdk?.enableMic?.(), [sdk]);
  const disableMic = useCallback(() => sdk?.disableMic?.(), [sdk]);
  const enableWebcam = useCallback(() => sdk?.enableWebcam?.(), [sdk]);
  const disableWebcam = useCallback(() => sdk?.disableWebcam?.(), [sdk]);
  const pin = useCallback(
    (type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE') => sdk?.pin?.(type),
    [sdk]
  );
  const unpin = useCallback(
    (type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE') => sdk?.unpin?.(type),
    [sdk]
  );
  const setQuality = useCallback(
    (quality: 'low' | 'med' | 'high') => sdk?.setQuality?.(quality),
    [sdk]
  );
  const setScreenShareQuality = useCallback(
    (quality: 'low' | 'med' | 'high') => sdk?.setScreenShareQuality?.(quality),
    [sdk]
  );
  const setViewPort = useCallback(
    (width: number, height: number) => sdk?.setViewPort?.(width, height),
    [sdk]
  );
  const remove = useCallback(() => sdk?.remove?.(), [sdk]);
  const captureImage = useCallback(
    (opts?: { width?: number; height?: number }) =>
      sdk?.captureImage?.(opts ?? {}),
    [sdk]
  );
  const getShareAudioStats = useCallback(
    () => sdk?.getShareAudioStats?.(),
    [sdk]
  );
  const getAudioStats = useCallback(() => sdk?.getAudioStats?.(), [sdk]);
  const getVideoStats = useCallback(() => sdk?.getVideoStats?.(), [sdk]);
  const getShareStats = useCallback(() => sdk?.getShareStats?.(), [sdk]);
  const consumeMicStreams = useCallback(
    () => sdk?.consumeMicStreams?.(),
    [sdk]
  );
  const consumeWebcamStreams = useCallback(
    () => sdk?.consumeWebcamStreams?.(),
    [sdk]
  );
  const stopConsumingMicStreams = useCallback(
    () => sdk?.stopConsumingMicStreams?.(),
    [sdk]
  );
  const stopConsumingWebcamStreams = useCallback(
    () => sdk?.stopConsumingWebcamStreams?.(),
    [sdk]
  );

  return {
    participant,
    isLocal: 'isLocal' in sdk ? sdk.isLocal : !!participant?.local,
    displayName: sdk.displayName,
    micOn: !!sdk.micOn,
    webcamOn: !!sdk.webcamOn,
    screenShareOn: !!sdk.screenShareOn,
    micStream,
    webcamStream,
    screenShareStream,
    pinState: sdk.pinState,
    mode: sdk.mode,
    enableMic,
    disableMic,
    enableWebcam,
    disableWebcam,
    pin,
    unpin,
    setQuality,
    setScreenShareQuality,
    setViewPort,
    remove,
    captureImage,
    getShareAudioStats,
    getAudioStats,
    getVideoStats,
    getShareStats,
    consumeMicStreams,
    consumeWebcamStreams,
    stopConsumingMicStreams,
    stopConsumingWebcamStreams
  };
}

/**
 * Utilities for working with VideoSDK participants.
 */
export function isLocalParticipant(participant?: Participant) {
  return !!participant?.local;
}
export function isMicOn(participant?: Participant) {
  return !!participant?.micOn;
}
export function isWebcamOn(participant?: Participant) {
  return !!participant?.webcamOn;
}
export function isScreenSharing(participantOrSdk: any) {
  return !!participantOrSdk?.screenShareOn;
}
export function getDisplayName(participant?: Participant) {
  return participant?.displayName ?? '';
}
export function getParticipantMode(participant?: Participant) {
  return participant?.mode ?? 'SEND_AND_RECV';
}
export function getPinState(participant?: Participant) {
  return participant?.pinState ?? { cam: false, share: false };
}
export type { Participant };

/**
 * ----------------------
 * Usage Example (React):
 * ----------------------
 *
 * import { useParticipant, isLocalParticipant, isMicOn, isWebcamOn, isScreenSharing, getDisplayName } from './use-participant';
 *
 * function ParticipantComponent({ participantId }) {
 *   const {
 *     participant,
 *     isLocal,
 *     displayName,
 *     micOn,
 *     webcamOn,
 *     screenShareOn,
 *     micStream,
 *     webcamStream,
 *     screenShareStream,
 *     enableMic,
 *     disableMic,
 *     enableWebcam,
 *     disableWebcam,
 *     pin,
 *     unpin,
 *     setQuality,
 *     remove,
 *     // ...other controls
 *   } = useParticipant(participantId, {
 *     onStreamEnabled: (stream) => console.log('Stream enabled:', stream),
 *     onMediaStatusChanged: ({ kind, newStatus }) => console.log(kind, 'status:', newStatus),
 *     // ...other event callbacks
 *   });
 *
 *   // Use state and controls
 *   // enableMic();
 *   // disableWebcam();
 *   // pin('CAM');
 *   // setQuality('high');
 *
 *   // Use utilities
 *   // isLocalParticipant(participant)
 *   // isMicOn(participant)
 *   // getDisplayName(participant)
 *
 *   // Render participant info
 *   // <div>{displayName} {isLocal ? '(You)' : ''} {micOn ? '🎤' : '��'}</div>
 * }
 */
