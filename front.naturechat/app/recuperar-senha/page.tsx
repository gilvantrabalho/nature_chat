import { RecoverPasswordForm } from "@/components/auth/recover-password-form"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default function RecoverPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Recuperar Senha</h1>
          <p className="text-muted-foreground">Enviaremos um link de redefinição</p>
        </div>

        <RecoverPasswordForm />

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="text-primary font-medium hover:underline">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
