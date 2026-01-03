import { MessageCircle, Shield, Zap, Leaf } from "lucide-react"

export function WelcomeScreen() {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="text-center max-w-md px-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary mb-6">
          <Leaf className="w-12 h-12 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-balance">Bem-vindo ao NatureChat</h1>
        <p className="text-muted-foreground mb-8 text-pretty leading-relaxed">
          Conecte-se com sua equipe de forma profissional e segura. Selecione uma conversa para começar.
        </p>

        <div className="grid gap-4 text-left">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Mensagens instantâneas</h3>
              <p className="text-xs text-muted-foreground">Envie textos, fotos, vídeos e documentos</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Seguro e privado</h3>
              <p className="text-xs text-muted-foreground">Suas conversas protegidas com criptografia</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border/50">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Rápido e confiável</h3>
              <p className="text-xs text-muted-foreground">Sincronização em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
