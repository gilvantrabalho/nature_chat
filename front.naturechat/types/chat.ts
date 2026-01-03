export interface IChat {
    id: number
    type: 'private' | 'group'
    name: string | null
    created_by: number
    created_at: string
    updated_at: string
    participants: IChatParticipant[],
    last_message: {
        user: {
            name: string
        },
        message: string
    }
}

export interface IChatParticipant {
    id: number
    name: string
}

export interface IUserPhones {
    id: number,
    name: string,
    phone: string
}

export interface INewChatRequest {
    type: string,
    name: string,
    user_phones: IUserPhones[],
    message: string
}

export interface INewChatResponse {
    chat: IChat
}

// export interface IChat {
//     id: number
//     type: 'group' | 'private'
//     name: string
//     created_by: number
//     created_at: string
//     updated_at: string
//     participants: IChatParticipant[]
//     last_message: IChatLastMessage | null
// }

export interface IChatParticipant {
    id: number
    name: string
    pivot: IChatParticipantPivot
}

export interface IChatParticipantPivot {
    chat_id: number
    user_id: number
    created_at: string
    updated_at: string
}

export interface IChatLastMessage {
    id: number
    chat_id: number
    user_id: number
    message: string
    type: 'text' | 'image' | 'file'
    created_at: string
    updated_at: string
}
