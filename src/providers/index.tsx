import { create } from 'zustand';
import { useContext } from 'react';

import { createContext,type FC, type ReactNode } from 'react';

export type ControlBarConfig = {
  mic: boolean;
  cam: boolean;
  screenShare: boolean;
  chat: boolean;
  raiseHand: boolean;
  participants: boolean;
  settings: boolean;
  captions: boolean;
  recording: boolean;
  more: boolean;
};

const defaultConfig: ControlBarConfig = {
  mic: true,
  cam: true,
  screenShare: true,
  chat: true,
  raiseHand: true,
  participants: true,
  settings: true,
  captions: false,
  recording: false,
  more: true
};

type Store = {
  config: ControlBarConfig;
  setConfig: (config: Partial<ControlBarConfig>) => void;
  resetConfig: () => void;
};

const STORAGE_KEY = 'controlBarConfig';

export const useControlBarConfig = create<Store>((set) => ({
  config: (() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return { ...defaultConfig, ...JSON.parse(stored) };
    }
    return defaultConfig;
  })(),
  setConfig: (newConfig) =>
    set((state) => {
      const updated = { ...state.config, ...newConfig };
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { config: updated };
    }),
  resetConfig: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
    }
    set({ config: defaultConfig });
  }
}));

interface RoomContextValue {
  meetingId: string;
  controlBarConfig: ControlBarConfig;
}

export const RoomContext = createContext<RoomContextValue | undefined>(
  undefined
);

interface RoomProviderProps {
  meetingId: string;
  children: ReactNode;
  controlBarConfig?: ControlBarConfig;
}

export const RoomProvider: FC<RoomProviderProps> = ({
  meetingId,
  children,
  controlBarConfig
}) => (
  <RoomContext.Provider
    value={{
      meetingId,
      controlBarConfig: controlBarConfig || defaultConfig
    }}
  >
    {children}
  </RoomContext.Provider>
);
export function useRoomContext() {
  const ctx = useContext(RoomContext);
  if (!ctx)
    throw new Error('useRoomContext must be used within a RoomProvider');
  return ctx;
}
