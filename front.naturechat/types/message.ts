export interface IMessage {
    id?: number
    chat_id: number
    user_id?: number
    message: string
    type: 'text' | 'image' | 'file' | string
    is_mine?: boolean
    sender?: {
        id: number
        name: string
    }
    created_at?: string
    updated_at?: string
}
