import { api } from "@/lib/api"
import { IMessage } from "@/types/message"
import { useMutation, useQueryClient } from '@tanstack/react-query'

export async function getMessagesChat(id: number) {
    const res = await api.get(`/chat/${id}/message`)
    return res.data
}

export function useCreateMessage() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: { chat_id: number; message: string, type: string }) =>
            api.post<IMessage>(`/chat/message/create`, payload),
        onSuccess: () => {
            // garante que /me seja atualizado
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })
}