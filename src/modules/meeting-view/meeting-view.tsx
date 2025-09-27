"use client"

import { type FC, useState, useMemo } from "react"
import { useRoom } from "../../hooks/use-meeting"
import type { MeetingViewProps } from "./meeting-view.types"
import { ParticipantView } from "../participant-view"
import { ControlBar } from "../control-bar"

export const MeetingView: FC<MeetingViewProps> = ({ onLeave }) => {
  const { participants, localParticipant } = useRoom()
  const [layout, setLayout] = useState<"grid" | "speaker">("speaker")

  // Get participant objects
  const local = localParticipant
  const remoteParticipants = useMemo(() => Array.from(participants.values()).filter((p) => !p.local), [participants])

  return (
    <div className="relative h-full">
      <div className="h-full flex gap-4">
        {/* First participant (Emma Watson equivalent) */}
        {remoteParticipants[0] && (
          <div className="flex-1">
            <ParticipantView participant={remoteParticipants[0]} isActiveSpeaker={true} />
          </div>
        )}

        {/* Second participant (Rick Grimes equivalent) */}
        {remoteParticipants[1] && (
          <div className="flex-1">
            <ParticipantView participant={remoteParticipants[1]} isActiveSpeaker={true} />
          </div>
        )}

        {/* If only one remote participant, show local participant */}
        {remoteParticipants.length === 1 && local && (
          <div className="flex-1">
            <ParticipantView participant={local} isActiveSpeaker={true} />
          </div>
        )}

        {/* If no remote participants, show local participant centered */}
        {remoteParticipants.length === 0 && local && (
          <div className="flex-1 max-w-md mx-auto">
            <ParticipantView participant={local} isActiveSpeaker={true} />
          </div>
        )}
      </div>

      <ControlBar onLeave={onLeave} />
    </div>
  )
}
