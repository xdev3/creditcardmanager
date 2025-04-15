"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, X, Check, CreditCardIcon, Calendar, AlertTriangle } from "lucide-react"
import type { CreditCard } from "@/types/supabase"
import { formatCardNumber, formatExpiryDate, isExpiringSoon } from "@/lib/formatters"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion"

interface CardItemProps {
  card: CreditCard
  onUpdate: (card: CreditCard) => Promise<void>
  onDelete: () => Promise<void>
}

export default function CardItem({ card, onUpdate, onDelete }: CardItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedCard, setEditedCard] = useState<CreditCard>({ ...card })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const expiringSoon = isExpiringSoon(card.validade)

  const handleCheckboxChange = async (field: "usado" | "cashback_tirado") => {
    setIsUpdating(true)
    try {
      await onUpdate({
        ...card,
        [field]: !card[field],
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleEditSave = async () => {
    if (isEditing) {
      setIsUpdating(true)
      try {
        // Ensure card number is just digits
        const cleanedNumber = editedCard.numero.replace(/\D/g, "")
        await onUpdate({
          ...editedCard,
          numero: cleanedNumber,
        })
      } finally {
        setIsUpdating(false)
      }
    }
    setIsEditing(!isEditing)
  }

  const handleCancelEdit = () => {
    setEditedCard({ ...card })
    setIsEditing(false)
  }

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setEditedCard({ ...editedCard, numero: formatCardNumber(value) })
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setEditedCard({ ...editedCard, validade: formatExpiryDate(value) })
  }

  const formatCardNumberDisplay = (number: string) => {
    // Show only last 4 digits for security
    const cleanNumber = number.replace(/\D/g, "")
    if (cleanNumber.length > 4) {
      return "•••• •••• •••• " + cleanNumber.slice(-4)
    }
    return formatCardNumber(cleanNumber)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={expiringSoon ? "border-yellow-500 dark:border-yellow-400" : ""}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                {isEditing ? (
                  <Input
                    type="text"
                    value={editedCard.nome}
                    onChange={(e) => setEditedCard({ ...editedCard, nome: e.target.value })}
                    className="max-w-[200px]"
                  />
                ) : (
                  card.nome
                )}
              </CardTitle>
              {expiringSoon && (
                <div className="flex items-center text-yellow-600 dark:text-yellow-400 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  <span>Expirando em breve</span>
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={handleEditSave} disabled={isUpdating}>
                {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </Button>
              {isEditing ? (
                <Button variant="outline" size="icon" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)} disabled={isDeleting}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Número:</span>
              <div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editedCard.numero}
                    onChange={handleCardNumberChange}
                    className="max-w-[200px]"
                    maxLength={19}
                  />
                ) : (
                  formatCardNumberDisplay(card.numero)
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Validade:</span>
              <div>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editedCard.validade}
                    onChange={handleExpiryDateChange}
                    className="max-w-[100px]"
                    maxLength={5}
                  />
                ) : (
                  card.validade
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`usado-${card.id}`}
              checked={card.usado}
              onCheckedChange={() => handleCheckboxChange("usado")}
              disabled={isUpdating}
            />
            <Label htmlFor={`usado-${card.id}`}>Usado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`cashback-${card.id}`}
              checked={card.cashback_tirado}
              onCheckedChange={() => handleCheckboxChange("cashback_tirado")}
              disabled={isUpdating}
            />
            <Label htmlFor={`cashback-${card.id}`}>Cashback Tirado</Label>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cartão {card.nome}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
