"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageCircle, Users } from "lucide-react"
import type { FC } from "react"
import type { MeetingHeaderProps } from "./meeting-header.types"

export const MeetingHeader: FC<MeetingHeaderProps> = ({
  onToggleChat,
  onToggleParticipants,
  participantCount,
}) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Meet.</span>
        </div>
      </div>


      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onToggleChat} className="text-gray-600 hover:text-gray-900">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>

        <Button variant="ghost" size="sm" onClick={onToggleParticipants} className="text-gray-600 hover:text-gray-900">
          <Users className="w-4 h-4 mr-2" />
          Attendees
          <Badge variant="secondary" className="ml-2 text-xs">
            {participantCount}
          </Badge>
        </Button>
      </div>
    </div>
  )
}
