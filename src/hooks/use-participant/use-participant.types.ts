import { Participant } from './use-participant';

/**
 * Options for configuring the useParticipant hook.
 * Only events supported by the VideoSDK useParticipant hook are available.
 * https://docs.videosdk.live/react/api/sdk-reference/use-participant/introduction
 *
 */
export interface UseParticipantOptions {
  /**
   * Called when a stream is enabled for this participant.
   */
  onStreamEnabled?: (stream: any) => void;
  /**
   * Called when a stream is disabled for this participant.
   */
  onStreamDisabled?: (stream: any) => void;
  /**
   * Called when the participant's media status changes (mic/webcam on/off).
   */
  onMediaStatusChanged?: (args: {
    kind: 'audio' | 'video';
    peerId: string;
    newStatus: boolean;
  }) => void;
  /**
   * Called when the participant's video quality changes.
   */
  onVideoQualityChanged?: (args: {
    peerId: string;
    prevQuality: 'low' | 'med' | 'high';
    currentQuality: 'low' | 'med' | 'high';
  }) => void;
  /**
   * Called when a stream is paused for this participant.
   */
  onStreamPaused?: (args: { kind: 'video'; reason: string }) => void;
  /**
   * Called when a stream is resumed for this participant.
   */
  onStreamResumed?: (args: { kind: 'video'; reason: string }) => void;
  // TODO: Add more events if SDK exposes them in the future
}

/**
 * State and controls for a participant in a VideoSDK meeting.
 */
export interface UseParticipantResult {
  /** The participant object */
  participant: Participant | undefined;
  /** Is this the local participant? */
  isLocal: boolean;
  /** Display name */
  displayName: string | undefined;
  /** Mic state */
  micOn: boolean;
  /** Webcam state */
  webcamOn: boolean;
  /** Screen share state */
  screenShareOn: boolean;
  /** Streams (mic/webcam/screenshare) */
  micStream: MediaStream | null;
  webcamStream: MediaStream | null;
  screenShareStream: MediaStream | null;
  /** Pin state */
  pinState: { cam: boolean; share: boolean };
  /** Participant mode */
  mode: 'SEND_AND_RECV' | 'SIGNALLING_ONLY' | 'RECV_ONLY';
  /**
   * Controls (only available for local participant or if allowed by SDK):
   */
  enableMic: () => void;
  disableMic: () => void;
  enableWebcam: () => void;
  disableWebcam: () => void;
  pin: (type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE') => void;
  unpin: (type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE') => void;
  setQuality: (quality: 'low' | 'med' | 'high') => void;
  setScreenShareQuality: (quality: 'low' | 'med' | 'high') => void;
  setViewPort: (width: number, height: number) => void;
  remove: () => void;
  captureImage: (opts?: {
    width?: number;
    height?: number;
  }) => Promise<string | null>;
  getShareAudioStats: () => Promise<any>;
  getAudioStats: () => Promise<any>;
  getVideoStats: () => Promise<any>;
  getShareStats: () => Promise<any>;
  consumeMicStreams: () => void;
  consumeWebcamStreams: () => void;
  stopConsumingMicStreams: () => void;
  stopConsumingWebcamStreams: () => void;
}
