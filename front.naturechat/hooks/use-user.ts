import { api } from "@/lib/api"
import { IMessage } from "@/types/message"
import { IUser } from "@/types/user"
import { useMutation, useQueryClient } from '@tanstack/react-query'


export function useCreateUser() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (user: IUser) =>
            api.post<IMessage>(`user/create`, user),
        onSuccess: () => {
            // garante que /me seja atualizado
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })
}