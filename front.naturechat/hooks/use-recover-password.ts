import { api } from "@/lib/api"
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

export async function setMailRecoverPassword(email: string) {
    const res = await api.post(`/recover-password/send-mail`, { email })
    return res.data
}

export function verifyRecoverToken(token: string) {
    return useQuery({
        queryKey: ['verify-recover-token'],
        queryFn: async () => {
            const { data } = await api.get(`/recover-password/verify-token/${token}`)
            return data
        },
    })
}

export function useCreateNewPassword() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: { token: string, password: string, confirme_password: string }) =>
            api.post('/recover-password/create-new-password', payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['create-new-password'] })
        },
    })
}