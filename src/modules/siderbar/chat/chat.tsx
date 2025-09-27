"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatChatTimestamp, getChatSenderName, useChat } from "@/hooks/use-chat"
import { useRoom } from "@/hooks/use-meeting"
import { Paperclip, Send } from "lucide-react"
import { useEffect, useRef, useState, type FC } from "react"

export const ChatSidebar: FC = () => {
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "attendees">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get real meeting data
  const { participants, localParticipant } = useRoom()
  
  // Get real chat data using VideoSDK pub/sub
  const { messages, sendMessage } = useChat({
    onMessageReceived: (msg) => {
      console.log('New message received:', msg)
      // Optional: Add notification or sound here
    },
    onOldMessagesReceived: (msgs) => {
      console.log('Old messages received:', msgs)
    }
  })

  // Debug: Log messages to see if they're being received
  useEffect(() => {
    console.log('Chat messages updated:', messages)
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage.trim())
      sendMessage(newMessage.trim())
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Convert VideoSDK participants Map to array and include local participant
  const allParticipants = [
    localParticipant,
    ...Array.from(participants.values())
  ].filter(Boolean)

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "chat" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Chat
          {messages.length > 0 && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {messages.length}
            </Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab("attendees")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "attendees" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Attendees
          <Badge variant="secondary" className="ml-2 text-xs">
            {allParticipants.length}
          </Badge>
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p>No messages yet. Start the conversation!</p>
                  <p className="text-xs mt-2">Type a message below to begin chatting.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="text-xs">
                        {getInitials(getChatSenderName(message))}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {getChatSenderName(message)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatChatTimestamp(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 p-1 h-6 w-6">
                  <Paperclip className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 h-9 w-9"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {allParticipants.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No participants in the meeting</p>
              </div>
            ) : (
              allParticipants.map((participant) => {
                const isLocal = participant.id === localParticipant?.id
                const displayName = participant.displayName || participant.name || 'Unknown'
                const isMicOn = participant.micOn
                const isCameraOn = participant.camOn
                
                return (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={participant.metaData?.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {getInitials(displayName)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Show online status for remote participants */}
                      {!isLocal && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {displayName}
                          {isLocal && <span className="text-xs text-gray-500 ml-1">(You)</span>}
                        </p>
                        <div className="flex gap-1">
                          {/* Microphone status */}
                          <div className={`w-2 h-2 rounded-full ${
                            isMicOn ? 'bg-green-500' : 'bg-red-500'
                          }`} title={isMicOn ? 'Microphone on' : 'Microphone off'} />
                          {/* Camera status */}
                          <div className={`w-2 h-2 rounded-full ${
                            isCameraOn ? 'bg-green-500' : 'bg-red-500'
                          }`} title={isCameraOn ? 'Camera on' : 'Camera off'} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default ChatSidebar
