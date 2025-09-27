import type { Participant } from '@videosdk.live/react-sdk/dist/types/participant';

/**
 * Get the display name of a participant, with fallback.
 */
export function getParticipantDisplayName(participant?: Participant): string {
  return participant?.displayName || participant?.id || 'Unknown';
}

/**
 * Get the role of a participant (from metaData.role).
 */
export function getParticipantRole(participant?: Participant): string {
  return (participant?.metaData as any)?.role || 'attendee';
}

/**
 * Check if a participant is a host.
 */
export function isParticipantHost(participant?: Participant): boolean {
  return getParticipantRole(participant) === 'host';
}

/**
 * Check if a participant is a co-host.
 */
export function isParticipantCoHost(participant?: Participant): boolean {
  return getParticipantRole(participant) === 'co-host';
}

/**
 * Check if a participant is an attendee.
 */
export function isParticipantAttendee(participant?: Participant): boolean {
  return getParticipantRole(participant) === 'attendee';
}

/**
 * Get all participants with a specific role.
 */
export function getAllParticipantsByRole(
  participants: Map<string, Participant>,
  role: string
): Participant[] {
  return Array.from(participants.values()).filter(
    (p) => getParticipantRole(p) === role
  );
}

/**
 * Get the active speaker participant by ID.
 */
export function getActiveSpeaker(
  participants: Map<string, Participant>,
  activeSpeakerId?: string
): Participant | undefined {
  if (!activeSpeakerId) return undefined;
  return participants.get(activeSpeakerId);
}

/**
 * Get the local participant from the participants map.
 */
export function getLocalParticipant(
  participants: Map<string, Participant>
): Participant | undefined {
  return Array.from(participants.values()).find((p) => p.local);
}

/**
 * Get all remote participants (not local).
 */
export function getRemoteParticipants(
  participants: Map<string, Participant>,
  localId?: string
): Participant[] {
  return Array.from(participants.values()).filter(
    (p) => p.id !== localId && !p.local
  );
}

/**
 * Get the total number of participants.
 */
export function getParticipantCount(
  participants: Map<string, Participant>
): number {
  return participants.size;
}

/**
 * Get a participant by ID.
 */
export function getParticipantById(
  participants: Map<string, Participant>,
  id: string
): Participant | undefined {
  return participants.get(id);
}

/**
 * Get all participant IDs.
 */
export function getAllParticipantIds(
  participants: Map<string, Participant>
): string[] {
  return Array.from(participants.keys());
}

// -------------------
// String utilities
// -------------------

/**
 * Sanitize a display name (remove leading/trailing whitespace, collapse spaces).
 */
export function sanitizeDisplayName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Truncate text to a maximum length, adding ellipsis if needed.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '…';
}

/**
 * Capitalize the first letter of each word in a name.
 */
export function capitalizeName(name: string): string {
  return name.replace(/\b\w/g, (c) => c.toUpperCase());
}

// -------------------
// Array/participant utilities
// -------------------

/**
 * Sort participants by display name (A-Z).
 */
export function sortParticipantsByName(
  participants: Participant[]
): Participant[] {
  return [...participants].sort((a, b) =>
    getParticipantDisplayName(a).localeCompare(getParticipantDisplayName(b))
  );
}

/**
 * Sort participants by join time (if joinTime is present in metaData).
 */
export function sortParticipantsByJoinTime(
  participants: Participant[]
): Participant[] {
  return [...participants].sort((a, b) => {
    const aTime = (a.metaData as any)?.joinTime || 0;
    const bTime = (b.metaData as any)?.joinTime || 0;
    return aTime - bTime;
  });
}

/**
 * Filter participants who have their mic on.
 */
export function filterParticipantsByMicOn(
  participants: Participant[]
): Participant[] {
  return participants.filter((p) => !!p.micOn);
}

/**
 * Filter participants who have their webcam on.
 */
export function filterParticipantsByWebcamOn(
  participants: Participant[]
): Participant[] {
  return participants.filter((p) => !!p.webcamOn);
}

/**
 * Filter participants who are sharing their screen.
 */
export function filterParticipantsByScreenShareOn(
  participants: Participant[]
): Participant[] {
  return participants.filter((p) => !!(p as any).screenShareOn);
}

/**
 * Group participants by role.
 * @returns An object mapping role to array of participants.
 */
export function groupParticipantsByRole(
  participants: Participant[]
): Record<string, Participant[]> {
  return participants.reduce(
    (acc, p) => {
      const role = getParticipantRole(p);
      if (!acc[role]) acc[role] = [];
      acc[role].push(p);
      return acc;
    },
    {} as Record<string, Participant[]>
  );
}

/**
 * Map participants to their display names.
 */
export function mapParticipantsToNames(participants: Participant[]): string[] {
  return participants.map(getParticipantDisplayName);
}

/**
 * Get initials from a participant's display name.
 */
export function getParticipantInitials(participant?: Participant): string {
  const name = getParticipantDisplayName(participant);
  const words = name.split(' ');
  if (words.length === 1) return words[0][0]?.toUpperCase() || '';
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
