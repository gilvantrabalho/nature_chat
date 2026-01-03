import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // empresa: 1,
    },
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // não tenta apagar token (não existe no JS)
            setTimeout(() => {
                window.location.href = '/login'
            }, 3000)
        }

        return Promise.reject(error)
    }
)
