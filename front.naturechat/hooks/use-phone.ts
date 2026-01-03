import { api } from "@/lib/api"

export async function useVerifyPhone(phone: string) {
    const res = await api.get('/phone/verify', { params: { phone } })
    return res.data
}