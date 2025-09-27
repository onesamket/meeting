"use client"

import { useState, type FC } from "react"
import { FullScreenLoader } from "../../components/ui/loader"
import { useRoom } from "../../hooks/use-meeting"
import type { MeetingConnectionState } from "../../hooks/use-meeting/use-meeting.types"
import { MeetingHeader } from "../meeting-header"
import { MeetingView } from "../meeting-view/meeting-view"
import ChatSidebar from "../siderbar/chat/chat"
import type { ContainerProps } from "./container.types"
import { ControlBar } from "../control-bar"

export const Container: FC<ContainerProps> = ({ onMeetingLeave, onNavigateToDashboard }) => {
  const { joinState, error, connectionState, meetingId, participants, localParticipant } = useRoom({
    onLeave: onMeetingLeave,
    onError: (error: unknown) => {
      console.error("Meeting error:", error)
    },
    onConnectionStateChanged: (state: MeetingConnectionState) => {
      console.log("Connection state:", state)
    },
  })

  const [showChat, setShowChat] = useState(true)

  // Show beautiful loading screen if connecting or joining
  if (connectionState === "CONNECTING" || joinState === "JOINING") {
    return (
      <FullScreenLoader
        variant="ring"
        size="2xl"
        color="blue"
        text="Connecting to your meeting..."
        background="solid"
        className="bg-gradient-to-br from-blue-50 to-indigo-100"
      />
    )
  }

  const participantCount = participants.size

  return (
    <div className="h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto relative">
        <div className="m-4 bg-white rounded-2xl shadow-xl border-4 border-gray-900 overflow-hidden">
          <MeetingHeader
            onToggleChat={() => setShowChat(!showChat)}
            onToggleParticipants={() => {}}
            participantCount={participantCount}
            meetingId={meetingId}
            onLeave={onNavigateToDashboard}
          />

          <div className="flex h-[calc(100vh-120px)]">
            <div className="flex-1 p-4">
              <MeetingView
                meetingId={meetingId}
                onLeave={onNavigateToDashboard || (() => console.log("Navigate to dashboard"))}
              />
            </div>

            {showChat && (
              <div className="w-80 border-l border-gray-200 bg-gray-50">
                <ChatSidebar />
              </div>
            )}
          </div>
        </div>
        
        {/* Centered Control Bar with container-like styling */}
        <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2">
          <div className="bg-white rounded-2xl shadow-xl border-4 border-gray-900 ">
            <ControlBar onLeave={()=>{}} />
          </div>
        </div>
      </div>
    </div>
  )
}