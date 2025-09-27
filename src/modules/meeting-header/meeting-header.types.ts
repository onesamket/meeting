export interface MeetingHeaderProps {
  onToggleFullscreen?: () => void
  onToggleChat?: () => void
  onToggleParticipants?: () => void
  participantCount?: number
  meetingId?: string
  onLeave?: () => void
}
