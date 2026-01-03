"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Crown, Shield } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import formatPhone from "@/utils/number"

interface Member {
  id: string
  name: string
  phone: string
  avatar?: string
  role: "admin" | "moderator" | "member"
}

// Mock data de membros por grupo
const groupMembers: Record<string, Member[]> = {
  "1": [
    { id: "1", name: "Maria Santos", phone: "(11) 9 8765-4321", role: "admin" },
    { id: "2", name: "Carlos Lima", phone: "(11) 9 7654-3210", role: "moderator" },
    { id: "3", name: "Ana Paula", phone: "(21) 9 5555-1111", role: "member" },
    { id: "4", name: "Pedro Costa", phone: "(31) 9 4444-2222", role: "member" },
    { id: "5", name: "Julia Mendes", phone: "(41) 9 3333-3333", role: "member" },
    { id: "6", name: "Roberto Silva", phone: "(51) 9 2222-4444", role: "member" },
    { id: "7", name: "Fernanda Lopes", phone: "(61) 9 1111-5555", role: "member" },
    { id: "8", name: "Marcelo Dias", phone: "(71) 9 6666-7777", role: "member" },
  ],
  "3": [
    { id: "1", name: "Carlos Lima", phone: "(11) 9 7654-3210", role: "admin" },
    { id: "2", name: "Ana Costa", phone: "(31) 9 8888-9999", role: "member" },
    { id: "3", name: "Roberto Silva", phone: "(51) 9 2222-4444", role: "member" },
    { id: "4", name: "Julia Mendes", phone: "(41) 9 3333-3333", role: "member" },
    { id: "5", name: "Pedro Costa", phone: "(31) 9 4444-2222", role: "member" },
  ],
  "5": [
    { id: "1", name: "Diretor Geral", phone: "(11) 9 9999-8888", role: "admin" },
    { id: "2", name: "Gerente TI", phone: "(11) 9 8888-7777", role: "moderator" },
    { id: "3", name: "Gerente RH", phone: "(11) 9 7777-6666", role: "member" },
  ],
}

interface GroupMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: any
  chatName: string
}

export function GroupMembersDialog({ open, onOpenChange, members, chatName }: GroupMembersDialogProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleIcon = (role: Member["role"]) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const getRoleLabel = (role: Member["role"]) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "moderator":
        return "Moderador"
      default:
        return "Membro"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg">{chatName}</DialogTitle>
              <p className="text-sm text-muted-foreground">{members.length} membros</p>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-1">
            {members.map((member: any) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={member.avatar || "/placeholder.svg?height=48&width=48"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm truncate">{member.name}</h3>
                    {getRoleIcon(member.role)}
                  </div>
                  <p className="text-xs text-muted-foreground">{formatPhone(member.phone)}</p>
                  <p className="text-xs text-primary/70">{getRoleLabel(member.pivot.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
