import { useMeeting } from '@videosdk.live/react-sdk';
import type { Participant } from '@videosdk.live/react-sdk/dist/types/participant';
import { useCallback, useRef, useState } from 'react';
import type {
  ParticipantRole,
  UseModerationOptions,
  UseModerationResult,
  WaitingParticipant
} from '.';

/**
 * useModeration hook for VideoSDK meetings, with full lobby management and all events.
 *
 * @param options - Optional event callbacks
 * @returns Moderation state, controls, lobby, and event handlers
 */
export function useModeration(
  options: UseModerationOptions = {}
): UseModerationResult {
  const [waitingParticipants, setWaitingParticipants] = useState<
    WaitingParticipant[]
  >([]);
  const waitingRef = useRef(waitingParticipants);
  waitingRef.current = waitingParticipants;

  const removeWaitingParticipant = useCallback((participantId: string) => {
    setWaitingParticipants((prev) =>
      prev.filter((p) => p.participantId !== participantId)
    );
  }, []);

  const { participants, localParticipant, end, startRecording, stopRecording } =
    useMeeting({
      onParticipantJoined: options.onParticipantJoined,
      onParticipantLeft: options.onParticipantLeft,
      onSpeakerChanged: options.onSpeakerChanged,
      onPresenterChanged: options.onPresenterChanged,
      onMainParticipantChanged: options.onMainParticipantChanged,
      onEntryRequested: (data) => {
        const { participantId, name, allow, deny } = data;
        const waiting: WaitingParticipant = {
          participantId,
          name,
          allow: () => {
            allow();
            removeWaitingParticipant(participantId);
          },
          deny: () => {
            deny();
            removeWaitingParticipant(participantId);
          }
        };
        setWaitingParticipants((prev) => [...prev, waiting]);
        options.onEntryRequested?.(waiting);
      },
      onEntryResponded: ({ participantId, decision }) => {
        removeWaitingParticipant(participantId);
        // Ensure decision is 'allowed' | 'denied' for type safety
        const safeDecision =
          decision === 'allowed' || decision === 'denied' ? decision : 'denied';
        options.onEntryResponded?.(participantId, safeDecision);
      },
      onRecordingStarted: options.onRecordingStarted,
      onRecordingStopped: options.onRecordingStopped,

    });

  // Get a participant by ID
  const getParticipant = useCallback(
    (id: string) => participants.get(id),
    [participants]
  );

  // Get all participants with a specific role (assumes role is in participant.metaData.role)
  const getParticipantsByRole = useCallback(
    (role: ParticipantRole) =>
      Array.from(participants.values()).filter(
        (p) => (p.metaData as any)?.role === role
      ),
    [participants]
  );

  // Get the host participant
  const getHost = useCallback(
    () => getParticipantsByRole('host')[0],
    [getParticipantsByRole]
  );
  // Get all co-hosts
  const getCoHosts = useCallback(
    () => getParticipantsByRole('co-host'),
    [getParticipantsByRole]
  );
  // Get all attendees
  const getAttendees = useCallback(
    () => getParticipantsByRole('attendee'),
    [getParticipantsByRole]
  );

  // Role checkers
  const isHost = useCallback(
    (p: Participant) => (p.metaData as any)?.role === 'host',
    []
  );
  const isCoHost = useCallback(
    (p: Participant) => (p.metaData as any)?.role === 'co-host',
    []
  );
  const isAttendee = useCallback(
    (p: Participant) => (p.metaData as any)?.role === 'attendee',
    []
  );

  // Remove/kick a participant
  const removeParticipant = useCallback(
    (participantId: string) => {
      const p = participants.get(participantId);
      p?.remove();
      options.onParticipantKicked?.(participantId);
    },
    [participants, options]
  );

  // Mute/unmute mic
  const muteParticipantMic = useCallback(
    (participantId: string) => {
      const p = participants.get(participantId);
      p?.disableMic();
    },
    [participants]
  );
  const unmuteParticipantMic = useCallback(
    (participantId: string) => {
      const p = participants.get(participantId);
      p?.enableMic();
    },
    [participants]
  );

  // Enable/disable webcam
  const enableParticipantWebcam = useCallback(
    (participantId: string) => {
      const p = participants.get(participantId);
      p?.enableWebcam();
    },
    [participants]
  );
  const disableParticipantWebcam = useCallback(
    (participantId: string) => {
      const p = participants.get(participantId);
      p?.disableWebcam();
    },
    [participants]
  );

  // Pin/unpin
  const pinParticipant = useCallback(
    (participantId: string, type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE') => {
      const p = participants.get(participantId);
      p?.pin(type);
    },
    [participants]
  );
  const unpinParticipant = useCallback(
    (participantId: string, type: 'SHARE_AND_CAM' | 'CAM' | 'SHARE') => {
      const p = participants.get(participantId);
      p?.unpin(type);
    },
    [participants]
  );

  // Promote/demote (set role in metaData, if your backend supports it)
  const promoteParticipant = useCallback(
    (participantId: string, newRole: ParticipantRole) => {
      options.onRoleChanged?.(participantId, newRole);
    },
    [options]
  );
  const demoteParticipant = useCallback(
    (participantId: string, newRole: ParticipantRole) => {
      options.onRoleChanged?.(participantId, newRole);
    },
    [options]
  );

  // End meeting
  const endMeeting = useCallback(() => end(), [end]);

  // Start/stop recording
  const startRec = useCallback(() => startRecording(), [startRecording]);
  const stopRec = useCallback(() => stopRecording(), [stopRecording]);

  return {
    participants,
    localParticipant,
    getParticipant,
    getParticipantsByRole,
    getHost,
    getCoHosts,
    getAttendees,
    isHost,
    isCoHost,
    isAttendee,
    removeParticipant,
    muteParticipantMic,
    unmuteParticipantMic,
    enableParticipantWebcam,
    disableParticipantWebcam,
    pinParticipant,
    unpinParticipant,
    promoteParticipant,
    demoteParticipant,
    endMeeting,
    startRecording: startRec,
    stopRecording: stopRec,
    waitingParticipants,
    removeWaitingParticipant,
    // Expose event handlers for custom UI
    onParticipantJoined: options.onParticipantJoined,
    onParticipantLeft: options.onParticipantLeft,
    onSpeakerChanged: options.onSpeakerChanged,
    onPresenterChanged: options.onPresenterChanged,
    onMainParticipantChanged: options.onMainParticipantChanged,
    onEntryRequested: options.onEntryRequested,
    onEntryResponded: options.onEntryResponded,
    onRecordingStarted: options.onRecordingStarted,
    onRecordingStopped: options.onRecordingStopped,
    onChatMessage: options.onChatMessage
  };
}

/**
 * ----------------------
 * Usage Example (React):
 * ----------------------
 *
 * import { useModeration } from './use-moderation';
 *
 * function ModeratorPanel() {
 *   const {
 *     participants,
 *     waitingParticipants,
 *     getHost,
 *     getCoHosts,
 *     getAttendees,
 *     removeParticipant,
 *     muteParticipantMic,
 *     promoteParticipant,
 *     endMeeting,
 *     onEntryRequested,
 *     // ...other controls and event handlers
 *   } = useModeration({
 *     onEntryRequested: (waiting) => console.log('Entry requested:', waiting),
 *     onEntryResponded: (id, decision) => console.log('Entry responded:', id, decision),
 *     onParticipantJoined: (p) => console.log('Joined:', p),
 *     onParticipantLeft: (p) => console.log('Left:', p),
 *     // ...other event callbacks
 *   });
 *
 *   // Render waiting participants (lobby)
 *   // waitingParticipants.map(w => (
 *   //   <div key={w.participantId}>
 *   //     {w.name} <button onClick={w.allow}>Allow</button> <button onClick={w.deny}>Deny</button>
 *   //   </div>
 *   // ));
 * }
 */
