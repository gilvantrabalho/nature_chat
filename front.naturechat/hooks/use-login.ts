import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: { phone: string; password: string }) =>
            api.post('/login', payload),

        onSuccess: () => {
            // garante que /me seja atualizado
            queryClient.invalidateQueries({ queryKey: ['me'] })
        },
    })
}

export function useLogout() {
    return useMutation({
        mutationFn: async () => {
            await api.post('/logout')
        },
    })
}