import { Skeleton } from "@/components/ui/skeleton"

export function ChatItemSkeleton() {
    return (
        <div className="w-full p-3 flex items-start gap-3 border-b border-border/50">
            {/* Avatar */}
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />

            {/* Conteúdo */}
            <div className="flex-1 min-w-0">
                {/* Linha superior */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-12" />
                </div>

                {/* Última mensagem */}
                <Skeleton className="h-4 w-full" />
            </div>
        </div>
    )
}
