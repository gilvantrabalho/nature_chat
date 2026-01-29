"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Crown, Shield } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatPhone } from "@/utils/number"
import { getInitials } from "@/utils/use"

interface Member {
  id: string
  name: string
  phone: string
  avatar?: string
  role: "admin" | "moderator" | "member"
}

interface GroupMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  members: any
  chatName: string
}

export function GroupMembersDialog({ open, onOpenChange, members, chatName }: GroupMembersDialogProps) {
  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2)
  // }

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
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/10 transition-colors"
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
