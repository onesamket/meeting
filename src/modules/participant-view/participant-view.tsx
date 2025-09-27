'use client';

import { Avatar } from '@/components/ui/avatar';
import { useParticipant } from '@videosdk.live/react-sdk';
import { type FC, useCallback, useEffect, useRef } from 'react';

import type {
  MediaRef,
  ParticipantViewProps,
  VideoSDKTrack
} from './participant-view.types';

export const ParticipantView: FC<ParticipantViewProps> = ({
  participant,
  isActiveSpeaker
}) => {
  const micRef = useRef<HTMLAudioElement | null>(null);
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const screenShareRef = useRef<HTMLVideoElement | null>(null);

  const {
    webcamStream,
    micStream,
    webcamOn,
    micOn,
    isLocal,
    displayName,
    screenShareStream,
    screenShareOn
  } = useParticipant(participant.id);

  /* Utility to attach/unattach a stream to ref */
  const attachTrack = useCallback(
    (
      ref: MediaRef,
      streamOn: boolean,
      trackStream: VideoSDKTrack | null
    ): void => {
      if (!ref.current) return;

      if (streamOn && trackStream?.track) {
        try {
          const mediaStream = new MediaStream();
          mediaStream.addTrack(trackStream.track);
          ref.current.srcObject = mediaStream;
          ref.current.play().catch((error: Error) => {
            console.error('Media playback error:', error);
          });
        } catch (error) {
          console.error('Error attaching track:', error);
        }
      } else {
        ref.current.srcObject = null;
      }
    },
    []
  );

  useEffect(() => {
    attachTrack(micRef, micOn, micStream);
  }, [micStream, micOn, attachTrack]);

  useEffect(() => {
    attachTrack(webcamRef, webcamOn, webcamStream);
  }, [webcamStream, webcamOn, attachTrack]);

  useEffect(() => {
    attachTrack(screenShareRef, screenShareOn, screenShareStream);
  }, [screenShareStream, screenShareOn, attachTrack]);

  const getDisplayName = useCallback((): string => {
    return displayName || 'Unknown User';
  }, [displayName]);

  const getInitials = useCallback((): string => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  }, [getDisplayName]);

  const getParticipantLabel = useCallback((): string => {
    const name = getDisplayName();
    return isLocal ? `${name} (You)` : name;
  }, [getDisplayName, isLocal]);

  return (
    <div
      className={`relative aspect-video rounded-lg border-2 bg-gray-800 ${
        isActiveSpeaker ? 'border-blue-500 shadow-lg' : 'border-transparent'
      }`}
    >
      {screenShareOn ? (
        <video
          ref={screenShareRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-contain"
        />
      ) : webcamOn ? (
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-700">
          <Avatar className="h-20 w-20 text-2xl">{getInitials()}</Avatar>
        </div>
      )}
      <div className="absolute bottom-2 left-2 flex flex-col gap-1">
        <span className="rounded bg-black/60 px-2 py-1 font-semibold text-white">
          {getParticipantLabel()}
        </span>
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
    </div>
  );
};
