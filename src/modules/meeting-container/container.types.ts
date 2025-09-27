export interface ContainerProps {
  meetingId: string;
  onMeetingLeave: () => void;
  onNavigateToDashboard?: () => void;
}
