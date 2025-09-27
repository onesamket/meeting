'use client';

import { useParticipant } from '@videosdk.live/react-sdk';
import { Mic, MicOff, Pin, PinOff } from 'lucide-react';
import { useCallback, useEffect, useRef, type FC, useState } from 'react';

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
  const [isPinned, setIsPinned] = useState(false);
  const [showControls, setShowControls] = useState(false);

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
    // Google Meet style subtle colors
    const colors = [
      'bg-gradient-to-br from-slate-500 to-slate-600',
      'bg-gradient-to-br from-gray-500 to-gray-600', 
      'bg-gradient-to-br from-zinc-500 to-zinc-600',
      'bg-gradient-to-br from-neutral-500 to-neutral-600',
      'bg-gradient-to-br from-stone-500 to-stone-600',
      'bg-gradient-to-br from-blue-400 to-blue-500',
      'bg-gradient-to-br from-indigo-400 to-indigo-500',
      'bg-gradient-to-br from-violet-400 to-violet-500',
    ];
    const hash = name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }, [getDisplayName]);



  return (
    <div
      className={`relative aspect-video rounded-lg border-2 bg-gray-800 group ${
        isActiveSpeaker ? 'border-blue-500 shadow-lg' : 'border-transparent'
      } ${isPinned ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {screenShareOn ? (
        <video
          ref={screenShareRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-contain  rounded-lg "
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
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <span className="text-2xl font-semibold text-white">{getInitials()}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Pin Button */}
      {showControls && !isLocal && (
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`rounded-full p-1.5 transition-all duration-200 ${
              isPinned 
                ? 'bg-yellow-500 text-white' 
                : 'bg-black/60 text-white hover:bg-black/80'
            }`}
            title={isPinned ? 'Unpin participant' : 'Pin participant'}
          >
            {isPinned ? (
              <PinOff className="w-3 h-3" />
            ) : (
              <Pin className="w-3 h-3" />
            )}
          </button>
        </div>
      )}
      
      {/* Microphone Status Indicator */}
      <div className="absolute bottom-2 right-2">
        <div className={`rounded-full p-1 ${
          micOn ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {micOn ? (
            <Mic className="w-3 h-3 text-white" />
          ) : (
            <MicOff className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      <audio ref={micRef} autoPlay playsInline muted={isLocal} />
    </div>
  );
};
