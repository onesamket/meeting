'use client';

import { useParticipant } from '@videosdk.live/react-sdk';
import { MicOff } from 'lucide-react';
import { useCallback, useEffect, useRef, type FC } from 'react';

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
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }, [getDisplayName]);

  const getAvatarColor = useCallback((): string => {
    const name = getDisplayName();
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600', 
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
    ];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
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
        <div className={`flex h-full items-center justify-center ${getAvatarColor()}`}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl font-bold text-white">{getInitials()}</span>
            </div>
            <div className="text-white/80 text-sm font-medium">
              {getDisplayName()}
            </div>
          </div>
        </div>
      )}      
      {/* Microphone Status Indicator */}
      <div className="absolute bottom-2 right-2">
        <div className={`rounded-full p-1 ${
          !micOn && 'bg-red-500'
        }`}>
          {!micOn&& (
            <MicOff className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
    </div>
  );
};
