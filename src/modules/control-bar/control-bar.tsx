"use client"

import type { FC } from "react"

import { Button } from "@/components/ui/button"
import {
  Hand,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Users,
  Video,
  VideoOff,
  Settings,
  MoreHorizontal,
} from "lucide-react"

import type { ControlBarProps } from "./control-bar.types"
import { useRoom } from "@/hooks/use-meeting"

export const ControlBar: FC<ControlBarProps> = ({ onLeave }) => {

  const { enableWebcam, disableWebcam, muteMic, unmuteMic, toggleScreenShare, localParticipant, presenterId } =
    useRoom()

  // Use the real state from the SDK
  const isWebcamOn = !!localParticipant?.webcamOn
  const isMicOn = !!localParticipant?.micOn
  const isScreenSharing = localParticipant.id === presenterId

  // Define all controls in an array for easy mapping
  const controls = [
    {
      key: "settings",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Settings"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Settings size={20} />
        </Button>
      ),
    },
    {
      key: "cam",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => (isWebcamOn ? await disableWebcam() : await enableWebcam())}
          aria-label={isWebcamOn ? "Turn off camera" : "Turn on camera"}
          title={isWebcamOn ? "Turn off camera" : "Turn on camera"}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isWebcamOn ? <Video size={20} /> : <VideoOff size={20} />}
        </Button>
      ),
    },
    {
      key: "mic",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          onClick={async () => (isMicOn ? await muteMic() : await unmuteMic())}
          aria-label={isMicOn ? "Mute microphone" : "Unmute microphone"}
          title={isMicOn ? "Mute microphone" : "Unmute microphone"}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </Button>
      ),
    },
    {
      key: "endCall",
      render: () => (
        <Button
          variant="destructive"
          size="icon"
          onClick={onLeave}
          aria-label="Leave meeting"
          title="Leave meeting"
          className="bg-red-500 hover:bg-red-600 text-white rounded-full w-12 h-12"
        >
          <PhoneOff size={20} />
        </Button>
      ),
    },
    {
      key: "screenShare",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleScreenShare()}
          aria-label={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
          title={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          {isScreenSharing ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
        </Button>
      ),
    },
    {
      key: "raiseHand",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Raise hand"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Hand size={20} />
        </Button>
      ),
    },
    {
      key: "chat",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Chat"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <MessageCircle size={20} />
        </Button>
      ),
    },
    {
      key: "participants",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Participants"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Users size={20} />
        </Button>
      ),
    },
    {
      key: "more",
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          aria-label="More options"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <MoreHorizontal size={20} />
        </Button>
      ),
    },
  ]

  return (

      <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 ">
        {controls.map((ctrl) => (
          <span key={ctrl.key}>{ctrl.render()}</span>
        ))}
 </div>
  )
}
