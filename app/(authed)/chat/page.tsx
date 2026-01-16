"use client"

import { useEffect, useState } from "react"
import { User, Send } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import { Database } from "@/types/database"
import { type User as UserType } from "@supabase/supabase-js";

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

function formatTime(dateIso: string): string {
  const d = new Date(dateIso);

  let hours = d.getHours(); // 0-23
  const minutes = d.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  const mm = String(minutes).padStart(2, "0");

  return `${hours}:${mm}${ampm}`;
}


type ChatMessage = Database["public"]["Tables"]["messages"]["Row"];

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState<Chat>(mockChats[0])
  const [messageInput, setMessageInput] = useState("")
  const [profiles, setProfiles] = useState<Database["public"]["Tables"]["profiles"]["Row"][]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Database["public"]["Tables"]["profiles"]["Row"] | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [user, setUser] = useState<UserType | null>(null);

  const loadUser = async () => {
    const { data: { user }, error: userRetrievalError } = await supabase.auth.getUser();
    setUser(user);
  }

  useEffect(() => {
    loadUser();
  }, []);

  const groupedMessages = messages.reduce((groups: { [key: string]: ChatMessage[] }, message) => {
    const date = message.created_at.split("T")[0];
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {})

  const loadUsers = async () => {
    const { data: profiles, error } = await supabase.from("profiles").select();
    if (error) {
      console.log("error fetching profiles", error);
      return;
    }
    console.log("profiles", profiles);
    setProfiles(profiles);
  }

  const loadMessages = async (user_id: string) => {
    // const { data: { user }, error: userRetrievalError } = await supabase.auth.getUser();
    // if (userRetrievalError) {
    //   console.log("loadMessages - failed to retrieve user", userRetrievalError);
    //   return;
    // }

    const { data: messages, error } = await supabase.from("messages").select().or(
      `and(sender_id.eq.${user?.id},recipient_id.eq.${user_id}), and(sender_id.eq.${user_id},recipient_id.eq.${user?.id})`
    )
    if (error) {
      console.log("error fetching messages", error);
      return;
    }
    console.log("messages", messages);
    setMessages(messages);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedProfile?.id && user) {
      loadMessages(selectedProfile?.id);
    }
  }, [selectedProfile, user]);

  const handleMessageInput = () => {
    setMessageInput("");
  }

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Chat List */}
      <div className="w-[350px] border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-12 h-10 flex items-center justify-center flex-shrink-0">
            <h1 className="text-xl font-semibold ml-4">Chats</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              onClick={() => setSelectedProfile(profile)}
              className={cn(
                "flex items-start gap-3 p-4 cursor-pointer hover:bg-accent transition-colors border-b border-border",
                selectedProfile?.id === profile.id && "bg-accent"
              )}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-sm">{profile.name}</h3>
                  <span className="text-xs text-muted-foreground">11:22PM</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">Last message</p>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer to align with message input on the right */}
        <div className="p-4 border-t border-border bg-background" style={{ height: '72px' }}></div>
      </div>

      {/* Right Side - Chat Messages */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-background">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <h2 className="font-semibold">{selectedProfile?.name}</h2>
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
                    message.sender_id == user?.id ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-4 py-2",
                      message.sender_id == user?.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-background border border-border"
                    )}
                  >
                    <p className="text-sm break-words">{message.message}</p>
                    <span
                      className={cn(
                        "text-xs mt-1 block text-right",
                        message.sender_id == user?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.created_at)}
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
                  // setMessageInput("")
                  handleMessageInput();
                }
              }}
              className="flex-1"
            />
            <Button size="icon" onClick={handleMessageInput}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
