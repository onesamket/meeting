import { useRoomContext } from "@/providers";
import { useMeeting } from "@videosdk.live/react-sdk";
import { useCallback, useState } from "react";
import type { JoinState, MeetingConnectionState, SDKMeetingConnectionState, UseRoomOptions } from ".";

/**
 * Comprehensive VideoSDK meeting hook for managing meeting state, participants, controls, connection state, and custom actions.
 *
 * @param opts - Options for configuring the meeting hook
 * @returns Meeting state, controls, participants, utilities, connection state, and custom actions
 * https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/get-notified/meeting-events
 * https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/get-notified/participant-events
 * https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/get-notified/media-events
 * https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/get-notified/recording-events
 */

export function useRoom(opts: UseRoomOptions = {}) {
  // Always call useRoomContext at the top level
  const roomCtx = useRoomContext();
  // Use opts.meetingId if provided, otherwise use context
  const meetingId = opts.meetingId || roomCtx.meetingId;

  /**
   * State representing the join status of the meeting.
   */
  const [joinState, setJoinState] = useState<JoinState>("IDLE");
  /**
   * State for the last error encountered in the meeting.
   */
  const [error, setError] = useState<any>(null);
  /**
   * State for the current connection state of the meeting.
   */
  const [connectionState, setConnectionState] =
    useState<MeetingConnectionState>("CONNECTING");

  // Prepare event callbacks for useMeeting
  const callbacks = {
    onMeetingJoined: () => setJoinState("JOINED"),
    onMeetingLeft: () => {
      setJoinState("LEFT");
      opts.onLeave?.();
    },
    onParticipantJoined: opts.onParticipantJoined,
    onParticipantLeft: opts.onParticipantLeft,
    onSpeakerChanged: opts.onSpeakerChanged,
    onPresenterChanged: opts.onPresenterChanged,
    onError: (err: any) => {
      setError(err);
      opts.onError?.(err);
    },
    onRecordingStarted: opts.onRecordingStarted,
    onRecordingStopped: opts.onRecordingStopped,
    /**
     * Handles meeting connection state changes from VideoSDK.
     * Updates local state and calls the optional onConnectionStateChanged callback.
     * Only handles the four main states; others are ignored.
     */
    onMeetingStateChanged: ({
      state,
    }: {
      state: SDKMeetingConnectionState;
    }) => {
      if (
        state === "CONNECTING" ||
        state === "CONNECTED" ||
        state === "RECONNECTING" ||
        state === "DISCONNECTED"
      ) {
        setConnectionState(state);
        opts.onConnectionStateChanged?.(state);
      }
      // Ignore other states (FAILED, CLOSING, CLOSED)
    },
  };

  // useMeeting provides all meeting controls and state
  const meeting = useMeeting({
    ...callbacks,
  });

  // Destructure controls and state from meeting
  const {
    join,
    leave,
    end,
    participants,
    localParticipant,
    meetingId: sdkMeetingId,
    recordingState,
    startRecording,
    stopRecording,
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    enableWebcam,
    disableWebcam,
    unmuteMic,
    muteMic,
    // other controls
  } = meeting;

  // presenterId from meeting.meeting.activePresenterId
  const presenterId = meeting.presenterId;

  // Join meeting handler
  const joinMeeting = useCallback(() => {
    setJoinState("JOINING");
    join();
  }, [join]);

  // Leave meeting handler
  const leaveMeeting = useCallback(() => leave(), [leave]);
  // End meeting handler
  const endMeeting = useCallback(() => end(), [end]);


  return {
    // State
    joinState,
    error,
    connectionState,
    // Meeting controls
    joinMeeting,
    leaveMeeting,
    endMeeting,
    // Participants
    participants,
    localParticipant,
    // Meeting info
    meetingId,
    presenterId,
    // Recording
    recordingState,
    startRecording,
    stopRecording,
    // Media controls
    toggleMic,
    toggleWebcam,
    toggleScreenShare,
    enableWebcam,
    disableWebcam,
    unmuteMic,
    muteMic,

 
  };
}
