'use client'

import AlterarSenhaClient from "@/components/alterar-senha-client"
import { Suspense } from "react"

export default function AlterarSenhaPage() {

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    }>
      <AlterarSenhaClient />
    </Suspense>
  )

}