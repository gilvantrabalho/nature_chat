export function formatChatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()

    // Zera hora para comparação de dias
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    const diffTime = today.getTime() - target.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // Hoje → hora
    if (diffDays === 0) {
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    // Ontem
    if (diffDays === 1) {
        return 'Ontem'
    }

    // Últimos 7 dias → dia da semana
    if (diffDays > 1 && diffDays < 7) {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
        })
    }

    // Mais de 7 dias → data
    return date.toLocaleDateString('pt-BR')
}
