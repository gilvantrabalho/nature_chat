"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import InputLoading from "../input/input-loading"
import { useVerifyPhone } from "@/hooks/use-phone"
import { formatPhone } from "@/utils/number"
import { IChat, INewChatResponse } from "@/types/chat"
import { Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import { IUserPhones } from "@/types/chat"
import { useCreateNewChat } from "@/hooks/use-chat"
import { Input } from "../ui/input"
import io from "socket.io-client"
import { useMe } from "@/hooks/use-me"

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewChat: (chat: INewChatResponse) => void
}

export function NewChatDialog({ open, onOpenChange, onNewChat }: NewChatDialogProps) {

  const { mutate: createNewChat } = useCreateNewChat()
  const { data: meData } = useMe()

  const [type, setType] = useState<string>("")
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [phoneExist, setPhoneExist] = useState<boolean>(false)
  const [verifiedPhone, setVerifiedPhone] = useState<IUserPhones>({
    id: 0, name: '', phone: ''
  });
  const [messageErroPhone, setMessageErroPhone] = useState<string>('')
  const [selectedUserPhones, setSelectedUserPhones] = useState<IUserPhones[]>([]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setPhone(formatted)
  }

  useEffect(() => {
    if (meData?.id) {
      socket.emit("join_user", meData?.id);
    }
  }, [meData?.id])

  useEffect(() => {
    verifyNumber()
  }, [phone])

  useEffect(() => {
    if (type == 'private' && selectedUserPhones.length > 1) {
      setSelectedUserPhones([])
    }
  }, [type])

  const verifyNumber = () => {
    if (phone.length == 16) {
      setLoading(true)
      useVerifyPhone(phone)
        .then(res => {
          if (res.user) {
            setVerifiedPhone({
              id: res.user.id,
              name: res.user.name,
              phone: phone
            })
            setMessageErroPhone('')
            setPhoneExist(true)
          } else {
            setPhoneExist(false)
            setMessageErroPhone('O número informado não está registrado em nossa base de dados!')
          }
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      if (phone.length > 0) {
        setMessageErroPhone('Número fora do formato (00) 0 0000-0000')
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!type) {
      toast.warning('Selecione o tipo da conversa!')
      return
    }

    if (type == 'group') {
      if (!name) {
        toast.warning('Informe o nome do grupo')
        return
      }
    }

    if (selectedUserPhones.length == 0) {
      toast.warning('Nenhum número selecionado')
      return
    }

    if (!message) {
      toast.warning('Escreva alguma mensagem!')
      return
    }

    createNewChat({
      type: type,
      name: name,
      user_phones: selectedUserPhones,
      message: message
    }, {
      onSuccess: (res) => {
        onNewChat(res.data)
        socket.emit("update_chats");
        setSelectedUserPhones([])
        setPhone("")
        setMessage("")
        onOpenChange(false)
      },
      onError: () => {
        socket.emit("update_chats");
      }
    })
  }

  // const addSelectedPhones = (userPhone: IUserPhones) => {
  //   setSelectedUserPhones(prev => [...prev, userPhone])
  // }

  const addMultUserPhones = () => {
    if (!verifiedPhone || !verifiedPhone.phone) return

    setSelectedUserPhones(prev => {
      const alreadyExists = prev.some(
        item => item.phone === verifiedPhone.phone
      )

      if (alreadyExists) return prev

      return [...prev, verifiedPhone]
    })

    setPhone('')
    setVerifiedPhone({ id: 0, name: '', phone: '' })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Conversa</DialogTitle>
          <DialogDescription>
            Informe o número de telefone e uma mensagem inicial para começar uma nova conversa.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">

          <div className="space-y-2 mb-6">
            <Label htmlFor="phone">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="private">Conversa privada</SelectItem>
                  <SelectItem value="group">Grupo</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {
            type == 'group' && (
              <div className="space-y-2 mb-6">
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite o nome do grupo..."
                />
              </div>
            )
          }

          <div className="space-y-2 mb-6">
            <Label htmlFor="phone">Número de Telefone {verifiedPhone.id != 0}</Label>
            <div className="relative">
              <InputLoading
                value={phone}
                onChange={handlePhoneChange}
                loading={loading}
                disabled={!type}
              />
              <Button
                disabled={!phoneExist || (type == 'private' && selectedUserPhones.length == 1)}
                onClick={addMultUserPhones}
                type="button"
                variant="ghost"
                className="btn-xs ms-2 absolute top-0 right-0 group hover:bg-transparent"
              >
                <Plus className="text-primary group-hover:text-green-950" />
              </Button>
            </div>
            {
              messageErroPhone && (
                <div className="text-xs text-red-500">{messageErroPhone}</div>
              )
            }
          </div>

          <div className="bg-primary/10 rounded border p-2 h-30">
            {
              selectedUserPhones.map((item, index) => (
                <Badge className="text-xs me-1">{item.phone} - {item.name}</Badge>
              ))
            }
            {
              selectedUserPhones.length == 0 && (
                <div className="text-xs text-center mt-10">Nenhum número adicionado</div>
              )
            }
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-background min-h-[100px] resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Iniciar Conversa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
