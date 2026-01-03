'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface InputLoadingProps {
    loading?: boolean
    value: any
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: () => void,
    disabled?: boolean
}

export default function InputLoading({ loading, value, onChange, onBlur, disabled}: InputLoadingProps) {


    return (
        <div>
            <Input
                disabled={loading || disabled}
                id="phone"
                type="tel"
                placeholder="(00) 0 0000-0000"
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                maxLength={18}                
                className="bg-background"
            />

            {loading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
        </div>
    )
}