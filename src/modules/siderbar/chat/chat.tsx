"use client"

import type React from "react"

import { type FC, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Download, Paperclip } from "lucide-react"

interface ChatMessage {
  id: string
  senderId: string
  senderName: string
  message: string
  timestamp: Date
  type: "text" | "file"
  fileUrl?: string
  fileName?: string
}

interface Participant {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
}

// Mock data matching the design
const mockParticipants: Participant[] = [
  { id: "1", name: "Rick Grimes", avatar: "/placeholder-user.jpg", isOnline: true },
  { id: "2", name: "Emma Watson", avatar: "/placeholder-user.jpg", isOnline: true },
  { id: "3", name: "Kristin Watson", avatar: "/placeholder-user.jpg", isOnline: true },
  { id: "4", name: "Jane Cooper", avatar: "/placeholder-user.jpg", isOnline: true },
  { id: "5", name: "Robert Fox", avatar: "/placeholder-user.jpg", isOnline: true },
]

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Rick Grimes",
    message: "Hi Team 👋",
    timestamp: new Date(Date.now() - 300000),
    type: "text",
  },
  {
    id: "2",
    senderId: "2",
    senderName: "Emma Watson",
    message: "Hi Guys Can 😊, you hear me?",
    timestamp: new Date(Date.now() - 240000),
    type: "text",
  },
  {
    id: "3",
    senderId: "3",
    senderName: "Kristin Watson",
    message: "Hi Everyone!\nLet get started it, dont forget to make a note. 📝",
    timestamp: new Date(Date.now() - 180000),
    type: "text",
  },
  {
    id: "4",
    senderId: "4",
    senderName: "Jane Cooper",
    message: "Before it, i share the main document",
    timestamp: new Date(Date.now() - 120000),
    type: "text",
  },
  {
    id: "5",
    senderId: "4",
    senderName: "Jane Cooper",
    message: "New Template.fig",
    timestamp: new Date(Date.now() - 60000),
    type: "file",
    fileName: "New Template.fig",
  },
  {
    id: "6",
    senderId: "5",
    senderName: "Robert Fox",
    message: "Before it, i share the main document",
    timestamp: new Date(Date.now() - 30000),
    type: "text",
  },
]

export const ChatSidebar: FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"chat" | "attendees">("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        senderId: "current-user",
        senderName: "You",
        message: newMessage,
        timestamp: new Date(),
        type: "text",
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

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
        </button>
        <button
          onClick={() => setActiveTab("attendees")}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === "attendees" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Attendees
          <Badge variant="secondary" className="ml-2 text-xs">
            {mockParticipants.length}
          </Badge>
        </button>
      </div>

      {activeTab === "chat" ? (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="text-xs">{getInitials(message.senderName)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{message.senderName}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>
                    {message.type === "file" ? (
                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg max-w-fit">
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <Paperclip className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">{message.fileName}</span>
                        <Button size="sm" variant="ghost" className="p-1 h-6 w-6">
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{message.message}</p>
                    )}
                  </div>
                </div>
              ))}
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
            {mockParticipants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{getInitials(participant.name)}</AvatarFallback>
                  </Avatar>
                  {participant.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}

export default ChatSidebar
