import {type  Participant } from '../use-participant/use-participant';

/**
 * Types for participant roles. Extend as needed for your app.
 */
export type ParticipantRole =
  | 'host'
  | 'co-host'
  | 'moderator'
  | 'attendee'
  | 'viewer'
  | string;

/**
 * Waiting participant (lobby user) type.
 */
export interface WaitingParticipant {
  participantId: string;
  name: string;
  allow: () => void;
  deny: () => void;
}

/**
 * Options for configuring the useModeration hook, including all lobby and meeting events.
 */
export interface UseModerationOptions {
  onParticipantJoined?: (participant: Participant) => void;
  onParticipantLeft?: (participant: Participant) => void;
  onSpeakerChanged?: (activeSpeakerId: string | null) => void;
  onPresenterChanged?: (presenterId: string | null) => void;
  onMainParticipantChanged?: (participant: Participant) => void;
  onEntryRequested?: (waiting: WaitingParticipant) => void;
  onEntryResponded?: (
    participantId: string,
    decision: 'allowed' | 'denied'
  ) => void;
  onRecordingStarted?: () => void;
  onRecordingStopped?: () => void;
  onChatMessage?: (data: any) => void;
  onRoleChanged?: (participantId: string, newRole: ParticipantRole) => void;
  onParticipantKicked?: (participantId: string) => void;
}

/**
 * Result returned by the useModeration hook.
 */
export interface UseModerationResult {
  participants: Map<string, Participant>;
  localParticipant: Participant;
  getParticipant: (id: string) => Participant | undefined;
  getParticipantsByRole: (role: ParticipantRole) => Participant[];
  getHost: () => Participant | undefined;
  getCoHosts: () => Participant[];
  getAttendees: () => Participant[];
  isHost: (participant: Participant) => boolean;
  isCoHost: (participant: Participant) => boolean;
  isAttendee: (participant: Participant) => boolean;
  removeParticipant: (participantId: string) => void;
  muteParticipantMic: (participantId: string) => void;
  unmuteParticipantMic: (participantId: string) => void;
  enableParticipantWebcam: (participantId: string) => void;
  disableParticipantWebcam: (participantId: string) => void;
  pinParticipant: (
    participantId: string,
    type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE'
  ) => void;
  unpinParticipant: (
    participantId: string,
    type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE'
  ) => void;
  promoteParticipant: (participantId: string, newRole: ParticipantRole) => void;
  demoteParticipant: (participantId: string, newRole: ParticipantRole) => void;
  endMeeting: () => void;
  startRecording: () => void;
  stopRecording: () => void;
  /**
   * List of waiting participants (lobby users).
   */
  waitingParticipants: WaitingParticipant[];
  /**
   * Remove a waiting participant from the lobby list (after allow/deny).
   */
  removeWaitingParticipant: (participantId: string) => void;
  // Expose all event handlers for custom UI
  onParticipantJoined?: (participant: Participant) => void;
  onParticipantLeft?: (participant: Participant) => void;
  onSpeakerChanged?: (activeSpeakerId: string | null) => void;
  onPresenterChanged?: (presenterId: string | null) => void;
  onMainParticipantChanged?: (participant: Participant) => void;
  onEntryRequested?: (waiting: WaitingParticipant) => void;
  onEntryResponded?: (
    participantId: string,
    decision: 'allowed' | 'denied'
  ) => void;
  onRecordingStarted?: () => void;
  onRecordingStopped?: () => void;
  onChatMessage?: (data: any) => void;
}
