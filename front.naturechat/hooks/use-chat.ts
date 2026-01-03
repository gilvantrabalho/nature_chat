import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { IChat, INewChatRequest } from '@/types/chat'

export function useChatsUser() {
    return useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const { data } = await api.get<IChat[]>('/chat')
            return data
        },
    })
}

export function useCreateNewChat() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: INewChatRequest) => api.post('/chat/create', payload)
    })
}