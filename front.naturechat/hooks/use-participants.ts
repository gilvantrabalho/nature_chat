import { useMe } from "@/hooks/use-me"
import { IChat } from "@/types/chat"

const getInitials = (name: string) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
}

export function useChatDisplay(chat: IChat, me: any) {
    // const { data: me } = useMe()

    const otherUser =
        chat.type === 'private' && me
            ? chat.participants.find(p => p.id !== me.id)
            : null

    return {
        name: chat.type === 'group' ? chat.name : otherUser?.name,
        avatarText: chat.type === 'group'
            ? null
            : getInitials(otherUser?.name ?? ''),
    }
}
