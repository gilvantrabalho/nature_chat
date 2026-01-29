"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, MessageCircle, MoreVertical, Users, User, LogOut, Settings, Leaf, MessageCirclePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { NewChatDialog } from "@/components/chat/new-chat-dialog"
import { useLogout } from "@/hooks/use-login"
import { IChat, INewChatResponse } from "@/types/chat"
import { useChatsUser } from "@/hooks/use-chat"
import { formatChatDate } from "@/utils/date"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatItemSkeleton } from "../loading/chat-item-skeleton"
import { useMe } from "@/hooks/use-me"
import { useChatDisplay } from "@/hooks/use-participants"
import { getInitials } from "@/utils/use"
import { IMessage } from "@/types/message"
import io from "socket.io-client"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

interface ChatSidebarProps {
  selectedChat: IChat | null
  onSelectChat: (chat: IChat) => void
}

export function ChatSidebar({ selectedChat, onSelectChat }: ChatSidebarProps) {

  const { data: meData } = useMe()
  const { data: dataChats, isLoading, refetch } = useChatsUser()
  const { mutate: logout } = useLogout()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [user, setUser] = useState<{ name: string; phone: string; avatar?: string } | null>(null)
  const [isNewChatOpen, setIsNewChatOpen] = useState(false)
  const [chats, setChats] = useState<IChat[]>([]);

  useEffect(() => {
    if (dataChats) setChats(dataChats)
  }, [dataChats])

  useEffect(() => {
    const handler = () => {
      refetch()
    }

    socket.on("update_chats_list", handler)

    return () => {
      socket.off("update_chats_list", handler)
    }
  }, [refetch])

  useEffect(() => {
    if (!meData?.id) return;

    socket.emit("join_user", meData.id);
  }, [meData?.id]);

  useEffect(() => {

    const handler = (message: IMessage) => {
      updateLastMessage(message);
    };


    socket.on("update_lastmessage", handler);

    return () => {
      socket.off("update_lastmessage", handler);
    };
  }, []);

  function updateLastMessage(message: IMessage) {
    setChats((prevChats) => {
      const updatedChats = prevChats.map((chat) =>
        chat.id === message.chat_id
          ? {
            ...chat,
            last_message: mapMessageToLastMessage(message),
          }
          : chat
      );

      const updatedChat = updatedChats.find(
        (chat) => chat.id === message.chat_id
      );

      if (!updatedChat) return prevChats;

      return [
        updatedChat,
        ...updatedChats.filter(
          (chat) => chat.id !== message.chat_id
        ),
      ];
    });
  }

  function mapMessageToLastMessage(message: IMessage): IChat["last_message"] {
    return {
      user: {
        name: message.sender?.name ?? "Você",
      },
      message: message.message,
    };
  }

  useEffect(() => {
    const handler = (message: IMessage) => {
      if (!message) return;

      setChats((prevChats) => {
        const updatedChats = prevChats.map((chat) => {
          if (chat.id !== message.chat_id) return chat;

          return {
            ...chat,
            last_message: {
              user: {
                name: message.sender?.name ?? "Você",
              },
              message: message.message,
            },
          };
        });

        // 🔼 opcional: mover o chat atualizado para o topo
        const updatedChat = updatedChats.find(
          (chat) => chat.id === message.chat_id
        );

        if (!updatedChat) return prevChats;

        return [
          updatedChat,
          ...updatedChats.filter((chat) => chat.id !== message.chat_id),
        ];
      });
    };

    socket.on("receive_message", handler);

    return () => {
      socket.off("receive_message", handler);
    };
  }, []);


  useState(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  })

  const onNewChat = (response: INewChatResponse) => {
    const chat = response.chat
    setChats(prev => [chat, ...prev])
  }

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem('user')
        router.push('/login')
      },
      onError: () => {
        localStorage.removeItem('user')
        router.push('/login')
      },
    })
  }

  return (
    <div className="w-full h-full border-r border-border flex flex-col bg-card">
      <div className="p-3 border-b border-border bg-primary/5 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-bold text-foreground">NatureChat</h2>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 shrink-0">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="text-sm font-medium truncate">{user?.name || "Usuário"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.phone || ""}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/chat/configuracoes")}>
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/chat/configuracoes")}>
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-background text-sm"
            />
          </div>
          <div className="ms-1">
            <Button onClick={() => setIsNewChatOpen(true)} className="h-full bg-primary hover:bg-primary/90 text-sm">
              <MessageCirclePlus className="w-4 h-4" />
            </Button>
          </div>
        </div>

      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">

        {
          isLoading
            ?
            Array.from({ length: 6 }).map((_, index) => (
              <ChatItemSkeleton key={index} />
            ))
            :
            <>
              {
                chats.length == 0 && <div className="text-center mt-10 text-gray-500">Nenhuma conversa iniciada</div>
              }
              {chats.map((chat: IChat) => {
                const otherUser =
                  chat.type === 'private' && meData
                    ? useChatDisplay(chat, meData)
                    : null

                return (
                  <button
                    key={chat.id}
                    onClick={() => onSelectChat(chat)}
                    className={cn(
                      "w-full p-3 flex items-start gap-3 hover:bg-accent/20 transition-colors border-b border-border/50",
                      selectedChat?.id === chat.id && "bg-primary/10 hover:bg-primary/15",
                    )}
                  >
                    <Avatar className="w-12 h-12 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {chat.type === 'group'
                          ? <Users className="w-5 h-5" />
                          : getInitials(otherUser?.name ?? '')
                        }
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-baseline justify-between gap-2 mb-0.5">
                        <h3 className="font-semibold text-sm truncate flex-1">
                          {chat.type === 'group'
                            ? chat.name
                            : otherUser?.name ?? 'Usuário'
                          }
                        </h3>

                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatChatDate(chat.created_at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm text-muted-foreground truncate flex-1 leading-snug">
                          {chat.type === 'group'
                            ? `${chat.last_message.user?.name}: ${chat.last_message.message}`
                            : chat.last_message.message
                          }
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}

            </>
        }
      </div>

      <div className="p-3 border-t border-border shrink-0 flex items-center">
        <Avatar className="w-12 h-12 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getInitials(meData?.name ?? '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0 text-left ms-2">
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <h3 className="font-semibold text-sm truncate flex-1">
              {meData?.name}
            </h3>
            <div onClick={handleLogout} className="text-destructive flex items-center cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </div>
          </div>
        </div>
      </div>

      <NewChatDialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen} onNewChat={onNewChat} />
    </div>
  )
}
