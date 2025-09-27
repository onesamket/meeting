"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRoom } from "@/hooks/use-meeting"
import {
  Check,
  Clock,
  Copy,
  MessageCircle,
  Mic,
  MicOff,
  MoreVertical,
  Share2,
  Users,
  Video,
  VideoOff
} from "lucide-react"
import { useState, type FC } from "react"
import type { MeetingHeaderProps } from "./meeting-header.types"

export const MeetingHeader: FC<MeetingHeaderProps> = ({
  onToggleChat,
  onToggleParticipants,
  participantCount,
}) => {
  const { meetingId, recordingState, toggleMic, toggleWebcam, localParticipant } = useRoom()
  const { toast } = useToast()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{meetingLink: boolean, meetingId: boolean}>({
    meetingLink: false,
    meetingId: false
  })

  const handleShareMeeting = async () => {
    const meetingUrl = `${window.location.origin}${window.location.pathname}?meeting=${meetingId}`
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my meeting',
          text: 'Join my video meeting',
          url: meetingUrl
        })
      } else {
        await navigator.clipboard.writeText(meetingUrl)
        setCopiedStates(prev => ({ ...prev, meetingLink: true }))
        toast({
          title: "Meeting link copied!",
          description: "The meeting link has been copied to your clipboard.",
        })
        setTimeout(() => {
          setCopiedStates(prev => ({ ...prev, meetingLink: false }))
        }, 2000)
      }
    } catch (error) {
      console.error('Error sharing meeting:', error)
      toast({
        title: "Error sharing meeting",
        description: "Failed to share the meeting link. Please try again.",
        variant: "destructive"
      })
    }
    setShowShareMenu(false)
  }

  const handleCopyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(meetingId || '')
      setCopiedStates(prev => ({ ...prev, meetingId: true }))
      toast({
        title: "Meeting ID copied!",
        description: "The meeting ID has been copied to your clipboard.",
      })
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, meetingId: false }))
      }, 2000)
    } catch (error) {
      console.error('Error copying meeting ID:', error)
      toast({
        title: "Error copying meeting ID",
        description: "Failed to copy the meeting ID. Please try again.",
        variant: "destructive"
      })
    }
    setShowShareMenu(false)
  }

  const handleToggleMic = () => {
    toggleMic()
  }

  const handleToggleWebcam = () => {
    toggleWebcam()
  }

  const formatMeetingId = (id: string) => {
    if (!id) return ''
    // Format meeting ID as XXX-XXX-XXX for better readability
    return id.replace(/(.{3})/g, '$1-').replace(/-$/, '')
  }

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">Meet.</span>
        </div>

        {/* Meeting ID Display */}
        {meetingId && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono text-gray-700">
              {formatMeetingId(meetingId)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyMeetingId}
              className="p-1 h-6 w-6 hover:bg-gray-200"
            >
              {copiedStates.meetingId ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </div>
        )}

        {/* Recording Status */}
        {recordingState && (
          <Badge variant="destructive" className="animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
            Recording
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Media Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleMic}
            className={`p-2 ${localParticipant?.micOn ? 'text-green-600' : 'text-red-600'}`}
          >
            {localParticipant?.micOn ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleWebcam}
            className={`p-2 ${localParticipant?.webcamOn ? 'text-green-600' : 'text-red-600'}`}
          >
            {localParticipant?.webcamOn ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Share Meeting */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          {showShareMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Share meeting</h3>
                
                <div className="space-y-3">
                  <Button
                    onClick={handleShareMeeting}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    {copiedStates.meetingLink ? (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Share2 className="w-4 h-4 mr-2" />
                    )}
                    Copy meeting link
                  </Button>
                  
                  <Button
                    onClick={handleCopyMeetingId}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    {copiedStates.meetingId ? (
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 mr-2" />
                    )}
                    Copy meeting ID
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Meeting ID: <span className="font-mono">{formatMeetingId(meetingId || '')}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Toggle */}
        <Button variant="ghost" size="sm" onClick={onToggleChat} className="text-gray-600 hover:text-gray-900">
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>

        {/* Participants Toggle */}
        <Button variant="ghost" size="sm" onClick={onToggleParticipants} className="text-gray-600 hover:text-gray-900">
          <Users className="w-4 h-4 mr-2" />
          Attendees
          <Badge variant="secondary" className="ml-2 text-xs">
            {participantCount || 0}
          </Badge>
        </Button>

        {/* More Options */}
        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}