"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Search,
  Users,
  FileText,
  Download,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FileUploadDialog } from "@/components/chat/file-upload-dialog"
import { EmojiPicker } from "@/components/chat/emoji-picker"
import { GroupMembersDialog } from "@/components/chat/group-members-dialog"
import { IChat } from "@/types/chat"
import { getMessagesChat, useCreateMessage } from "@/hooks/use-message"
import { IMessage } from "@/types/message"
import { formatChatDate } from "@/utils/date"
import io from "socket.io-client"
import { useMe } from "@/hooks/use-me"
import { getInitials } from "@/utils/use"
import { useChatDisplay } from "@/hooks/use-participants"
import { NewParticipantDialog } from "./new-participant-dialog"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

interface ChatWindowProps {
  chat: IChat
  onBack?: () => void
}

export function ChatWindow({ chat, onBack }: ChatWindowProps) {

  const { mutate: createMessage } = useCreateMessage()
  const { data: meData } = useMe()

  const otherUser = useChatDisplay(chat, meData)
  const [messages, setMessages] = useState<IMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false)
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [typingIdUser, setTypingIdUser] = useState<number>(0);

  useEffect(() => {
    if (!chat.id) return;

    socket.emit("join_chat", chat.id);

    return () => {
      socket.emit("leave_chat", chat.id);
    };
  }, [chat.id]);

  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = (value: string) => {
    setNewMessage(value);

    socket.emit("typing", {
      chatId: chat.id,
      user: meData,
      typing: true,
    });

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      socket.emit("typing", {
        chatId: chat.id,
        user: meData,
        typing: false,
      });
    }, 1200);
  };

  useEffect(() => {
    socket.on("receive_typing", ({ user, typing }) => {
      if (typing) {
        setTypingIdUser(user.id)
        setTypingUser(user.name);
      } else {
        setTypingIdUser(0)
        setTypingUser(null);
      }
    });

    return () => {
      socket.off("receive_typing");
    };
  }, []);

  useEffect(() => {
    setLoadingMessage(true)
    getMessagesChat(chat.id)
      .then(res => {
        setMessages(res.messages)
      })
      .finally(() => {
        setLoadingMessage(false)
      })
  }, [chat])

  useEffect(() => {
    const handler = (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: IMessage = {
      chat_id: chat.id,
      message: newMessage,
      type: 'text'
    }

    createMessage(message, {
      onSuccess: (res) => {
        setNewMessage("")
        socket.emit("send_message", {
          chatId: chat.id,
          message: res.data
        });
      }
    })
  }

  const handleFileUpload = (files: File[]) => {
    files.forEach((file) => {
      const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document"

      const message: Message = {
        id: Date.now().toString() + Math.random(),
        sender: "Você",
        content: fileType === "image" ? "" : `Enviou um ${fileType === "video" ? "vídeo" : "documento"}`,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        isMine: true,
        type: fileType,
        fileUrl: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: formatFileSize(file.size),
      }

      setMessages((prev) => [...prev, message])
    })
    setShowUploadDialog(false)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const renderMessageContent = (message: IMessage) => {
    switch (message.type) {
      case "image":
        return (
          <div className="rounded-lg overflow-hidden max-w-[280px]">
            <img src={message.fileUrl || "/placeholder.svg"} alt="Imagem enviada" className="w-full h-auto" />
          </div>
        )
      case "video":
        return (
          <div className="rounded-lg overflow-hidden max-w-[280px]">
            <video src={message.fileUrl} controls className="w-full h-auto bg-black">
              Seu navegador não suporta vídeos.
            </video>
            {message.fileName && (
              <p className="text-xs mt-2 opacity-80">
                {message.fileName} • {message.fileSize}
              </p>
            )}
          </div>
        )
      case "document":
        return (
          <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 border border-border/50 min-w-[200px]">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs opacity-70">{message.fileSize}</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0 w-8 h-8" asChild>
              <a href={message.fileUrl} download={message.fileName}>
                <Download className="w-4 h-4" />
              </a>
            </Button>
          </div>
        )
      default:
        return <p className="text-sm leading-relaxed break-words">{message.message}</p>
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  return (
    <div className="flex-1 h-full flex flex-col bg-background">
      <div className="p-3 border-b border-border bg-card flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 w-9 h-9 rounded-full -ml-2"
              onClick={onBack}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          <Avatar className="w-10 h-10 shrink-0">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {chat.type === 'group'
                ? <Users className="w-5 h-5" />
                : getInitials(otherUser?.name ?? '')
              }
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate leading-tight">
              {chat.type === 'group'
                ? chat.name
                : otherUser?.name ?? 'Usuário'
              }
            </h2>

            {chat.type === 'group' && (
              <button
                onClick={() => setShowMembersDialog(true)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors leading-tight"
              >
                {chat.participants.length} membros
              </button>
            )}
          </div>
        </div>


        <div className="flex items-center gap-0.5 shrink-0">
          {/* <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
            <Video className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
            <Phone className="w-5 h-5" />
          </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Search className="w-4 h-4 mr-2" />
                Buscar mensagens
              </DropdownMenuItem>
              <DropdownMenuItem>
                <NewParticipantDialog open={true} onOpenChange={() => {}} />
              </DropdownMenuItem>
              {/* <DropdownMenuItem>Silenciar notificações</DropdownMenuItem>
              <DropdownMenuItem>Limpar mensagens</DropdownMenuItem> */}
              <DropdownMenuItem className="text-destructive">Bloquear</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-2"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30L30.5 30.5' stroke='%2310b981' strokeOpacity='0.03' fill='none'/%3E%3C/svg%3E")`,
        }}
      >

        {messages?.length > 0 &&
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender?.id === meData.id ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "flex gap-1.5 max-w-[85%]",
                  message.sender?.id === meData.id
                    ? "flex-row-reverse"
                    : "flex-row"
                )}
              >
                {message.sender?.id !== meData.id && (
                  <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs">
                      {getInitials(message.sender?.name ?? "ND")}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className="flex flex-col gap-0.5">
                  {message.sender?.id !== meData.id && chat?.type === "group" && (
                    <p className="text-xs font-medium text-primary px-1">
                      {message.sender?.name ?? "---"}
                    </p>
                  )}

                  <div
                    className={cn(
                      "rounded-lg overflow-hidden",
                      message.type === "text" && "px-3 py-2",
                      message.type !== "text" && "p-1.5",
                      message.sender?.id === meData.id
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card text-card-foreground rounded-bl-sm border border-border"
                    )}
                  >
                    {renderMessageContent(message)}
                  </div>

                  <span
                    className={cn(
                      "text-xs text-muted-foreground px-1",
                      message.sender?.id === meData.id ? "text-right" : "text-left"
                    )}
                  >
                    {formatChatDate(message?.created_at ?? "")}
                  </span>
                </div>
              </div>
            </div>
          ))}

        {/* 👇 AQUI É O LUGAR CERTO */}
        {
          // (typingIdUser != meData.id) && (
          typingUser && (
            <p className="text-xs text-muted-foreground animate-pulse">
              {typingUser} está digitando...
            </p>
          )
          // )
        }

        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-border bg-card shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-end gap-1.5">
          <div className="flex gap-0.5 shrink-0">
            <div className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full w-9 h-9"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5 text-muted-foreground" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9"
              onClick={() => setShowUploadDialog(true)}
            >
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
          <Input
            placeholder="Mensagem..."
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            className="flex-1 h-10 bg-background text-sm min-w-0"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90 w-10 h-10 shrink-0"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>

      <FileUploadDialog open={showUploadDialog} onOpenChange={setShowUploadDialog} onUpload={handleFileUpload} />
      <GroupMembersDialog
        open={showMembersDialog}
        onOpenChange={setShowMembersDialog}
        members={chat.participants}
        chatName={chat?.name || ""}
      />
    </div>
  )
}
