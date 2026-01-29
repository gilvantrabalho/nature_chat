'use client'

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "../ui/button"
import { useCreateNewPassword } from "@/hooks/use-recover-password"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AlterarSenhaFormProps {
    token: string | null
}

export default function AlterarSenhaForm({ token }: AlterarSenhaFormProps) {

    const { mutate: createNewPassword } = useCreateNewPassword()

    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (password.length < 6) {
            toast.warning("A senha deve ter pelo menos 6 caracteres.")
            setIsLoading(false)
            return
        }

        if (password !== confirmPassword) {
            toast.warning("As senhas não coincidem.")
            setIsLoading(false)
            return
        }

        createNewPassword({
            token: token || "",
            password: password,
            confirme_password: confirmPassword
        },{
            onSuccess: (res) => {
                toast.success("Senha alterada com sucesso!")
                setPassword("")
                setConfirmPassword("")
                router.push("/login")
            },
            onSettled: () => {
                setIsLoading(false)
            }
        })

    }

    return (
        <Card className="border-border/50 shadow-lg">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Nova senha <div className="text-red-500">*</div></Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="******"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirme_password">Confirmar nova senha <div className="text-red-500">*</div></Label>
                        <Input
                            id="confirme_password"
                            type="password"
                            placeholder="******"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="bg-background"
                        />
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Alterar Senha"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
