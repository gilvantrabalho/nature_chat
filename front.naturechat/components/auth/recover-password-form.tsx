"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { send } from "process"
import { setMailRecoverPassword } from "@/hooks/use-recover-password"
import { toast } from "sonner"

export function RecoverPasswordForm() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    await setMailRecoverPassword(email)
      .then(res => {
        setSent(true)
      })
      .catch(err => {
        toast.error(err.response.data.message || "Erro ao enviar email de recuperação")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  if (sent) {
    return (
      <Card className="border-border/50 shadow-lg">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Email enviado!</h3>
              <p className="text-sm text-muted-foreground">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Enviaremos um link de redefinição para este email</p>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar link de redefinição"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
