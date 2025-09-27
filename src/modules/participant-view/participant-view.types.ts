import type { Participant } from "@videosdk.live/react-sdk/dist/types/participant";


export interface ParticipantViewProps {
  participant: Participant;
  isActiveSpeaker: boolean;
}

export interface VideoSDKTrack {
  track: MediaStreamTrack;
}

export type MediaRef = React.RefObject<HTMLMediaElement | null>;
