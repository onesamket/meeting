"use client"

import { useMemo, type FC } from "react"
import { useRoom } from "../../hooks/use-meeting"
import { ParticipantView } from "../participant-view"
import type { MeetingViewProps } from "./meeting-view.types"

export const MeetingView: FC<MeetingViewProps> = ({ onLeave }) => {
  const { participants, localParticipant } = useRoom()

  const allParticipants = useMemo(() => {
    const remoteParticipants = Array.from(participants.values()).filter((p) => !p.local)
    const local = localParticipant
    return local ? [local, ...remoteParticipants] : remoteParticipants
  }, [participants, localParticipant])

  const getLayoutClass = (participantCount: number) => {
    switch (participantCount) {
      case 1:
        return "flex justify-center items-center"
      case 2:
        return "grid grid-cols-2 gap-4"
      case 3:
        return "grid grid-cols-2 gap-4"
      case 4:
        return "grid grid-cols-2 gap-4"
      case 5:
      case 6:
        return "grid grid-cols-3 gap-4"
      case 7:
      case 8:
      case 9:
        return "grid grid-cols-3 gap-4"
      default:
        return "grid grid-cols-4 gap-4"
    }
  }

  const getParticipantClass = (participantCount: number, index: number) => {
    if (participantCount === 1) {
      return "w-full max-w-2xl"
    }
    
    if (participantCount === 2) {
      return "aspect-video"
    }
    
    if (participantCount <= 4) {
      return "aspect-video"
    }
    
    if (participantCount <= 9) {
      return "aspect-video"
    }
    
    return "aspect-video"
  }

  return (
    <div className="relative h-full">
      <div className={`h-full ${getLayoutClass(allParticipants.length)}`}>
        {allParticipants.map((participant, index) => (
          <div key={participant.id} className={getParticipantClass(allParticipants.length, index)}>
            <ParticipantView 
              participant={participant} 
              isActiveSpeaker={index === 0} 
            />
          </div>
        ))}
      </div>

  
    </div>
  )
}
