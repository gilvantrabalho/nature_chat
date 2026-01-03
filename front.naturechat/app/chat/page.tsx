"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatWindow } from "@/components/chat/chat-window"
import { WelcomeScreen } from "@/components/chat/welcome-screen"
import { IChat } from "@/types/chat"

export default function ChatPage() {
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState<IChat>()
  const [isMounted, setIsMounted] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const handleSelectChat = (chat: IChat) => {
    setSelectedChat(chat)
    setShowSidebar(false)
  }

  const handleBack = () => {
    setShowSidebar(true)
    setSelectedChat(0)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-background">
      <div className={`${showSidebar ? "flex" : "hidden"} w-full md:flex md:w-96 h-full`}>
        <ChatSidebar
          selectedChat={selectedChat ?? null}
          onSelectChat={handleSelectChat}
        />
      </div>
      <div className={`${showSidebar ? "hidden" : "flex"} md:flex flex-1 h-full`}>
        {selectedChat ? <ChatWindow chat={selectedChat} onBack={handleBack} /> : <WelcomeScreen />}
      </div>
    </div>
  )
}
