

/**
 * Represents the join state of the meeting.
 */
export type JoinState = 'IDLE' | 'JOINING' | 'JOINED' | 'LEFT';

/**
 * Represents the connection state of the meeting.
 *
 * - CONNECTING: SDK is connecting to the server
 * - CONNECTED: Meeting is fully connected
 * - RECONNECTING: SDK is trying to recover from a network issue
 * - DISCONNECTED: Meeting connection is closed
 *
 * Note: The underlying SDK may provide additional states (FAILED, CLOSING, CLOSED),
 * but only these four are exposed in the public API for simplicity.
 */
export type MeetingConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTED';

/**
 * Callback type for meeting events.
 */
export type MeetingEventCallback = (arg?: any) => void;

/**
 * Typesafe callback for custom meeting actions.
 */
export type MeetingActionCallback<T = void> = (payload: T) => void;

/**
 * Custom action payloads.
 */
export interface CutActionPayload {
  participantId: string;
  reason?: string;
}
export interface NextAuditionPayload {
  currentAuditionId: string;
  nextAuditionId: string;
}
export interface VoteActionPayload {
  participantId: string;
  vote: 'yes' | 'no' | 'maybe';
}
export interface CustomActionPayload {
  type: string;
  data?: any;
}

/**
 * Options for configuring the useRoom hook, including custom actions and connection state.
 */
export interface UseRoomOptions {
  /** Meeting ID to join */
  meetingId?: string;
  /** Called when the user leaves the meeting */
  onLeave?: () => void;
  /** Called when a participant joins */
  onParticipantJoined?: (p: any) => void;
  /** Called when a participant leaves */
  onParticipantLeft?: (p: any) => void;
  /** Called when the active speaker changes */
  onSpeakerChanged?: (id: string | null) => void;
  /** Called when the presenter changes */
  onPresenterChanged?: (id: string | null) => void;
  /** Called on meeting error */
  onError?: (error: any) => void;
  /** Called when recording starts */
  onRecordingStarted?: MeetingEventCallback;
  /** Called when recording stops */
  onRecordingStopped?: MeetingEventCallback;
  /** Custom: Called when an action is triggered */
  onAction?: MeetingActionCallback<CustomActionPayload>;
  /** Custom: Called when a cut action is triggered */
  onCut?: MeetingActionCallback<CutActionPayload>;
  /** Custom: Called when next audition is triggered */
  onNextAudition?: MeetingActionCallback<NextAuditionPayload>;
  /** Custom: Called when a vote is triggered */
  onVote?: MeetingActionCallback<VoteActionPayload>;
  /**
   * Called when the meeting connection state changes (CONNECTING, CONNECTED, RECONNECTING, DISCONNECTED)
   */
  onConnectionStateChanged?: (state: MeetingConnectionState) => void;
}

/**
 *
 * Internal: All possible SDK meeting connection states
 * https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/setup-call/meeting-connection-state-events
 *
 *
 */
export type SDKMeetingConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTED'
  | 'FAILED'
  | 'CLOSING'
  | 'CLOSED';
