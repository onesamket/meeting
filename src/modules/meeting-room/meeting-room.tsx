'use client';

import { MeetingProvider } from '@videosdk.live/react-sdk';
import { useState } from 'react';

import { JoinScreen } from '../joining-screen';
import { Container } from '../meeting-container/container';
import { authToken, createMeeting } from '@/api/sdk';
import { RoomProvider } from '@/providers';


export const MeetingRoom = () => {
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mode, setMode] = useState<'SEND_AND_RECV' | 'SIGNALLING_ONLY'>(
    'SEND_AND_RECV'
  );
  const [username, setUsername] = useState<string>('');

  const getMeetingAndToken = async (id: string | null) => {
    try {
      // First, ensure we have a valid token
      const validToken = authToken;
      if (!validToken) {
        throw new Error('Failed to get auth token');
      }
      setToken(validToken);

      // Then create or validate meeting
      let finalMeetingId: string;
      if (id) {
        // TODO: Add meeting validation here if needed
        finalMeetingId = id;
      } else {
        // Create new meeting
        finalMeetingId = await createMeeting({ token: validToken });
      }

      if (!finalMeetingId) {
        throw new Error('Failed to get meeting ID');
      }

      setMeetingId(finalMeetingId);
    } catch (error) {
      console.error('Failed to setup meeting:', error);
      throw error;
    }
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
    // Don't clear token as it might be reused
  };

  const actualToken = token || authToken;
  return actualToken && meetingId ? (
    <MeetingProvider
      config={{
        meetingId,
        debugMode: true,
        micEnabled: true,
        webcamEnabled: true,
        name: username || 'Guest',
        mode
      }}
      
      token={actualToken}
      joinWithoutUserInteraction={true}
    >
      <RoomProvider
        controlBarConfig={{
          mic: true,
          cam: true,
          screenShare: true,
          chat: true,
          raiseHand: false,
          participants: true,
          settings: true,
          captions: false,
          recording: true,
          more: true
        }}
        meetingId={meetingId}
    
      >
        <Container
          meetingId={meetingId}
          onMeetingLeave={onMeetingLeave}
          onNavigateToDashboard={() => {}}
        />
      </RoomProvider>
    </MeetingProvider>
  ) : (
    <JoinScreen
      getMeetingAndToken={getMeetingAndToken}
      setMode={setMode}
      username={username}
      setUsername={setUsername}
    />
  );
};

export default MeetingRoom;
