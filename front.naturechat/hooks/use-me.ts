import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'


export function useMe() {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const { data } = await api.get('/me')
            return data
        },
    })
}