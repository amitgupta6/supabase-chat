"use client"

import { useState } from "react"
import { User, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Message = {
  id: number
  text: string
  time: string
  isSent: boolean
  date: string
}

type Chat = {
  id: number
  name: string
  lastMessage: string
  time: string
  messages: Message[]
}

const mockChats: Chat[] = [
  {
    id: 1,
    name: "John Doe",
    lastMessage: "Hey! How are you doing?",
    time: "10:30 AM",
    messages: [
      { id: 1, text: "Hey! How are you doing?", time: "10:30 AM", isSent: false, date: "2026-01-09" },
      { id: 2, text: "I'm good, thanks! What about you?", time: "10:32 AM", isSent: true, date: "2026-01-09" },
      { id: 3, text: "Doing great! Want to catch up later?", time: "10:33 AM", isSent: false, date: "2026-01-09" },
      { id: 4, text: "Good morning!", time: "9:00 AM", isSent: false, date: "2026-01-10" },
      { id: 5, text: "Morning! How's everything?", time: "9:05 AM", isSent: true, date: "2026-01-10" },
    ]
  },
  {
    id: 2,
    name: "Sarah Smith",
    lastMessage: "Thanks for your help!",
    time: "Yesterday",
    messages: [
      { id: 1, text: "Can you help me with the project?", time: "2:15 PM", isSent: false, date: "2026-01-08" },
      { id: 2, text: "Sure! What do you need?", time: "2:20 PM", isSent: true, date: "2026-01-08" },
      { id: 3, text: "I need some clarification on the requirements", time: "2:22 PM", isSent: false, date: "2026-01-08" },
      { id: 4, text: "Thanks for your help!", time: "3:00 PM", isSent: false, date: "2026-01-09" },
    ]
  },
  {
    id: 3,
    name: "Mike Johnson",
    lastMessage: "See you tomorrow!",
    time: "Tuesday",
    messages: [
      { id: 1, text: "Are we meeting tomorrow?", time: "5:00 PM", isSent: false, date: "2026-01-07" },
      { id: 2, text: "Yes, at 3 PM", time: "5:05 PM", isSent: true, date: "2026-01-07" },
      { id: 3, text: "See you tomorrow!", time: "5:10 PM", isSent: false, date: "2026-01-07" },
    ]
  },
]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }
}

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat>(mockChats[0])
  const [messageInput, setMessageInput] = useState("")

  const groupedMessages = selectedChat.messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = message.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Chat List */}
      <div className="w-[350px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-semibold">Chats</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={cn(
                "flex items-start gap-3 p-4 cursor-pointer hover:bg-accent transition-colors border-b border-border",
                selectedChat.id === chat.id && "bg-accent"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-sm">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Chat Messages */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="font-semibold">{selectedChat.name}</h2>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/20">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                  {formatDate(date)}
                </div>
              </div>

              {/* Messages */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex mb-2",
                    message.isSent ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      message.isSent
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border"
                    )}
                  >
                    <p className="text-sm break-words">{message.text}</p>
                    <span
                      className={cn(
                        "text-xs mt-1 block text-right",
                        message.isSent ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {message.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-background">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && messageInput.trim()) {
                  setMessageInput("")
                }
              }}
              className="flex-1"
            />
            <Button size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
