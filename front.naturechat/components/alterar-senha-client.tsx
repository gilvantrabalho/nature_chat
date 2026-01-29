"use client"

import { Suspense } from "react"
import { Leaf } from "lucide-react"
import AlterarSenhaForm from "@/components/auth/alterar-senha-form"
import { verifyRecoverToken } from "@/hooks/use-recover-password"
import { useSearchParams, useRouter } from "next/navigation"

export default function AlterarSenhaClient() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get("token")
    const { data, isLoading, isError } = verifyRecoverToken(token || "")

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Carregando...</p>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
                <div className="w-full max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
                        <Leaf className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Token Inválido</h1>
                    <p className="text-muted-foreground mb-4">O token de recuperação de senha é inválido ou expirou.</p>
                    <button
                        onClick={() => router.push("/recuperar-senha")}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Solicitar novo token
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
                        <Leaf className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-2">Alterar Senha</h1>
                    <p className="text-muted-foreground">Redefina sua senha aqui</p>
                </div>
                <AlterarSenhaForm token={token} />
            </div>
        </div>
    )
}