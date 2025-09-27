export interface MeetingViewProps {
  meetingId: string;
  onLeave: () => void;
}

export interface LayoutSelectorProps {
  layout: 'grid' | 'speaker';
  setLayout: (layout: 'grid' | 'speaker') => void;
}
